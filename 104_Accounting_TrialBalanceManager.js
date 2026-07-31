/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 104_Accounting_TrialBalanceManager.gs
 * Module      : Accounting
 * Class       : AccountingTrialBalanceManager
 * Version     : 1.0.0
 * Description : Trial Balance Management Service
 * =============================================================================
 */

'use strict';

class AccountingTrialBalanceManager extends BaseService {

  constructor() {

    super("AccountingTrialBalanceManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._trialBalances = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(balanceId, data) {

    if (this.exists(balanceId)) {

      return false;

    }

    this._trialBalances[balanceId] = Object.assign({

      period: "",

      account: "",

      debit: 0,

      credit: 0,

      status: "Draft"

    }, data || {});

    return true;

  }

  update(balanceId, data) {

    if (!this.exists(balanceId)) {

      return false;

    }

    Object.assign(

      this._trialBalances[balanceId],

      data || {}

    );

    return true;

  }

  get(balanceId) {

    return this._trialBalances[balanceId] || null;

  }

  getAll() {

    return this._trialBalances;

  }

  exists(balanceId) {

    return this._trialBalances.hasOwnProperty(balanceId);

  }

  remove(balanceId) {

    if (!this.exists(balanceId)) {

      return false;

    }

    delete this._trialBalances[balanceId];

    return true;

  }

  clear() {

    this._trialBalances = {};

    return true;

  }

  count() {

    return Object.keys(this._trialBalances).length;

  }

  keys() {

    return Object.keys(this._trialBalances);

  }

  //=========================================================================
  // Workflow
  //=========================================================================

  approve(balanceId) {

    if (!this.exists(balanceId)) {

      return false;

    }

    this._trialBalances[balanceId].status = "Approved";

    return true;

  }

  finalize(balanceId) {

    if (!this.exists(balanceId)) {

      return false;

    }

    this._trialBalances[balanceId].status = "Finalized";

    return true;

  }

  lock(balanceId) {

    if (!this.exists(balanceId)) {

      return false;

    }

    this._trialBalances[balanceId].status = "Locked";

    return true;

  }

  unlock(balanceId) {

    if (!this.exists(balanceId)) {

      return false;

    }

    this._trialBalances[balanceId].status = "Approved";

    return true;

  }

  reopen(balanceId) {

    if (!this.exists(balanceId)) {

      return false;

    }

    this._trialBalances[balanceId].status = "Draft";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getDraft() {

    return this.filter(balance =>
      balance.status === "Draft"
    );

  }

  getApproved() {

    return this.filter(balance =>
      balance.status === "Approved"
    );

  }

  getFinalized() {

    return this.filter(balance =>
      balance.status === "Finalized"
    );

  }

  getLocked() {

    return this.filter(balance =>
      balance.status === "Locked"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._trialBalances).forEach(id => {

      if (callback(this._trialBalances[id])) {

        results[id] = this._trialBalances[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      trialBalances: this.count(),

      draft: Object.keys(this.getDraft()).length,

      approved: Object.keys(this.getApproved()).length,

      finalized: Object.keys(this.getFinalized()).length,

      locked: Object.keys(this.getLocked()).length

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

      trialBalances: this.getAll(),

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

function registerAccountingTrialBalanceManager() {
function bootAccountingTrialBalanceManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "Accounting",
      "TrialBalanceManager",
      new AccountingTrialBalanceManager()
    );
  }
}
}