/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 93_Inventory_StockTransferManager.gs
 * Version     : 1.0.0
 * Description : Inventory Stock Transfer Manager
 * =============================================================================
 */

'use strict';

class InventoryStockTransferManager extends BaseService {

  //=========================================================================
  // Constructor
  //=========================================================================

  constructor() {

    super("InventoryStockTransferManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._transfers = {};

    return this;

  }

  //=========================================================================
  // Create
  //=========================================================================

  create(id, data) {

    if (!id)
      return false;

    if (this.exists(id))
      return false;

    this._transfers[id] = Object.assign({

      item: "",

      fromWarehouse: "",

      toWarehouse: "",

      quantity: 0,

      status: "Draft"

    }, data || {});

    return true;

  }

  //=========================================================================
  // Update
  //=========================================================================

  update(id, data) {

    if (!this.exists(id))
      return false;

    Object.assign(

      this._transfers[id],

      data || {}

    );

    return true;

  }

  //=========================================================================
  // Get
  //=========================================================================

  get(id) {

    return this._transfers[id] || null;

  }

  all() {

    return Object.assign(

      {},

      this._transfers

    );

  }

  exists(id) {

    return this._transfers.hasOwnProperty(id);

  }

  remove(id) {

    if (!this.exists(id))
      return false;

    delete this._transfers[id];

    return true;

  }

  clear() {

    this._transfers = {};

    return true;

  }

  count() {

    return Object.keys(

      this._transfers

    ).length;

  }

  keys() {

    return Object.keys(

      this._transfers

    );

  }

  values() {

    return Object.values(

      this._transfers

    );

  }

  //=========================================================================
  // Workflow
  //=========================================================================

  approve(id) {

    if (!this.exists(id))
      return false;

    this._transfers[id].status = "Approved";

    return true;

  }

  dispatch(id) {

    if (!this.exists(id))
      return false;

    this._transfers[id].status = "In Transit";

    return true;

  }

  receive(id) {

    if (!this.exists(id))
      return false;

    this._transfers[id].status = "Received";

    return true;

  }

  complete(id) {

    if (!this.exists(id))
      return false;

    this._transfers[id].status = "Completed";

    return true;

  }

  cancel(id) {

    if (!this.exists(id))
      return false;

    this._transfers[id].status = "Cancelled";

    return true;

  }

  reopen(id) {

    if (!this.exists(id))
      return false;

    this._transfers[id].status = "Draft";

    return true;

  }

  //=========================================================================
  // Filters
  //=========================================================================

  getDraft() {

    return this.filterByStatus(

      "Draft"

    );

  }

  getApproved() {

    return this.filterByStatus(

      "Approved"

    );

  }

  getTransit() {

    return this.filterByStatus(

      "In Transit"

    );

  }

  getReceived() {

    return this.filterByStatus(

      "Received"

    );

  }

  getCompleted() {

    return this.filterByStatus(

      "Completed"

    );

  }

  getCancelled() {

    return this.filterByStatus(

      "Cancelled"

    );

  }

  filterByStatus(status) {

    const result = {};

    Object.keys(this._transfers)

      .forEach(id => {

        if (

          this._transfers[id].status === status

        ) {

          result[id] =

            this._transfers[id];

        }

      });

    return result;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      transfers: this.count(),

      draft: Object.keys(this.getDraft()).length,

      approved: Object.keys(this.getApproved()).length,

      transit: Object.keys(this.getTransit()).length,

      received: Object.keys(this.getReceived()).length,

      completed: Object.keys(this.getCompleted()).length,

      cancelled: Object.keys(this.getCancelled()).length

    };

  }

  //=========================================================================
  // Health
  //=========================================================================

  health() {

    const stats = this.statistics();

    return {

      service: this.getName(),

      version: this.getVersion(),

      initialized: this.isInitialized(),

      healthy: true,

      status: "READY",

      transfers: stats.transfers,

      draft: stats.draft,

      approved: stats.approved,

      transit: stats.transit,

      received: stats.received,

      completed: stats.completed,

      cancelled: stats.cancelled

    };

  }

  //=========================================================================
  // Report
  //=========================================================================

  report() {

    return {

      statistics: this.statistics(),

      health: this.health(),

      transfers: this.all()

    };

  }

  //=========================================================================
  // Info
  //=========================================================================

  info() {

    return {

      service: this.getName(),

      version: this.getVersion(),

      created: this.getCreatedTime(),

      initialized: this.isInitialized(),

      statistics: this.statistics()

    };

  }

}

//==============================================================================
// Registration
//==============================================================================function bootInventoryStockTransferManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "Inventory",
      "StockTransferManager",
      new InventoryStockTransferManager()
    );
  }
}