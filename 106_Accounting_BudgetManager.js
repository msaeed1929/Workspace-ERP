/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 106_Accounting_BudgetManager.gs
 * Module      : Accounting
 * Class       : AccountingBudgetManager
 * Version     : 1.0.0
 * Description : Budget Management Service
 * =============================================================================
 */

'use strict';

class AccountingBudgetManager extends BaseService {

  constructor() {

    super("AccountingBudgetManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._budgets = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(budgetId, data) {

    if (this.exists(budgetId)) {

      return false;

    }

    this._budgets[budgetId] = Object.assign({

      account: "",

      fiscalYear: "",

      department: "",

      amount: 0,

      status: "Draft"

    }, data || {});

    return true;

  }

  update(budgetId, data) {

    if (!this.exists(budgetId)) {

      return false;

    }

    Object.assign(

      this._budgets[budgetId],

      data || {}

    );

    return true;

  }

  get(budgetId) {

    return this._budgets[budgetId] || null;

  }

  getAll() {

    return this._budgets;

  }

  exists(budgetId) {

    return this._budgets.hasOwnProperty(budgetId);

  }

  remove(budgetId) {

    if (!this.exists(budgetId)) {

      return false;

    }

    delete this._budgets[budgetId];

    return true;

  }

  clear() {

    this._budgets = {};

    return true;

  }

  count() {

    return Object.keys(this._budgets).length;

  }

  keys() {

    return Object.keys(this._budgets);

  }

  //=========================================================================
  // Workflow
  //=========================================================================

  approve(budgetId) {

    if (!this.exists(budgetId)) {

      return false;

    }

    this._budgets[budgetId].status = "Approved";

    return true;

  }

  activate(budgetId) {

    if (!this.exists(budgetId)) {

      return false;

    }

    this._budgets[budgetId].status = "Active";

    return true;

  }

  close(budgetId) {

    if (!this.exists(budgetId)) {

      return false;

    }

    this._budgets[budgetId].status = "Closed";

    return true;

  }

  reopen(budgetId) {

    if (!this.exists(budgetId)) {

      return false;

    }

    this._budgets[budgetId].status = "Draft";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getDraft() {

    return this.filter(budget =>
      budget.status === "Draft"
    );

  }

  getApproved() {

    return this.filter(budget =>
      budget.status === "Approved"
    );

  }

  getActive() {

    return this.filter(budget =>
      budget.status === "Active"
    );

  }

  getClosed() {

    return this.filter(budget =>
      budget.status === "Closed"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._budgets).forEach(id => {

      if (callback(this._budgets[id])) {

        results[id] = this._budgets[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      budgets: this.count(),

      draft: Object.keys(this.getDraft()).length,

      approved: Object.keys(this.getApproved()).length,

      active: Object.keys(this.getActive()).length,

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

      budgets: this.getAll(),

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

function registerAccountingBudgetManager() {
  WEF.ServiceContainer.registerModuleService(
    "Accounting",
    "BudgetManager",
    new AccountingBudgetManager()
  );
}