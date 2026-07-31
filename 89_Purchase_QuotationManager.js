/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 89_Purchase_QuotationManager.gs
 * Version     : 1.0.0
 * Description : Purchase Quotation Manager
 * =============================================================================
 */

'use strict';

class PurchaseQuotationManager extends BaseService {

  constructor() {

    super("PurchaseQuotationManager");

    this.initialize();

  }

  //==========================================================================
  // Initialization
  //==========================================================================

  initialize() {

    super.initialize();

    this._quotations = {};

    return this;

  }

  //==========================================================================
  // CRUD
  //==========================================================================

  create(code, data) {

    this._quotations[code] = Object.assign({}, data);

    return this;

  }

  update(code, data) {

    if (!this.exists(code)) {

      return false;

    }

    Object.assign(this._quotations[code], data);

    return true;

  }

  remove(code) {

    if (!this.exists(code)) {

      return false;

    }

    delete this._quotations[code];

    return true;

  }

  clear() {

    this._quotations = {};

    return true;

  }

  get(code) {

    return this._quotations[code] || null;

  }

  getAll() {

    return Object.assign({}, this._quotations);

  }

  all() {

    return this.getAll();

  }

  exists(code) {

    return this._quotations.hasOwnProperty(code);

  }

  count() {

    return Object.keys(this._quotations).length;

  }

  keys() {

    return Object.keys(this._quotations);

  }

  //==========================================================================
  // Status Management
  //==========================================================================

  approve(code) {

    if (!this.exists(code)) {

      return false;

    }

    this._quotations[code].status = "Approved";

    return true;

  }

  reject(code) {

    if (!this.exists(code)) {

      return false;

    }

    this._quotations[code].status = "Rejected";

    return true;

  }

  close(code) {

    if (!this.exists(code)) {

      return false;

    }

    this._quotations[code].status = "Closed";

    return true;

  }

  reopen(code) {

    if (!this.exists(code)) {

      return false;

    }

    this._quotations[code].status = "Open";

    return true;

  }

  //==========================================================================
  // Filters
  //==========================================================================

  getApproved() {

    return this.filterByStatus("Approved");

  }

  getRejected() {

    return this.filterByStatus("Rejected");

  }

  getClosed() {

    return this.filterByStatus("Closed");

  }

  getOpen() {

    return this.filterByStatus("Open");

  }

  filterByStatus(status) {

    const result = {};

    Object.keys(this._quotations).forEach(code => {

      if (this._quotations[code].status === status) {

        result[code] = this._quotations[code];

      }

    });

    return result;

  }

  //==========================================================================
  // Statistics
  //==========================================================================

  statistics() {

    return {

      quotations: this.count(),

      approved: Object.keys(this.getApproved()).length,

      rejected: Object.keys(this.getRejected()).length,

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

      quotations: this.count(),

      approved: Object.keys(this.getApproved()).length,

      rejected: Object.keys(this.getRejected()).length,

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

      quotations: this.getAll()

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
//==============================================================================function bootPurchaseQuotationManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "Purchase",
      "QuotationManager",
      new PurchaseQuotationManager()
    );
  }
}