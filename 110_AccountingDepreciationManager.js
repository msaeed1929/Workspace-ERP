/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 110_Accounting_DepreciationManager.gs
 * Module      : Accounting
 * Class       : AccountingDepreciationManager
 * Version     : 1.0.0
 * Description : Depreciation Management Service
 * =============================================================================
 */

'use strict';

class AccountingDepreciationManager extends BaseService {

  constructor() {

    super("AccountingDepreciationManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._depreciations = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(depreciationId, data) {

    if (this.exists(depreciationId)) {

      return false;

    }

    this._depreciations[depreciationId] = Object.assign({

      asset: "",

      method: "",

      amount: 0,

      period: "",

      status: "Draft"

    }, data || {});

    return true;

  }

  update(depreciationId, data) {

    if (!this.exists(depreciationId)) {

      return false;

    }

    Object.assign(

      this._depreciations[depreciationId],

      data || {}

    );

    return true;

  }

  get(depreciationId) {

    return this._depreciations[depreciationId] || null;

  }

  getAll() {

    return this._depreciations;

  }

  exists(depreciationId) {

    return this._depreciations.hasOwnProperty(depreciationId);

  }

  remove(depreciationId) {

    if (!this.exists(depreciationId)) {

      return false;

    }

    delete this._depreciations[depreciationId];

    return true;

  }

  clear() {

    this._depreciations = {};

    return true;

  }

  count() {

    return Object.keys(this._depreciations).length;

  }

  keys() {

    return Object.keys(this._depreciations);

  }

  //=========================================================================
  // Workflow
  //=========================================================================

  approve(depreciationId) {

    if (!this.exists(depreciationId)) {

      return false;

    }

    this._depreciations[depreciationId].status = "Approved";

    return true;

  }

  post(depreciationId) {

    if (!this.exists(depreciationId)) {

      return false;

    }

    this._depreciations[depreciationId].status = "Posted";

    return true;

  }

  reverse(depreciationId) {

    if (!this.exists(depreciationId)) {

      return false;

    }

    this._depreciations[depreciationId].status = "Reversed";

    return true;

  }

  reopen(depreciationId) {

    if (!this.exists(depreciationId)) {

      return false;

    }

    this._depreciations[depreciationId].status = "Draft";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getDraft() {

    return this.filter(depreciation =>
      depreciation.status === "Draft"
    );

  }

  getApproved() {

    return this.filter(depreciation =>
      depreciation.status === "Approved"
    );

  }

  getPosted() {

    return this.filter(depreciation =>
      depreciation.status === "Posted"
    );

  }

  getReversed() {

    return this.filter(depreciation =>
      depreciation.status === "Reversed"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._depreciations).forEach(id => {

      if (callback(this._depreciations[id])) {

        results[id] = this._depreciations[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      depreciations: this.count(),

      draft: Object.keys(this.getDraft()).length,

      approved: Object.keys(this.getApproved()).length,

      posted: Object.keys(this.getPosted()).length,

      reversed: Object.keys(this.getReversed()).length

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

      depreciations: this.getAll(),

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

function registerAccountingDepreciationManager() {
function bootAccountingDepreciationManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "Accounting",
      "DepreciationManager",
      new AccountingDepreciationManager()
    );
  }
}
}