/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 88_Purchase_RFQManager.gs
 * Version     : 1.0.0
 * Description : Purchase Request For Quotation (RFQ) Manager
 * =============================================================================
 */

'use strict';

class PurchaseRFQManager extends BaseService {

  constructor() {

    super("PurchaseRFQManager");

    this.initialize();

  }

  //==========================================================================
  // Initialization
  //==========================================================================

  initialize() {

    super.initialize();

    this._rfqs = {};

    return this;

  }

  //==========================================================================
  // CRUD
  //==========================================================================

  create(code, data) {

    this._rfqs[code] = Object.assign({}, data);

    return this;

  }

  update(code, data) {

    if (!this.exists(code)) {

      return false;

    }

    Object.assign(this._rfqs[code], data);

    return true;

  }

  remove(code) {

    if (!this.exists(code)) {

      return false;

    }

    delete this._rfqs[code];

    return true;

  }

  clear() {

    this._rfqs = {};

    return true;

  }

  get(code) {

    return this._rfqs[code] || null;

  }

  getAll() {

    return Object.assign({}, this._rfqs);

  }

  all() {

    return this.getAll();

  }

  exists(code) {

    return this._rfqs.hasOwnProperty(code);

  }

  count() {

    return Object.keys(this._rfqs).length;

  }

  keys() {

    return Object.keys(this._rfqs);

  }

  //==========================================================================
  // Status Management
  //==========================================================================

  approve(code) {

    if (!this.exists(code)) {

      return false;

    }

    this._rfqs[code].status = "Approved";

    return true;

  }

  cancel(code) {

    if (!this.exists(code)) {

      return false;

    }

    this._rfqs[code].status = "Cancelled";

    return true;

  }

  close(code) {

    if (!this.exists(code)) {

      return false;

    }

    this._rfqs[code].status = "Closed";

    return true;

  }

  reopen(code) {

    if (!this.exists(code)) {

      return false;

    }

    this._rfqs[code].status = "Open";

    return true;

  }

  //==========================================================================
  // Filters
  //==========================================================================

  getApproved() {

    return this.filterByStatus("Approved");

  }

  getCancelled() {

    return this.filterByStatus("Cancelled");

  }

  getClosed() {

    return this.filterByStatus("Closed");

  }

  getOpen() {

    return this.filterByStatus("Open");

  }

  filterByStatus(status) {

    const result = {};

    Object.keys(this._rfqs).forEach(code => {

      if (this._rfqs[code].status === status) {

        result[code] = this._rfqs[code];

      }

    });

    return result;

  }

  //==========================================================================
  // Statistics
  //==========================================================================

  statistics() {

    return {

      rfqs: this.count(),

      approved: Object.keys(this.getApproved()).length,

      cancelled: Object.keys(this.getCancelled()).length,

      closed: Object.keys(this.getClosed()).length,

      open: Object.keys(this.getOpen()).length

    };

  }

  //==========================================================================
  // Health
  //==========================================================================

  health() {

    return {

      healthy: true,

      initialized: this.isInitialized(),

      rfqs: this.count(),

      approved: Object.keys(this.getApproved()).length,

      cancelled: Object.keys(this.getCancelled()).length,

      closed: Object.keys(this.getClosed()).length,

      open: Object.keys(this.getOpen()).length

    };

  }

  //==========================================================================
  // Report
  //==========================================================================

  report() {

    return {

      statistics: this.statistics(),

      health: this.health(),

      rfqs: this.getAll()

    };

  }

  //==========================================================================
  // About
  //==========================================================================

  about() {

    return {

      service: this.getName(),

      version: this.getVersion(),

      initialized: this.isInitialized(),

      created: this.getCreatedTime(),

      statistics: this.statistics()

    };

  }

}

//==============================================================================
// Registration
//==============================================================================function bootPurchaseRFQManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "Purchase",
      "RFQManager",
      new PurchaseRFQManager()
    );
  }
}