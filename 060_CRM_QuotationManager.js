/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 60_CRM_QuotationManager.gs
 * Version     : 1.0.0
 * Description : CRM Quotation Manager
 * =============================================================================
 */

'use strict';

class CRMQuotationManager extends BaseService {

  constructor() {

    super("CRMQuotationManager");

    this.initialize();

  }

  initialize() {

    super.initialize();

    this._quotations = {};

    return this;

  }

  //=========================================================================
  // Quotations
  //=========================================================================

  create(number, quotation) {

    if (this.exists(number))
      return null;

    this._quotations[number] = quotation;

    return quotation;

  }

  exists(number) {

    return !!this._quotations[number];

  }

  get(number) {

    return this._quotations[number] || null;

  }

  update(number, quotation) {

    if (!this.exists(number))
      return null;

    this._quotations[number] = quotation;

    return quotation;

  }

  remove(number) {

    if (!this.exists(number))
      return false;

    delete this._quotations[number];

    return true;

  }

  all() {

    return this._quotations;

  }

  numbers() {

    return Object.keys(this._quotations);

  }

  count() {

    return this.numbers().length;

  }

  //=========================================================================
  // Status
  //=========================================================================

  approve(number) {

    if (!this.exists(number))
      return false;

    this._quotations[number].status = "Approved";

    return true;

  }

  reject(number) {

    if (!this.exists(number))
      return false;

    this._quotations[number].status = "Rejected";

    return true;

  }

  expire(number) {

    if (!this.exists(number))
      return false;

    this._quotations[number].status = "Expired";

    return true;

  }

  draft(number) {

    if (!this.exists(number))
      return false;

    this._quotations[number].status = "Draft";

    return true;

  }

  //=========================================================================
  // Filters
  //=========================================================================

  approved() {

    var quotations = {};

    Object.keys(this._quotations).forEach(function(number){

      if (this._quotations[number].status === "Approved")
        quotations[number] = this._quotations[number];

    }, this);

    return quotations;

  }

  rejected() {

    var quotations = {};

    Object.keys(this._quotations).forEach(function(number){

      if (this._quotations[number].status === "Rejected")
        quotations[number] = this._quotations[number];

    }, this);

    return quotations;

  }

  expired() {

    var quotations = {};

    Object.keys(this._quotations).forEach(function(number){

      if (this._quotations[number].status === "Expired")
        quotations[number] = this._quotations[number];

    }, this);

    return quotations;

  }

  drafts() {

    var quotations = {};

    Object.keys(this._quotations).forEach(function(number){

      if (this._quotations[number].status === "Draft")
        quotations[number] = this._quotations[number];

    }, this);

    return quotations;

  }

  //=========================================================================
  // Maintenance
  //=========================================================================

  clear() {

    this._quotations = {};

    return true;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      quotations: this.count(),
      approved: Object.keys(this.approved()).length,
      rejected: Object.keys(this.rejected()).length,
      expired: Object.keys(this.expired()).length,
      drafts: Object.keys(this.drafts()).length

    };

  }

  health() {

    return {

      initialized: this.isInitialized(),
      healthy: true,
      quotations: this.count(),
      approved: Object.keys(this.approved()).length,
      rejected: Object.keys(this.rejected()).length,
      expired: Object.keys(this.expired()).length,
      drafts: Object.keys(this.drafts()).length

    };

  }

  report() {

    return {

      quotations: this.all(),
      statistics: this.statistics(),
      health: this.health()

    };

  }

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

//==============================================================================
// CRM Registration
//==============================================================================function bootCRMQuotationManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "CRM",
      "QuotationManager",
      new CRMQuotationManager()
    );
  }
}