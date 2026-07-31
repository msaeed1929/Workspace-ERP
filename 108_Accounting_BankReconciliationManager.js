/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 108_Accounting_BankReconciliationManager.gs
 * Module      : Accounting
 * Class       : AccountingBankReconciliationManager
 * Version     : 1.0.0
 * Description : Bank Reconciliation Management Service
 * =============================================================================
 */

'use strict';

class AccountingBankReconciliationManager extends BaseService {

  constructor() {

    super("AccountingBankReconciliationManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._reconciliations = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(reconciliationId, data) {

    if (this.exists(reconciliationId)) {

      return false;

    }

    this._reconciliations[reconciliationId] = Object.assign({

      account: "",

      statementDate: "",

      bookBalance: 0,

      bankBalance: 0,

      status: "Draft"

    }, data || {});

    return true;

  }

  update(reconciliationId, data) {

    if (!this.exists(reconciliationId)) {

      return false;

    }

    Object.assign(

      this._reconciliations[reconciliationId],

      data || {}

    );

    return true;

  }

  get(reconciliationId) {

    return this._reconciliations[reconciliationId] || null;

  }

  getAll() {

    return this._reconciliations;

  }

  exists(reconciliationId) {

    return this._reconciliations.hasOwnProperty(reconciliationId);

  }

  remove(reconciliationId) {

    if (!this.exists(reconciliationId)) {

      return false;

    }

    delete this._reconciliations[reconciliationId];

    return true;

  }

  clear() {

    this._reconciliations = {};

    return true;

  }

  count() {

    return Object.keys(this._reconciliations).length;

  }

  keys() {

    return Object.keys(this._reconciliations);

  }

  //=========================================================================
  // Workflow
  //=========================================================================

  approve(reconciliationId) {

    if (!this.exists(reconciliationId)) {

      return false;

    }

    this._reconciliations[reconciliationId].status = "Approved";

    return true;

  }

  reconcile(reconciliationId) {

    if (!this.exists(reconciliationId)) {

      return false;

    }

    this._reconciliations[reconciliationId].status = "Reconciled";

    return true;

  }

  close(reconciliationId) {

    if (!this.exists(reconciliationId)) {

      return false;

    }

    this._reconciliations[reconciliationId].status = "Closed";

    return true;

  }

  reopen(reconciliationId) {

    if (!this.exists(reconciliationId)) {

      return false;

    }

    this._reconciliations[reconciliationId].status = "Draft";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getDraft() {

    return this.filter(reconciliation =>
      reconciliation.status === "Draft"
    );

  }

  getApproved() {

    return this.filter(reconciliation =>
      reconciliation.status === "Approved"
    );

  }

  getReconciled() {

    return this.filter(reconciliation =>
      reconciliation.status === "Reconciled"
    );

  }

  getClosed() {

    return this.filter(reconciliation =>
      reconciliation.status === "Closed"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._reconciliations).forEach(id => {

      if (callback(this._reconciliations[id])) {

        results[id] = this._reconciliations[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      reconciliations: this.count(),

      draft: Object.keys(this.getDraft()).length,

      approved: Object.keys(this.getApproved()).length,

      reconciled: Object.keys(this.getReconciled()).length,

      closed: Object.keys(this.getClosed()).length

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

      reconciliations: this.getAll(),

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

function registerAccountingBankReconciliationManager() {
function bootAccountingBankReconciliationManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "Accounting",
      "BankReconciliationManager",
      new AccountingBankReconciliationManager()
    );
  }
}
}