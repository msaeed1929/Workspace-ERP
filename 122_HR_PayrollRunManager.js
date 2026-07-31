/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 122_HR_PayrollRunManager.gs
 * Module      : Human Resources
 * Class       : HRPayrollRunManager
 * Version     : 1.0.0
 * Description : HR Payroll Run Management Service
 * =============================================================================
 */

'use strict';

class HRPayrollRunManager extends BaseService {

  constructor() {

    super("HRPayrollRunManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._payrollRuns = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(runId, data) {

    if (this.exists(runId)) {

      return false;

    }

    this._payrollRuns[runId] = Object.assign({

      payrollMonth: "",

      payrollYear: "",

      processedBy: "",

      processDate: "",

      totalEmployees: 0,

      totalGross: 0,

      totalNet: 0,

      notes: "",

      status: "Draft"

    }, data || {});

    return true;

  }

  update(runId, data) {

    if (!this.exists(runId)) {

      return false;

    }

    Object.assign(

      this._payrollRuns[runId],

      data || {}

    );

    return true;

  }

  get(runId) {

    return this._payrollRuns[runId] || null;

  }

  getAll() {

    return this._payrollRuns;

  }

  exists(runId) {

    return this._payrollRuns.hasOwnProperty(runId);

  }

  remove(runId) {

    if (!this.exists(runId)) {

      return false;

    }

    delete this._payrollRuns[runId];

    return true;

  }

  clear() {

    this._payrollRuns = {};

    return true;

  }

  count() {

    return Object.keys(this._payrollRuns).length;

  }

  keys() {

    return Object.keys(this._payrollRuns);

  }

  //=========================================================================
  // Workflow
  //=========================================================================

  approve(runId) {

    if (!this.exists(runId)) {

      return false;

    }

    this._payrollRuns[runId].status = "Approved";

    return true;

  }

  process(runId) {

    if (!this.exists(runId)) {

      return false;

    }

    this._payrollRuns[runId].status = "Processed";

    return true;

  }

  reopen(runId) {

    if (!this.exists(runId)) {

      return false;

    }

    this._payrollRuns[runId].status = "Draft";

    return true;

  }

  cancel(runId) {

    if (!this.exists(runId)) {

      return false;

    }

    this._payrollRuns[runId].status = "Cancelled";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getDraft() {

    return this.filter(run =>
      run.status === "Draft"
    );

  }

  getApproved() {

    return this.filter(run =>
      run.status === "Approved"
    );

  }

  getProcessed() {

    return this.filter(run =>
      run.status === "Processed"
    );

  }

  getCancelled() {

    return this.filter(run =>
      run.status === "Cancelled"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._payrollRuns).forEach(id => {

      if (callback(this._payrollRuns[id])) {

        results[id] = this._payrollRuns[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      payrollRuns: this.count(),

      draft: Object.keys(this.getDraft()).length,

      approved: Object.keys(this.getApproved()).length,

      processed: Object.keys(this.getProcessed()).length,

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

      payrollRuns: this.getAll(),

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

function registerHRPayrollRunManager() {
function bootHRPayrollRunManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "HR",
      "PayrollRunManager",
      new HRPayrollRunManager()
    );
  }
}
}