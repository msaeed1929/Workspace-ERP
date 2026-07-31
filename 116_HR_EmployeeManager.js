/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 116_HR_EmployeeManager.gs
 * Module      : Human Resources
 * Class       : HREmployeeManager
 * Version     : 1.0.0
 * Description : Employee Management Service
 * =============================================================================
 */

'use strict';

class HREmployeeManager extends BaseService {

  constructor() {

    super("HREmployeeManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._employees = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(employeeId, data) {

    if (this.exists(employeeId)) {

      return false;

    }

    this._employees[employeeId] = Object.assign({

      employeeNo: "",

      firstName: "",

      lastName: "",

      department: "",

      designation: "",

      joiningDate: "",

      status: "Draft"

    }, data || {});

    return true;

  }

  update(employeeId, data) {

    if (!this.exists(employeeId)) {

      return false;

    }

    Object.assign(

      this._employees[employeeId],

      data || {}

    );

    return true;

  }

  get(employeeId) {

    return this._employees[employeeId] || null;

  }

  getAll() {

    return this._employees;

  }

  exists(employeeId) {

    return this._employees.hasOwnProperty(employeeId);

  }

  remove(employeeId) {

    if (!this.exists(employeeId)) {

      return false;

    }

    delete this._employees[employeeId];

    return true;

  }

  clear() {

    this._employees = {};

    return true;

  }

  count() {

    return Object.keys(this._employees).length;

  }

  keys() {

    return Object.keys(this._employees);

  }

  //=========================================================================
  // Workflow
  //=========================================================================

  approve(employeeId) {

    if (!this.exists(employeeId)) {

      return false;

    }

    this._employees[employeeId].status = "Approved";

    return true;

  }

  activate(employeeId) {

    if (!this.exists(employeeId)) {

      return false;

    }

    this._employees[employeeId].status = "Active";

    return true;

  }

  deactivate(employeeId) {

    if (!this.exists(employeeId)) {

      return false;

    }

    this._employees[employeeId].status = "Inactive";

    return true;

  }

  terminate(employeeId) {

    if (!this.exists(employeeId)) {

      return false;

    }

    this._employees[employeeId].status = "Terminated";

    return true;

  }

  reopen(employeeId) {

    if (!this.exists(employeeId)) {

      return false;

    }

    this._employees[employeeId].status = "Draft";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getDraft() {

    return this.filter(employee =>
      employee.status === "Draft"
    );

  }

  getApproved() {

    return this.filter(employee =>
      employee.status === "Approved"
    );

  }

  getActive() {

    return this.filter(employee =>
      employee.status === "Active"
    );

  }

  getInactive() {

    return this.filter(employee =>
      employee.status === "Inactive"
    );

  }

  getTerminated() {

    return this.filter(employee =>
      employee.status === "Terminated"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._employees).forEach(id => {

      if (callback(this._employees[id])) {

        results[id] = this._employees[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      employees: this.count(),

      draft: Object.keys(this.getDraft()).length,

      approved: Object.keys(this.getApproved()).length,

      active: Object.keys(this.getActive()).length,

      inactive: Object.keys(this.getInactive()).length,

      terminated: Object.keys(this.getTerminated()).length

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

      employees: this.getAll(),

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

function registerHREmployeeManager() {
  WEF.ServiceContainer.registerModuleService(
    "HR",
    "EmployeeManager",
    new HREmployeeManager()
  );
}