/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 112_Accounting_APManager.gs
 * Module      : Accounting
 * Class       : AccountingAPManager
 * Version     : 1.0.0
 * Description : Accounts Payable Management Service
 * =============================================================================
 */

'use strict';

class AccountingAPManager extends BaseService {

  constructor() {

    super("AccountingAPManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._payables = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(payableId, data) {

    if (this.exists(payableId)) {

      return false;

    }

    this._payables[payableId] = Object.assign({

      vendor: "",

      invoice: "",

      amount: 0,

      dueDate: "",

      status: "Draft"

    }, data || {});

    return true;

  }

  update(payableId, data) {

    if (!this.exists(payableId)) {

      return false;

    }

    Object.assign(

      this._payables[payableId],

      data || {}

    );

    return true;

  }

  get(payableId) {

    return this._payables[payableId] || null;

  }

  getAll() {

    return this._payables;

  }

  exists(payableId) {

    return this._payables.hasOwnProperty(payableId);

  }

  remove(payableId) {

    if (!this.exists(payableId)) {

      return false;

    }

    delete this._payables[payableId];

    return true;

  }

  clear() {

    this._payables = {};

    return true;

  }

  count() {

    return Object.keys(this._payables).length;

  }

  keys() {

    return Object.keys(this._payables);

  }

  //=========================================================================
  // Workflow
  //=========================================================================

  approve(payableId) {

    if (!this.exists(payableId)) {

      return false;

    }

    this._payables[payableId].status = "Approved";

    return true;

  }

  pay(payableId) {

    if (!this.exists(payableId)) {

      return false;

    }

    this._payables[payableId].status = "Paid";

    return true;

  }

  cancel(payableId) {

    if (!this.exists(payableId)) {

      return false;

    }

    this._payables[payableId].status = "Cancelled";

    return true;

  }

  reopen(payableId) {

    if (!this.exists(payableId)) {

      return false;

    }

    this._payables[payableId].status = "Draft";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getDraft() {

    return this.filter(payable =>
      payable.status === "Draft"
    );

  }

  getApproved() {

    return this.filter(payable =>
      payable.status === "Approved"
    );

  }

  getPaid() {

    return this.filter(payable =>
      payable.status === "Paid"
    );

  }

  getCancelled() {

    return this.filter(payable =>
      payable.status === "Cancelled"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._payables).forEach(id => {

      if (callback(this._payables[id])) {

        results[id] = this._payables[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      payables: this.count(),

      draft: Object.keys(this.getDraft()).length,

      approved: Object.keys(this.getApproved()).length,

      paid: Object.keys(this.getPaid()).length,

      cancelled: Object.keys(this.getCancelled()).length

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

      payables: this.getAll(),

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

function registerAccountingAPManager() {
function bootAccountingAPManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "Accounting",
      "APManager",
      new AccountingAPManager()
    );
  }
}
}