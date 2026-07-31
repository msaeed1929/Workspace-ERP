/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 103_Accounting_FiscalPeriodManager.gs
 * Module      : Accounting
 * Class       : AccountingFiscalPeriodManager
 * Version     : 1.0.0
 * Description : Fiscal Period Management Service
 * =============================================================================
 */

'use strict';

class AccountingFiscalPeriodManager extends BaseService {

  constructor() {

    super("AccountingFiscalPeriodManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._periods = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(periodId, data) {

    if (this.exists(periodId)) {

      return false;

    }

    this._periods[periodId] = Object.assign({

      name: "",

      startDate: "",

      endDate: "",

      year: "",

      status: "Draft"

    }, data || {});

    return true;

  }

  update(periodId, data) {

    if (!this.exists(periodId)) {

      return false;

    }

    Object.assign(

      this._periods[periodId],

      data || {}

    );

    return true;

  }

  get(periodId) {

    return this._periods[periodId] || null;

  }

  getAll() {

    return this._periods;

  }

  exists(periodId) {

    return this._periods.hasOwnProperty(periodId);

  }

  remove(periodId) {

    if (!this.exists(periodId)) {

      return false;

    }

    delete this._periods[periodId];

    return true;

  }

  clear() {

    this._periods = {};

    return true;

  }

  count() {

    return Object.keys(this._periods).length;

  }

  keys() {

    return Object.keys(this._periods);

  }

  //=========================================================================
  // Workflow
  //=========================================================================

  open(periodId) {

    if (!this.exists(periodId)) {

      return false;

    }

    this._periods[periodId].status = "Open";

    return true;

  }

  close(periodId) {

    if (!this.exists(periodId)) {

      return false;

    }

    this._periods[periodId].status = "Closed";

    return true;

  }

  lock(periodId) {

    if (!this.exists(periodId)) {

      return false;

    }

    this._periods[periodId].status = "Locked";

    return true;

  }

  unlock(periodId) {

    if (!this.exists(periodId)) {

      return false;

    }

    this._periods[periodId].status = "Open";

    return true;

  }

  reopen(periodId) {

    if (!this.exists(periodId)) {

      return false;

    }

    this._periods[periodId].status = "Draft";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getDraft() {

    return this.filter(period =>
      period.status === "Draft"
    );

  }

  getOpen() {

    return this.filter(period =>
      period.status === "Open"
    );

  }

  getClosed() {

    return this.filter(period =>
      period.status === "Closed"
    );

  }

  getLocked() {

    return this.filter(period =>
      period.status === "Locked"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._periods).forEach(id => {

      if (callback(this._periods[id])) {

        results[id] = this._periods[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      periods: this.count(),

      draft: Object.keys(this.getDraft()).length,

      open: Object.keys(this.getOpen()).length,

      closed: Object.keys(this.getClosed()).length,

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

      periods: this.getAll(),

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

function registerAccountingFiscalPeriodManager() {
function bootAccountingFiscalPeriodManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "Accounting",
      "FiscalPeriodManager",
      new AccountingFiscalPeriodManager()
    );
  }
}
}