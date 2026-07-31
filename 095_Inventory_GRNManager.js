/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 95_Inventory_GRNManager.gs
 * Module      : Inventory
 * Class       : InventoryGRNManager
 * Version     : 1.0.0
 * Description : Goods Receipt Note (GRN) Management Service
 * =============================================================================
 */

'use strict';

class InventoryGRNManager extends BaseService {

  constructor() {

    super("InventoryGRNManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._grns = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(grnNo, data) {

    if (this.exists(grnNo)) {

      return false;

    }

    this._grns[grnNo] = Object.assign({

      po: "",

      vendor: "",

      warehouse: "",

      items: [],

      status: "Draft"

    }, data || {});

    return true;

  }

  update(grnNo, data) {

    if (!this.exists(grnNo)) {

      return false;

    }

    Object.assign(

      this._grns[grnNo],

      data || {}

    );

    return true;

  }

  get(grnNo) {

    return this._grns[grnNo] || null;

  }

  getAll() {

    return this._grns;

  }

  exists(grnNo) {

    return this._grns.hasOwnProperty(grnNo);

  }

  remove(grnNo) {

    if (!this.exists(grnNo)) {

      return false;

    }

    delete this._grns[grnNo];

    return true;

  }

  clear() {

    this._grns = {};

    return true;

  }

  count() {

    return Object.keys(this._grns).length;

  }

  keys() {

    return Object.keys(this._grns);

  }

  //=========================================================================
  // Status Management
  //=========================================================================

  approve(grnNo) {

    if (!this.exists(grnNo)) {

      return false;

    }

    this._grns[grnNo].status = "Approved";

    return true;

  }

  receive(grnNo) {

    if (!this.exists(grnNo)) {

      return false;

    }

    this._grns[grnNo].status = "Received";

    return true;

  }

  close(grnNo) {

    if (!this.exists(grnNo)) {

      return false;

    }

    this._grns[grnNo].status = "Closed";

    return true;

  }

  cancel(grnNo) {

    if (!this.exists(grnNo)) {

      return false;

    }

    this._grns[grnNo].status = "Cancelled";

    return true;

  }

  reopen(grnNo) {

    if (!this.exists(grnNo)) {

      return false;

    }

    this._grns[grnNo].status = "Draft";

    return true;

  }

  //=========================================================================
  // Filters
  //=========================================================================

  getDraft() {

    return Object.fromEntries(

      Object.entries(this._grns).filter(

        ([, grn]) => grn.status === "Draft"

      )

    );

  }

  getApproved() {

    return Object.fromEntries(

      Object.entries(this._grns).filter(

        ([, grn]) => grn.status === "Approved"

      )

    );

  }

  getReceived() {

    return Object.fromEntries(

      Object.entries(this._grns).filter(

        ([, grn]) => grn.status === "Received"

      )

    );

  }

  getClosed() {

    return Object.fromEntries(

      Object.entries(this._grns).filter(

        ([, grn]) => grn.status === "Closed"

      )

    );

  }

  getCancelled() {

    return Object.fromEntries(

      Object.entries(this._grns).filter(

        ([, grn]) => grn.status === "Cancelled"

      )

    );

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      grns: this.count(),

      draft: Object.keys(this.getDraft()).length,

      approved: Object.keys(this.getApproved()).length,

      received: Object.keys(this.getReceived()).length,

      closed: Object.keys(this.getClosed()).length,

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

      grns: this.getAll(),

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
//=============================================================================function bootInventoryGRNManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "Inventory",
      "GRNManager",
      new InventoryGRNManager()
    );
  }
}