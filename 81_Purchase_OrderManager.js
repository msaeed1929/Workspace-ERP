/**
 * ============================================================================
 * WEF ERP Framework
 * Purchase Order Manager
 * Version: 1.0.0
 * ============================================================================
 */

'use strict';

class PurchaseOrderManager extends BaseService {

  //===========================================================================
  // Constructor
  //===========================================================================

  constructor() {

    super("PurchaseOrderManager");

    this._orders = {};

  }

  //===========================================================================
  // Initialization
  //===========================================================================

  initialize() {

    super.initialize();

    this._orders = {};

    return this;

  }

  //===========================================================================
  // CRUD
  //===========================================================================

  create(orderNo, order) {

    this._orders[orderNo] = order;

    return true;

  }

  exists(orderNo) {

    return orderNo in this._orders;

  }

  get(orderNo) {

    return this._orders[orderNo] || null;

  }

  update(orderNo, order) {

    if (!this.exists(orderNo)) {

      return false;

    }

    this._orders[orderNo] = order;

    return true;

  }

  remove(orderNo) {

    if (!this.exists(orderNo)) {

      return false;

    }

    delete this._orders[orderNo];

    return true;

  }

  all() {

    return this._orders;

  }

  numbers() {

    return Object.keys(this._orders);

  }

  count() {

    return this.numbers().length;

  }

  clear() {

    this._orders = {};

    return true;

  }

  //===========================================================================
  // Purchase Order Workflow
  //===========================================================================

  approve(orderNo) {

    if (!this.exists(orderNo)) {

      return false;

    }

    this._orders[orderNo].status = "Approved";

    return true;

  }

  cancel(orderNo) {

    if (!this.exists(orderNo)) {

      return false;

    }

    this._orders[orderNo].status = "Cancelled";

    return true;

  }

  close(orderNo) {

    if (!this.exists(orderNo)) {

      return false;

    }

    this._orders[orderNo].status = "Closed";

    return true;

  }

  reopen(orderNo) {

    if (!this.exists(orderNo)) {

      return false;

    }

    this._orders[orderNo].status = "Open";

    return true;

  }

  //===========================================================================
  // Status Collections
  //===========================================================================

  getApproved() {

    var data = {};

    Object.keys(this._orders).forEach(function(orderNo) {

      if (this._orders[orderNo].status === "Approved") {

        data[orderNo] = this._orders[orderNo];

      }

    }, this);

    return data;

  }

  getCancelled() {

    var data = {};

    Object.keys(this._orders).forEach(function(orderNo) {

      if (this._orders[orderNo].status === "Cancelled") {

        data[orderNo] = this._orders[orderNo];

      }

    }, this);

    return data;

  }

  getClosed() {

    var data = {};

    Object.keys(this._orders).forEach(function(orderNo) {

      if (this._orders[orderNo].status === "Closed") {

        data[orderNo] = this._orders[orderNo];

      }

    }, this);

    return data;

  }

  getOpen() {

    var data = {};

    Object.keys(this._orders).forEach(function(orderNo) {

      if (this._orders[orderNo].status === "Open") {

        data[orderNo] = this._orders[orderNo];

      }

    }, this);

    return data;

  }

  //===========================================================================
  // Statistics
  //===========================================================================

  statistics() {

    return {

      orders: this.count(),

      open: Object.keys(this.getOpen()).length,

      approved: Object.keys(this.getApproved()).length,

      cancelled: Object.keys(this.getCancelled()).length,

      closed: Object.keys(this.getClosed()).length

    };

  }

  //===========================================================================
  // Health
  //===========================================================================

  health() {

    var stats = this.statistics();

    return {

      initialized: this.isInitialized(),

      healthy: true,

      orders: stats.orders,

      open: stats.open,

      approved: stats.approved,

      cancelled: stats.cancelled,

      closed: stats.closed

    };

  }

  //===========================================================================
  // Report
  //===========================================================================

  report() {

    return {

      orders: this.all(),

      statistics: this.statistics(),

      health: this.health()

    };

  }

  //===========================================================================
  // About
  //===========================================================================

  about() {

    return {

      service: "PurchaseOrderManager",

      version: "1.0.0",

      initialized: this.isInitialized(),

      created: this.getCreatedTime(),

      statistics: this.statistics()

    };

  }

}

//==============================================================================
// Registration
//==============================================================================

WEF.ServiceContainer.registerModuleService(
  "Purchase",
  "OrderManager",
  new PurchaseOrderManager()
);