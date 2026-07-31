/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * -----------------------------------------------------------------------------
 * File        : 78_Sales_TaxManager.gs
 * Version     : 1.0.0
 * Description : Sales Tax Manager
 * =============================================================================
 */

'use strict';

class SalesTaxManager extends BaseService {

  //===========================================================================
  // Constructor
  //===========================================================================

  constructor() {

    super("SalesTaxManager");

    this._taxes = {};

  }

  //===========================================================================
  // Initialization
  //===========================================================================

  initialize() {

    super.initialize();

    this._taxes = {};

    return this;

  }

  //===========================================================================
  // CRUD
  //===========================================================================

  create(taxCode, data) {

    this._taxes[taxCode] = data;

    return true;

  }

  exists(taxCode) {

    return taxCode in this._taxes;

  }

  get(taxCode) {

    return this._taxes[taxCode] || null;

  }

  update(taxCode, data) {

    if (!this.exists(taxCode)) {

      return false;

    }

    this._taxes[taxCode] = data;

    return true;

  }

  remove(taxCode) {

    if (!this.exists(taxCode)) {

      return false;

    }

    delete this._taxes[taxCode];

    return true;

  }

  clear() {

    this._taxes = {};

    return true;

  }

  all() {

    return this._taxes;

  }

  numbers() {

    return Object.keys(this._taxes);

  }

  count() {

    return this.numbers().length;

  }

  //===========================================================================
  // Business Operations
  //===========================================================================

  activate(taxCode) {

    if (!this.exists(taxCode)) {

      return false;

    }

    this._taxes[taxCode].status = "Active";

    return true;

  }

  deactivate(taxCode) {

    if (!this.exists(taxCode)) {

      return false;

    }

    this._taxes[taxCode].status = "Inactive";

    return true;

  }

  expire(taxCode) {

    if (!this.exists(taxCode)) {

      return false;

    }

    this._taxes[taxCode].status = "Expired";

    return true;

  }

  reopen(taxCode) {

    if (!this.exists(taxCode)) {

      return false;

    }

    this._taxes[taxCode].status = "Draft";

    return true;

  }

  //===========================================================================
  // Status Filters
  //===========================================================================

  active() {

    var result = {};

    Object.keys(this._taxes).forEach(function(taxCode) {

      if (this._taxes[taxCode].status === "Active") {

        result[taxCode] =
          this._taxes[taxCode];

      }

    }, this);

    return result;

  }

  inactive() {

    var result = {};

    Object.keys(this._taxes).forEach(function(taxCode) {

      if (this._taxes[taxCode].status === "Inactive") {

        result[taxCode] =
          this._taxes[taxCode];

      }

    }, this);

    return result;

  }

  expired() {

    var result = {};

    Object.keys(this._taxes).forEach(function(taxCode) {

      if (this._taxes[taxCode].status === "Expired") {

        result[taxCode] =
          this._taxes[taxCode];

      }

    }, this);

    return result;

  }

  drafts() {

    var result = {};

    Object.keys(this._taxes).forEach(function(taxCode) {

      if (this._taxes[taxCode].status === "Draft") {

        result[taxCode] =
          this._taxes[taxCode];

      }

    }, this);

    return result;

  }

  //===========================================================================
  // Reporting
  //===========================================================================

  report() {

    return {

      taxes    : this.count(),

      active   : Object.keys(this.active()).length,

      inactive : Object.keys(this.inactive()).length,

      expired  : Object.keys(this.expired()).length,

      drafts   : Object.keys(this.drafts()).length

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

      taxes      : this.all(),

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
//==============================================================================function bootSalesTaxManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "Sales",
      "TaxManager",
      new SalesTaxManager()
    );
  }
}