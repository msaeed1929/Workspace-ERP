/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 113_Accounting_ARManager.gs
 * Module      : Accounting
 * Class       : AccountingARManager
 * Version     : 1.0.0
 * Description : Accounts Receivable Management Service
 * =============================================================================
 */

'use strict';

class AccountingARManager extends BaseService {

  constructor() {

    super("AccountingARManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._receivables = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(receivableId, data) {

    if (this.exists(receivableId)) {

      return false;

    }

    this._receivables[receivableId] = Object.assign({

      customer: "",

      invoice: "",

      amount: 0,

      dueDate: "",

      status: "Draft"

    }, data || {});

    return true;

  }

  update(receivableId, data) {

    if (!this.exists(receivableId)) {

      return false;

    }

    Object.assign(

      this._receivables[receivableId],

      data || {}

    );

    return true;

  }

  get(receivableId) {

    return this._receivables[receivableId] || null;

  }

  getAll() {

    return this._receivables;

  }

  exists(receivableId) {

    return this._receivables.hasOwnProperty(receivableId);

  }

  remove(receivableId) {

    if (!this.exists(receivableId)) {

      return false;

    }

    delete this._receivables[receivableId];

    return true;

  }

  clear() {

    this._receivables = {};

    return true;

  }

  count() {

    return Object.keys(this._receivables).length;

  }

  keys() {

    return Object.keys(this._receivables);

  }

  //=========================================================================
  // Workflow
  //=========================================================================

  approve(receivableId) {

    if (!this.exists(receivableId)) {

      return false;

    }

    this._receivables[receivableId].status = "Approved";

    return true;

  }

  receive(receivableId) {

    if (!this.exists(receivableId)) {

      return false;

    }

    this._receivables[receivableId].status = "Received";

    return true;

  }

  cancel(receivableId) {

    if (!this.exists(receivableId)) {

      return false;

    }

    this._receivables[receivableId].status = "Cancelled";

    return true;

  }

  reopen(receivableId) {

    if (!this.exists(receivableId)) {

      return false;

    }

    this._receivables[receivableId].status = "Draft";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getDraft() {

    return this.filter(receivable =>
      receivable.status === "Draft"
    );

  }

  getApproved() {

    return this.filter(receivable =>
      receivable.status === "Approved"
    );

  }

  getReceived() {

    return this.filter(receivable =>
      receivable.status === "Received"
    );

  }

  getCancelled() {

    return this.filter(receivable =>
      receivable.status === "Cancelled"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._receivables).forEach(id => {

      if (callback(this._receivables[id])) {

        results[id] = this._receivables[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      receivables: this.count(),

      draft: Object.keys(this.getDraft()).length,

      approved: Object.keys(this.getApproved()).length,

      received: Object.keys(this.getReceived()).length,

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

      receivables: this.getAll(),

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

function registerAccountingARManager() {
function bootAccountingARManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "Accounting",
      "ARManager",
      new AccountingARManager()
    );
  }
}
}