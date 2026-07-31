/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 97_Inventory_ReservationManager.gs
 * Module      : Inventory
 * Class       : InventoryReservationManager
 * Version     : 1.0.0
 * Description : Inventory Reservation Management Service
 * =============================================================================
 */

'use strict';

class InventoryReservationManager extends BaseService {

  constructor() {

    super("InventoryReservationManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._reservations = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(reservationNo, data) {

    if (this.exists(reservationNo)) {

      return false;

    }

    this._reservations[reservationNo] = Object.assign({

      item: "",

      warehouse: "",

      quantity: 0,

      reservedFor: "",

      status: "Draft"

    }, data || {});

    return true;

  }

  update(reservationNo, data) {

    if (!this.exists(reservationNo)) {

      return false;

    }

    Object.assign(

      this._reservations[reservationNo],

      data || {}

    );

    return true;

  }

  get(reservationNo) {

    return this._reservations[reservationNo] || null;

  }

  getAll() {

    return this._reservations;

  }

  exists(reservationNo) {

    return this._reservations.hasOwnProperty(reservationNo);

  }

  remove(reservationNo) {

    if (!this.exists(reservationNo)) {

      return false;

    }

    delete this._reservations[reservationNo];

    return true;

  }

  clear() {

    this._reservations = {};

    return true;

  }

  count() {

    return Object.keys(this._reservations).length;

  }

  keys() {

    return Object.keys(this._reservations);

  }

  //=========================================================================
  // Status Management
  //=========================================================================

  approve(reservationNo) {

    if (!this.exists(reservationNo)) {

      return false;

    }

    this._reservations[reservationNo].status = "Approved";

    return true;

  }

  reserve(reservationNo) {

    if (!this.exists(reservationNo)) {

      return false;

    }

    this._reservations[reservationNo].status = "Reserved";

    return true;

  }

  fulfill(reservationNo) {

    if (!this.exists(reservationNo)) {

      return false;

    }

    this._reservations[reservationNo].status = "Fulfilled";

    return true;

  }

  release(reservationNo) {

    if (!this.exists(reservationNo)) {

      return false;

    }

    this._reservations[reservationNo].status = "Released";

    return true;

  }

  cancel(reservationNo) {

    if (!this.exists(reservationNo)) {

      return false;

    }

    this._reservations[reservationNo].status = "Cancelled";

    return true;

  }

  reopen(reservationNo) {

    if (!this.exists(reservationNo)) {

      return false;

    }

    this._reservations[reservationNo].status = "Draft";

    return true;

  }

  //=========================================================================
  // Filters
  //=========================================================================

  getDraft() {

    return Object.fromEntries(

      Object.entries(this._reservations).filter(

        ([, reservation]) => reservation.status === "Draft"

      )

    );

  }

  getApproved() {

    return Object.fromEntries(

      Object.entries(this._reservations).filter(

        ([, reservation]) => reservation.status === "Approved"

      )

    );

  }

  getReserved() {

    return Object.fromEntries(

      Object.entries(this._reservations).filter(

        ([, reservation]) => reservation.status === "Reserved"

      )

    );

  }

  getFulfilled() {

    return Object.fromEntries(

      Object.entries(this._reservations).filter(

        ([, reservation]) => reservation.status === "Fulfilled"

      )

    );

  }

  getReleased() {

    return Object.fromEntries(

      Object.entries(this._reservations).filter(

        ([, reservation]) => reservation.status === "Released"

      )

    );

  }

  getCancelled() {

    return Object.fromEntries(

      Object.entries(this._reservations).filter(

        ([, reservation]) => reservation.status === "Cancelled"

      )

    );

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      reservations: this.count(),

      draft: Object.keys(this.getDraft()).length,

      approved: Object.keys(this.getApproved()).length,

      reserved: Object.keys(this.getReserved()).length,

      fulfilled: Object.keys(this.getFulfilled()).length,

      released: Object.keys(this.getReleased()).length,

      cancelled: Object.keys(this.getCancelled()).length

    };

  }

  //=========================================================================
  // Health
  //=========================================================================

  health() {

    return {

      initialized: this.isInitialized(),

      healthy: true,

      service: this.getName(),

      version: this.getVersion(),

      status: "READY",

      ...this.statistics()

    };

  }

  //=========================================================================
  // Report
  //=========================================================================

  report() {

    return {

      reservations: this.getAll(),

      statistics: this.statistics(),

      health: this.health()

    };

  }

  //=========================================================================
  // Information
  //=========================================================================

  info() {

    return {

      service: this.getName(),

      version: this.getVersion(),

      initialized: this.isInitialized(),

      created: this.getCreatedTime(),

      statistics: this.statistics()

    };

  }

}

//=============================================================================
// Module Registration
//=============================================================================function bootInventoryReservationManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "Inventory",
      "ReservationManager",
      new InventoryReservationManager()
    );
  }
}