/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 105_AccountingFinancialStatementManager.gs
 * Module      : Accounting
 * Class       : AccountingFinancialStatementManager
 * Version     : 1.0.0
 * Description : Financial Statement Management Service
 * =============================================================================
 */

'use strict';

class AccountingFinancialStatementManager extends BaseService {

  constructor() {

    super("AccountingFinancialStatementManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._statements = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(statementId, data) {

    if (this.exists(statementId)) {

      return false;

    }

    this._statements[statementId] = Object.assign({

      name: "",

      period: "",

      type: "",

      generatedDate: "",

      status: "Draft"

    }, data || {});

    return true;

  }

  update(statementId, data) {

    if (!this.exists(statementId)) {

      return false;

    }

    Object.assign(

      this._statements[statementId],

      data || {}

    );

    return true;

  }

  get(statementId) {

    return this._statements[statementId] || null;

  }

  getAll() {

    return this._statements;

  }

  exists(statementId) {

    return this._statements.hasOwnProperty(statementId);

  }

  remove(statementId) {

    if (!this.exists(statementId)) {

      return false;

    }

    delete this._statements[statementId];

    return true;

  }

  clear() {

    this._statements = {};

    return true;

  }

  count() {

    return Object.keys(this._statements).length;

  }

  keys() {

    return Object.keys(this._statements);

  }

  //=========================================================================
  // Workflow
  //=========================================================================

  approve(statementId) {

    if (!this.exists(statementId)) {

      return false;

    }

    this._statements[statementId].status = "Approved";

    return true;

  }

  publish(statementId) {

    if (!this.exists(statementId)) {

      return false;

    }

    this._statements[statementId].status = "Published";

    return true;

  }

  archive(statementId) {

    if (!this.exists(statementId)) {

      return false;

    }

    this._statements[statementId].status = "Archived";

    return true;

  }

  reopen(statementId) {

    if (!this.exists(statementId)) {

      return false;

    }

    this._statements[statementId].status = "Draft";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getDraft() {

    return this.filter(statement =>
      statement.status === "Draft"
    );

  }

  getApproved() {

    return this.filter(statement =>
      statement.status === "Approved"
    );

  }

  getPublished() {

    return this.filter(statement =>
      statement.status === "Published"
    );

  }

  getArchived() {

    return this.filter(statement =>
      statement.status === "Archived"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._statements).forEach(id => {

      if (callback(this._statements[id])) {

        results[id] = this._statements[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      statements: this.count(),

      draft: Object.keys(this.getDraft()).length,

      approved: Object.keys(this.getApproved()).length,

      published: Object.keys(this.getPublished()).length,

      archived: Object.keys(this.getArchived()).length

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

      statements: this.getAll(),

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

function registerAccountingFinancialStatementManager() {
function bootAccountingFinancialStatementManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "Accounting",
      "FinancialStatementManager",
      new AccountingFinancialStatementManager()
    );
  }
}
}