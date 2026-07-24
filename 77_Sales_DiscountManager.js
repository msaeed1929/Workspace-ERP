/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * -----------------------------------------------------------------------------
 * File        : 77_Sales_DiscountManager.gs
 * Version     : 1.0.0
 * Description : Sales Discount Manager
 * =============================================================================
 */

'use strict';

class SalesDiscountManager extends BaseService {

  //===========================================================================
  // Constructor
  //===========================================================================

  constructor() {

    super("SalesDiscountManager");

    this._discounts = {};

  }

  //===========================================================================
  // Initialization
  //===========================================================================

  initialize() {

    super.initialize();

    this._discounts = {};

    return this;

  }

  //===========================================================================
  // CRUD
  //===========================================================================

  create(discountCode, data) {

    this._discounts[discountCode] = data;

    return true;

  }

  exists(discountCode) {

    return discountCode in this._discounts;

  }

  get(discountCode) {

    return this._discounts[discountCode] || null;

  }

  update(discountCode, data) {

    if (!this.exists(discountCode)) {

      return false;

    }

    this._discounts[discountCode] = data;

    return true;

  }

  remove(discountCode) {

    if (!this.exists(discountCode)) {

      return false;

    }

    delete this._discounts[discountCode];

    return true;

  }

  clear() {

    this._discounts = {};

    return true;

  }

  all() {

    return this._discounts;

  }

  numbers() {

    return Object.keys(this._discounts);

  }

  count() {

    return this.numbers().length;

  }

  //===========================================================================
  // Business Operations
  //===========================================================================

  activate(discountCode) {

    if (!this.exists(discountCode)) {

      return false;

    }

    this._discounts[discountCode].status = "Active";

    return true;

  }

  deactivate(discountCode) {

    if (!this.exists(discountCode)) {

      return false;

    }

    this._discounts[discountCode].status = "Inactive";

    return true;

  }

  expire(discountCode) {

    if (!this.exists(discountCode)) {

      return false;

    }

    this._discounts[discountCode].status = "Expired";

    return true;

  }

  reopen(discountCode) {

    if (!this.exists(discountCode)) {

      return false;

    }

    this._discounts[discountCode].status = "Draft";

    return true;

  }

  //===========================================================================
  // Status Filters
  //===========================================================================

  active() {

    var result = {};

    Object.keys(this._discounts).forEach(function(discountCode) {

      if (this._discounts[discountCode].status === "Active") {

        result[discountCode] =
          this._discounts[discountCode];

      }

    }, this);

    return result;

  }

  inactive() {

    var result = {};

    Object.keys(this._discounts).forEach(function(discountCode) {

      if (this._discounts[discountCode].status === "Inactive") {

        result[discountCode] =
          this._discounts[discountCode];

      }

    }, this);

    return result;

  }

  expired() {

    var result = {};

    Object.keys(this._discounts).forEach(function(discountCode) {

      if (this._discounts[discountCode].status === "Expired") {

        result[discountCode] =
          this._discounts[discountCode];

      }

    }, this);

    return result;

  }

  drafts() {

    var result = {};

    Object.keys(this._discounts).forEach(function(discountCode) {

      if (this._discounts[discountCode].status === "Draft") {

        result[discountCode] =
          this._discounts[discountCode];

      }

    }, this);

    return result;

  }

  //===========================================================================
  // Reporting
  //===========================================================================

  report() {

    return {

      discounts : this.count(),

      active    : Object.keys(this.active()).length,

      inactive  : Object.keys(this.inactive()).length,

      expired   : Object.keys(this.expired()).length,

      drafts    : Object.keys(this.drafts()).length

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

      discounts : this.all(),

      statistics : this.report(),

      health : this.health()

    };

  }

  about() {

    return {

      service : this.getName(),

      version : this.getVersion(),

      created : this.getCreatedTime(),

      initialized : this.isInitialized(),

      statistics : this.report()

    };

  }

}

//==============================================================================
// Sales Registration
//==============================================================================

WEF.ServiceContainer.registerModuleService(
  "Sales",
  "DiscountManager",
  new SalesDiscountManager()
);