/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 87_Purchase_VendorManager.gs
 * Version     : 1.0.0
 * Description : Purchase Vendor Manager
 * =============================================================================
 */

'use strict';

class PurchaseVendorManager extends BaseService {

  constructor() {

    super("PurchaseVendorManager");

    this.initialize();

  }

  //==========================================================================
  // Initialization
  //==========================================================================

  initialize() {

    super.initialize();

    this._vendors = {};

    return this;

  }

  //==========================================================================
  // CRUD
  //==========================================================================

  create(code, data) {

    this._vendors[code] = Object.assign({}, data);

    return this;

  }

  update(code, data) {

    if (!this.exists(code)) {

      return false;

    }

    Object.assign(this._vendors[code], data);

    return true;

  }

  remove(code) {

    if (!this.exists(code)) {

      return false;

    }

    delete this._vendors[code];

    return true;

  }

  clear() {

    this._vendors = {};

    return true;

  }

  get(code) {

    return this._vendors[code] || null;

  }

  getAll() {

    return Object.assign({}, this._vendors);

  }

  all() {

    return this.getAll();

  }

  exists(code) {

    return this._vendors.hasOwnProperty(code);

  }

  count() {

    return Object.keys(this._vendors).length;

  }

  keys() {

    return Object.keys(this._vendors);

  }

  //==========================================================================
  // Status Management
  //==========================================================================

  activate(code) {

    if (!this.exists(code)) {

      return false;

    }

    this._vendors[code].status = "Active";

    return true;

  }

  deactivate(code) {

    if (!this.exists(code)) {

      return false;

    }

    this._vendors[code].status = "Inactive";

    return true;

  }

  suspend(code) {

    if (!this.exists(code)) {

      return false;

    }

    this._vendors[code].status = "Suspended";

    return true;

  }

  reactivate(code) {

    if (!this.exists(code)) {

      return false;

    }

    this._vendors[code].status = "Active";

    return true;

  }

  //==========================================================================
  // Filters
  //==========================================================================

  getActive() {

    return this.filterByStatus("Active");

  }

  getInactive() {

    return this.filterByStatus("Inactive");

  }

  getSuspended() {

    return this.filterByStatus("Suspended");

  }

  filterByStatus(status) {

    const result = {};

    Object.keys(this._vendors).forEach(code => {

      if (this._vendors[code].status === status) {

        result[code] = this._vendors[code];

      }

    });

    return result;

  }

  //==========================================================================
  // Statistics
  //==========================================================================

  statistics() {

    return {

      vendors: this.count(),

      active: Object.keys(this.getActive()).length,

      inactive: Object.keys(this.getInactive()).length,

      suspended: Object.keys(this.getSuspended()).length

    };

  }

  //==========================================================================
  // Health
  //==========================================================================

  health() {

    return {

      healthy: true,

      initialized: this.isInitialized(),

      vendors: this.count(),

      active: Object.keys(this.getActive()).length,

      inactive: Object.keys(this.getInactive()).length,

      suspended: Object.keys(this.getSuspended()).length

    };

  }

  //==========================================================================
  // Report
  //==========================================================================

  report() {

    return {

      statistics: this.statistics(),

      health: this.health(),

      vendors: this.getAll()

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
//==============================================================================function bootPurchaseVendorManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "Purchase",
      "VendorManager",
      new PurchaseVendorManager()
    );
  }
}