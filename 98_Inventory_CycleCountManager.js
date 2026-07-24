/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 98_Inventory_CycleCountManager.gs
 * Module      : Inventory
 * Class       : InventoryCycleCountManager
 * Version     : 1.0.0
 * Description : Inventory Cycle Count Management Service
 * =============================================================================
 */

'use strict';

class InventoryCycleCountManager extends BaseService {

  constructor() {

    super("InventoryCycleCountManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._counts = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(countNo, data) {

    if (this.exists(countNo)) {

      return false;

    }

    this._counts[countNo] = Object.assign({

      warehouse: "",

      item: "",

      expectedQty: 0,

      countedQty: 0,

      variance: 0,

      status: "Draft"

    }, data || {});

    return true;

  }

  update(countNo, data) {

    if (!this.exists(countNo)) {

      return false;

    }

    Object.assign(

      this._counts[countNo],

      data || {}

    );

    return true;

  }

  get(countNo) {

    return this._counts[countNo] || null;

  }

  getAll() {

    return this._counts;

  }

  exists(countNo) {

    return this._counts.hasOwnProperty(countNo);

  }

  remove(countNo) {

    if (!this.exists(countNo)) {

      return false;

    }

    delete this._counts[countNo];

    return true;

  }

  clear() {

    this._counts = {};

    return true;

  }

  count() {

    return Object.keys(this._counts).length;

  }

  keys() {

    return Object.keys(this._counts);

  }

  //=========================================================================
  // Status Management
  //=========================================================================

  approve(countNo) {

    if (!this.exists(countNo)) {

      return false;

    }

    this._counts[countNo].status = "Approved";

    return true;

  }

  countStock(countNo) {

    if (!this.exists(countNo)) {

      return false;

    }

    const record = this._counts[countNo];

    record.variance =

      Number(record.countedQty) -

      Number(record.expectedQty);

    record.status = "Counted";

    return true;

  }

  reconcile(countNo) {

    if (!this.exists(countNo)) {

      return false;

    }

    this._counts[countNo].status = "Reconciled";

    return true;

  }

  close(countNo) {

    if (!this.exists(countNo)) {

      return false;

    }

    this._counts[countNo].status = "Closed";

    return true;

  }

  cancel(countNo) {

    if (!this.exists(countNo)) {

      return false;

    }

    this._counts[countNo].status = "Cancelled";

    return true;

  }

  reopen(countNo) {

    if (!this.exists(countNo)) {

      return false;

    }

    this._counts[countNo].status = "Draft";

    return true;

  }

  //=========================================================================
  // Filters
  //=========================================================================

  getDraft() {

    return Object.fromEntries(

      Object.entries(this._counts).filter(

        ([, count]) => count.status === "Draft"

      )

    );

  }

  getApproved() {

    return Object.fromEntries(

      Object.entries(this._counts).filter(

        ([, count]) => count.status === "Approved"

      )

    );

  }

  getCounted() {

    return Object.fromEntries(

      Object.entries(this._counts).filter(

        ([, count]) => count.status === "Counted"

      )

    );

  }

  getReconciled() {

    return Object.fromEntries(

      Object.entries(this._counts).filter(

        ([, count]) => count.status === "Reconciled"

      )

    );

  }

  getClosed() {

    return Object.fromEntries(

      Object.entries(this._counts).filter(

        ([, count]) => count.status === "Closed"

      )

    );

  }

  getCancelled() {

    return Object.fromEntries(

      Object.entries(this._counts).filter(

        ([, count]) => count.status === "Cancelled"

      )

    );

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      cycleCounts: this.count(),

      draft: Object.keys(this.getDraft()).length,

      approved: Object.keys(this.getApproved()).length,

      counted: Object.keys(this.getCounted()).length,

      reconciled: Object.keys(this.getReconciled()).length,

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

      cycleCounts: this.getAll(),

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
//=============================================================================

WEF.ServiceContainer.registerModuleService(
  "Inventory",
  "CycleCountManager",
  new InventoryCycleCountManager()
);