/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 120_HR_PayrollManager.gs
 * Module      : Human Resources (HR)
 * Class       : HRPayrollManager
 * Version     : 1.0.0
 * Description : Payroll Management Service
 * =============================================================================
 */

'use strict';

class HRPayrollManager extends BaseService {

  constructor() {

    super("HRPayrollManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._payroll = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(payrollId, data) {

    if (this.exists(payrollId)) {

      return false;

    }

    this._payroll[payrollId] = Object.assign({

      employeeId: "",

      payrollMonth: "",

      basicSalary: 0,

      allowances: 0,

      deductions: 0,

      netSalary: 0,

      status: "Draft"

    }, data || {});

    return true;

  }

  update(payrollId, data) {

    if (!this.exists(payrollId)) {

      return false;

    }

    Object.assign(

      this._payroll[payrollId],

      data || {}

    );

    return true;

  }

  get(payrollId) {

    return this._payroll[payrollId] || null;

  }

  getAll() {

    return this._payroll;

  }

  exists(payrollId) {

    return this._payroll.hasOwnProperty(payrollId);

  }

  remove(payrollId) {

    if (!this.exists(payrollId)) {

      return false;

    }

    delete this._payroll[payrollId];

    return true;

  }

  clear() {

    this._payroll = {};

    return true;

  }

  count() {

    return Object.keys(this._payroll).length;

  }

  keys() {

    return Object.keys(this._payroll);

  }

  //=========================================================================
  // Workflow
  //=========================================================================

  approve(payrollId) {

    if (!this.exists(payrollId)) {

      return false;

    }

    this._payroll[payrollId].status = "Approved";

    return true;

  }

  process(payrollId) {

    if (!this.exists(payrollId)) {

      return false;

    }

    this._payroll[payrollId].status = "Processed";

    return true;

  }

  pay(payrollId) {

    if (!this.exists(payrollId)) {

      return false;

    }

    this._payroll[payrollId].status = "Paid";

    return true;

  }

  reopen(payrollId) {

    if (!this.exists(payrollId)) {

      return false;

    }

    this._payroll[payrollId].status = "Draft";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getDraft() {

    return this.filter(payroll =>
      payroll.status === "Draft"
    );

  }

  getApproved() {

    return this.filter(payroll =>
      payroll.status === "Approved"
    );

  }

  getProcessed() {

    return this.filter(payroll =>
      payroll.status === "Processed"
    );

  }

  getPaid() {

    return this.filter(payroll =>
      payroll.status === "Paid"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._payroll).forEach(id => {

      if (callback(this._payroll[id])) {

        results[id] = this._payroll[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      payrolls: this.count(),

      draft: Object.keys(this.getDraft()).length,

      approved: Object.keys(this.getApproved()).length,

      processed: Object.keys(this.getProcessed()).length,

      paid: Object.keys(this.getPaid()).length

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

      payrolls: this.getAll(),

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

WEF.ServiceContainer.registerModuleService(
  "HR",
  "PayrollManager",
  new HRPayrollManager()
);