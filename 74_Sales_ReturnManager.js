/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * -----------------------------------------------------------------------------
 * File        : 74_Sales_ReturnManager.gs
 * Version     : 1.0.0
 * Description : Sales Return Manager
 * =============================================================================
 */

'use strict';

class SalesReturnManager extends BaseService {

  //===========================================================================
  // Constructor
  //===========================================================================

  constructor() {

    super("SalesReturnManager");

    this._returns = {};

  }

  //===========================================================================
  // Initialization
  //===========================================================================

  initialize() {

    super.initialize();

    this._returns = {};

    return this;

  }

  //===========================================================================
  // CRUD
  //===========================================================================

  create(returnNo, data) {

    this._returns[returnNo] = data;

    return true;

  }

  exists(returnNo) {

    return returnNo in this._returns;

  }

  get(returnNo) {

    return this._returns[returnNo] || null;

  }

  update(returnNo, data) {

    if (!this.exists(returnNo)) {

      return false;

    }

    this._returns[returnNo] = data;

    return true;

  }

  remove(returnNo) {

    if (!this.exists(returnNo)) {

      return false;

    }

    delete this._returns[returnNo];

    return true;

  }

  clear() {

    this._returns = {};

    return true;

  }

  all() {

    return this._returns;

  }

  numbers() {

    return Object.keys(this._returns);

  }

  count() {

    return this.numbers().length;

  }

  //===========================================================================
  // Return Status
  //===========================================================================

  approve(returnNo) {

    if (!this.exists(returnNo)) {

      return false;

    }

    this._returns[returnNo].status = "Approved";

    return true;

  }

  reject(returnNo) {

    if (!this.exists(returnNo)) {

      return false;

    }

    this._returns[returnNo].status = "Rejected";

    return true;

  }

  receive(returnNo) {

    if (!this.exists(returnNo)) {

      return false;

    }

    this._returns[returnNo].status = "Received";

    return true;

  }

  close(returnNo) {

    if (!this.exists(returnNo)) {

      return false;

    }

    this._returns[returnNo].status = "Closed";

    return true;

  }

  reopen(returnNo) {

    if (!this.exists(returnNo)) {

      return false;

    }

    this._returns[returnNo].status = "Open";

    return true;

  }

  //===========================================================================
  // Filters
  //===========================================================================

  approved() {

    var result = {};

    Object.keys(this._returns).forEach(function(returnNo) {

      if (this._returns[returnNo].status === "Approved") {

        result[returnNo] = this._returns[returnNo];

      }

    }, this);

    return result;

  }

  rejected() {

    var result = {};

    Object.keys(this._returns).forEach(function(returnNo) {

      if (this._returns[returnNo].status === "Rejected") {

        result[returnNo] = this._returns[returnNo];

      }

    }, this);

    return result;

  }

  received() {

    var result = {};

    Object.keys(this._returns).forEach(function(returnNo) {

      if (this._returns[returnNo].status === "Received") {

        result[returnNo] = this._returns[returnNo];

      }

    }, this);

    return result;

  }

  closed() {

    var result = {};

    Object.keys(this._returns).forEach(function(returnNo) {

      if (this._returns[returnNo].status === "Closed") {

        result[returnNo] = this._returns[returnNo];

      }

    }, this);

    return result;

  }

  openReturns() {

    var result = {};

    Object.keys(this._returns).forEach(function(returnNo) {

      if (this._returns[returnNo].status === "Open") {

        result[returnNo] = this._returns[returnNo];

      }

    }, this);

    return result;

  }

  //===========================================================================
  // Reporting
  //===========================================================================

  report() {

    return {

      returns: this.count(),

      open: Object.keys(this.openReturns()).length,

      approved: Object.keys(this.approved()).length,

      rejected: Object.keys(this.rejected()).length,

      received: Object.keys(this.received()).length,

      closed: Object.keys(this.closed()).length

    };

  }

  health() {

    var report = this.report();

    report.initialized = this.isInitialized();
    report.healthy = true;

    return report;

  }

  snapshot() {

    return {

      returns: this.all(),

      statistics: this.report(),

      health: this.health()

    };

  }

  about() {

    return {

      service: this.getName(),

      version: this.getVersion(),

      created: this.getCreatedTime(),

      initialized: this.isInitialized(),

      statistics: this.report()

    };

  }

}

//==============================================================================
// Sales Registration
//==============================================================================function bootSalesReturnManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "Sales",
      "ReturnManager",
      new SalesReturnManager()
    );
  }
}