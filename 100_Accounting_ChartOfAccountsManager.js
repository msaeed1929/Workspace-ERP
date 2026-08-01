/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 100_Accounting_ChartOfAccountsManager.gs
 * Module      : Accounting
 * Class       : AccountingChartOfAccountsManager
 * Version     : 1.0.0
 * Description : Chart of Accounts Management Service
 * =============================================================================
 */

'use strict';

class AccountingChartOfAccountsManager extends BaseService {

  constructor() {

    super("AccountingChartOfAccountsManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._accounts = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(accountCode, data) {

    if (this.exists(accountCode)) {

      return false;

    }

    this._accounts[accountCode] = Object.assign({

      name: "",

      type: "",

      category: "",

      parent: "",

      balance: 0,

      status: "Inactive"

    }, data || {});

    return true;

  }

  update(accountCode, data) {

    if (!this.exists(accountCode)) {

      return false;

    }

    Object.assign(

      this._accounts[accountCode],

      data || {}

    );

    return true;

  }

  get(accountCode) {

    return this._accounts[accountCode] || null;

  }

  getAll() {

    return this._accounts;

  }

  exists(accountCode) {

    return this._accounts.hasOwnProperty(accountCode);

  }

  remove(accountCode) {

    if (!this.exists(accountCode)) {

      return false;

    }

    delete this._accounts[accountCode];

    return true;

  }

  clear() {

    this._accounts = {};

    return true;

  }

  count() {

    return Object.keys(this._accounts).length;

  }

  keys() {

    return Object.keys(this._accounts);

  }

  //=========================================================================
  // Status Management
  //=========================================================================

  activate(accountCode) {

    if (!this.exists(accountCode)) {

      return false;

    }

    this._accounts[accountCode].status = "Active";

    return true;

  }

  deactivate(accountCode) {

    if (!this.exists(accountCode)) {

      return false;

    }

    this._accounts[accountCode].status = "Inactive";

    return true;

  }

  lock(accountCode) {

    if (!this.exists(accountCode)) {

      return false;

    }

    this._accounts[accountCode].status = "Locked";

    return true;

  }

  unlock(accountCode) {

    if (!this.exists(accountCode)) {

      return false;

    }

    this._accounts[accountCode].status = "Active";

    return true;

  }

  //=========================================================================
  // Filters
  //=========================================================================

  getActive() {

    return Object.fromEntries(

      Object.entries(this._accounts).filter(

        ([, account]) => account.status === "Active"

      )

    );

  }

  getInactive() {

    return Object.fromEntries(

      Object.entries(this._accounts).filter(

        ([, account]) => account.status === "Inactive"

      )

    );

  }

  getLocked() {

    return Object.fromEntries(

      Object.entries(this._accounts).filter(

        ([, account]) => account.status === "Locked"

      )

    );

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      accounts: this.count(),

      active: Object.keys(this.getActive()).length,

      inactive: Object.keys(this.getInactive()).length,

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

      accounts: this.getAll(),

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

function bootAccountingChartOfAccountsManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "Accounting",
      "ChartOfAccountsManager",
      new AccountingChartOfAccountsManager()
    );
  }
}
