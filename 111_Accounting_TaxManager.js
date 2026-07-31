/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 111_Accounting_TaxManager.gs
 * Module      : Accounting
 * Class       : AccountingTaxManager
 * Version     : 1.0.0
 * Description : Tax Management Service
 * =============================================================================
 */

'use strict';

class AccountingTaxManager extends BaseService {

  constructor() {

    super("AccountingTaxManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._taxes = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(taxId, data) {

    if (this.exists(taxId)) {

      return false;

    }

    this._taxes[taxId] = Object.assign({

      name: "",

      type: "",

      rate: 0,

      jurisdiction: "",

      status: "Draft"

    }, data || {});

    return true;

  }

  update(taxId, data) {

    if (!this.exists(taxId)) {

      return false;

    }

    Object.assign(

      this._taxes[taxId],

      data || {}

    );

    return true;

  }

  get(taxId) {

    return this._taxes[taxId] || null;

  }

  getAll() {

    return this._taxes;

  }

  exists(taxId) {

    return this._taxes.hasOwnProperty(taxId);

  }

  remove(taxId) {

    if (!this.exists(taxId)) {

      return false;

    }

    delete this._taxes[taxId];

    return true;

  }

  clear() {

    this._taxes = {};

    return true;

  }

  count() {

    return Object.keys(this._taxes).length;

  }

  keys() {

    return Object.keys(this._taxes);

  }

  //=========================================================================
  // Workflow
  //=========================================================================

  approve(taxId) {

    if (!this.exists(taxId)) {

      return false;

    }

    this._taxes[taxId].status = "Approved";

    return true;

  }

  activate(taxId) {

    if (!this.exists(taxId)) {

      return false;

    }

    this._taxes[taxId].status = "Active";

    return true;

  }

  deactivate(taxId) {

    if (!this.exists(taxId)) {

      return false;

    }

    this._taxes[taxId].status = "Inactive";

    return true;

  }

  reopen(taxId) {

    if (!this.exists(taxId)) {

      return false;

    }

    this._taxes[taxId].status = "Draft";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getDraft() {

    return this.filter(tax =>
      tax.status === "Draft"
    );

  }

  getApproved() {

    return this.filter(tax =>
      tax.status === "Approved"
    );

  }

  getFiled() {

    return this.filter(tax =>
      tax.status === "Filed"
    );

  }

  getPaid() {

    return this.filter(tax =>
      tax.status === "Paid"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._taxes).forEach(id => {

      if (callback(this._taxes[id])) {

        results[id] = this._taxes[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      taxes: this.count(),

      draft: Object.keys(this.getDraft()).length,

      approved: Object.keys(this.getApproved()).length,

      filed: Object.keys(this.getFiled()).length,

      paid: Object.keys(this.getPaid()).length

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

      taxes: this.getAll(),

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

function registerAccountingTaxManager() {
function bootAccountingTaxManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "Accounting",
      "TaxManager",
      new AccountingTaxManager()
    );
  }
}
}