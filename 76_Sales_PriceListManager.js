/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * -----------------------------------------------------------------------------
 * File        : 76_Sales_PriceListManager.gs
 * Version     : 1.0.0
 * Description : Sales Price List Manager
 * =============================================================================
 */

'use strict';

class SalesPriceListManager extends BaseService {

  //===========================================================================
  // Constructor
  //===========================================================================

  constructor() {

    super("SalesPriceListManager");

    this._priceLists = {};

  }

  //===========================================================================
  // Initialization
  //===========================================================================

  initialize() {

    super.initialize();

    this._priceLists = {};

    return this;

  }

  //===========================================================================
  // CRUD
  //===========================================================================

  create(priceListCode, data) {

    this._priceLists[priceListCode] = data;

    return true;

  }

  exists(priceListCode) {

    return priceListCode in this._priceLists;

  }

  get(priceListCode) {

    return this._priceLists[priceListCode] || null;

  }

  update(priceListCode, data) {

    if (!this.exists(priceListCode)) {

      return false;

    }

    this._priceLists[priceListCode] = data;

    return true;

  }

  remove(priceListCode) {

    if (!this.exists(priceListCode)) {

      return false;

    }

    delete this._priceLists[priceListCode];

    return true;

  }

  clear() {

    this._priceLists = {};

    return true;

  }

  all() {

    return this._priceLists;

  }

  numbers() {

    return Object.keys(this._priceLists);

  }

  count() {

    return this.numbers().length;

  }

  //===========================================================================
  // Business Operations
  //===========================================================================

  activate(priceListCode) {

    if (!this.exists(priceListCode)) {

      return false;

    }

    this._priceLists[priceListCode].status = "Active";

    return true;

  }

  deactivate(priceListCode) {

    if (!this.exists(priceListCode)) {

      return false;

    }

    this._priceLists[priceListCode].status = "Inactive";

    return true;

  }

  expire(priceListCode) {

    if (!this.exists(priceListCode)) {

      return false;

    }

    this._priceLists[priceListCode].status = "Expired";

    return true;

  }

  reopen(priceListCode) {

    if (!this.exists(priceListCode)) {

      return false;

    }

    this._priceLists[priceListCode].status = "Draft";

    return true;

  }

  //===========================================================================
  // Status Filters
  //===========================================================================

  active() {

    var result = {};

    Object.keys(this._priceLists).forEach(function(priceListCode) {

      if (this._priceLists[priceListCode].status === "Active") {

        result[priceListCode] =
          this._priceLists[priceListCode];

      }

    }, this);

    return result;

  }

  inactive() {

    var result = {};

    Object.keys(this._priceLists).forEach(function(priceListCode) {

      if (this._priceLists[priceListCode].status === "Inactive") {

        result[priceListCode] =
          this._priceLists[priceListCode];

      }

    }, this);

    return result;

  }

  expired() {

    var result = {};

    Object.keys(this._priceLists).forEach(function(priceListCode) {

      if (this._priceLists[priceListCode].status === "Expired") {

        result[priceListCode] =
          this._priceLists[priceListCode];

      }

    }, this);

    return result;

  }

  drafts() {

    var result = {};

    Object.keys(this._priceLists).forEach(function(priceListCode) {

      if (this._priceLists[priceListCode].status === "Draft") {

        result[priceListCode] =
          this._priceLists[priceListCode];

      }

    }, this);

    return result;

  }

  //===========================================================================
  // Reporting
  //===========================================================================

  report() {

    return {

      priceLists : this.count(),

      active     : Object.keys(this.active()).length,

      inactive   : Object.keys(this.inactive()).length,

      expired    : Object.keys(this.expired()).length,

      drafts     : Object.keys(this.drafts()).length

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

      priceLists : this.all(),

      statistics : this.report(),

      health     : this.health()

    };

  }

  about() {

    return {

      service     : this.getName(),

      version     : this.getVersion(),

      created     : this.getCreatedTime(),

      initialized : this.isInitialized(),

      statistics  : this.report()

    };

  }

}

//==============================================================================
// Sales Registration
//==============================================================================function bootSalesPriceListManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "Sales",
      "PriceListManager",
      new SalesPriceListManager()
    );
  }
}