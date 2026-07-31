/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 115_Accounting_ClosingManager.gs
 * Module      : Accounting
 * Class       : AccountingClosingManager
 * Version     : 1.0.0
 * Description : Accounting Period Closing Management Service
 * =============================================================================
 */

'use strict';

class AccountingClosingManager extends BaseService {

  constructor() {

    super("AccountingClosingManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._closings = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(closingId, data) {

    if (this.exists(closingId)) {

      return false;

    }

    this._closings[closingId] = Object.assign({

      period: "",

      closingDate: "",

      preparedBy: "",

      notes: "",

      status: "Draft"

    }, data || {});

    return true;

  }

  update(closingId, data) {

    if (!this.exists(closingId)) {

      return false;

    }

    Object.assign(

      this._closings[closingId],

      data || {}

    );

    return true;

  }

  get(closingId) {

    return this._closings[closingId] || null;

  }

  getAll() {

    return this._closings;

  }

  exists(closingId) {

    return this._closings.hasOwnProperty(closingId);

  }

  remove(closingId) {

    if (!this.exists(closingId)) {

      return false;

    }

    delete this._closings[closingId];

    return true;

  }

  clear() {

    this._closings = {};

    return true;

  }

  count() {

    return Object.keys(this._closings).length;

  }

  keys() {

    return Object.keys(this._closings);

  }

  //=========================================================================
  // Workflow
  //=========================================================================

  approve(closingId) {

    if (!this.exists(closingId)) {

      return false;

    }

    this._closings[closingId].status = "Approved";

    return true;

  }

  close(closingId) {

    if (!this.exists(closingId)) {

      return false;

    }

    this._closings[closingId].status = "Closed";

    return true;

  }

  reopen(closingId) {

    if (!this.exists(closingId)) {

      return false;

    }

    this._closings[closingId].status = "Draft";

    return true;

  }

  archive(closingId) {

    if (!this.exists(closingId)) {

      return false;

    }

    this._closings[closingId].status = "Archived";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getDraft() {

    return this.filter(closing =>
      closing.status === "Draft"
    );

  }

  getApproved() {

    return this.filter(closing =>
      closing.status === "Approved"
    );

  }

  getClosed() {

    return this.filter(closing =>
      closing.status === "Closed"
    );

  }

  getArchived() {

    return this.filter(closing =>
      closing.status === "Archived"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._closings).forEach(id => {

      if (callback(this._closings[id])) {

        results[id] = this._closings[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      closings: this.count(),

      draft: Object.keys(this.getDraft()).length,

      approved: Object.keys(this.getApproved()).length,

      closed: Object.keys(this.getClosed()).length,

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

      closings: this.getAll(),

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

function registerAccountingClosingManager() {
  WEF.ServiceContainer.registerModuleService(
    "Accounting",
    "ClosingManager",
    new AccountingClosingManager()
  );
}