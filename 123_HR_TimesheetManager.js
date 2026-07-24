/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 123_HR_TimesheetManager.gs
 * Module      : Human Resources (HR)
 * Class       : HRTimesheetManager
 * Version     : 1.0.0
 * Description : Employee Timesheet Management Service
 * =============================================================================
 */

'use strict';

class HRTimesheetManager extends BaseService {

  constructor() {

    super("HRTimesheetManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._timesheets = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(timesheetId, data) {

    if (this.exists(timesheetId)) {

      return false;

    }

    this._timesheets[timesheetId] = Object.assign({

      employeeId: "",

      workDate: "",

      project: "",

      task: "",

      hours: 0,

      overtime: 0,

      status: "Draft"

    }, data || {});

    return true;

  }

  update(timesheetId, data) {

    if (!this.exists(timesheetId)) {

      return false;

    }

    Object.assign(

      this._timesheets[timesheetId],

      data || {}

    );

    return true;

  }

  get(timesheetId) {

    return this._timesheets[timesheetId] || null;

  }

  getAll() {

    return this._timesheets;

  }

  exists(timesheetId) {

    return this._timesheets.hasOwnProperty(timesheetId);

  }

  remove(timesheetId) {

    if (!this.exists(timesheetId)) {

      return false;

    }

    delete this._timesheets[timesheetId];

    return true;

  }

  clear() {

    this._timesheets = {};

    return true;

  }

  count() {

    return Object.keys(this._timesheets).length;

  }

  keys() {

    return Object.keys(this._timesheets);

  }

  //=========================================================================
  // Workflow
  //=========================================================================

  approve(timesheetId) {

    if (!this.exists(timesheetId)) {

      return false;

    }

    this._timesheets[timesheetId].status = "Approved";

    return true;

  }

  submit(timesheetId) {

    if (!this.exists(timesheetId)) {

      return false;

    }

    this._timesheets[timesheetId].status = "Submitted";

    return true;

  }

  reject(timesheetId) {

    if (!this.exists(timesheetId)) {

      return false;

    }

    this._timesheets[timesheetId].status = "Rejected";

    return true;

  }

  reopen(timesheetId) {

    if (!this.exists(timesheetId)) {

      return false;

    }

    this._timesheets[timesheetId].status = "Draft";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getDraft() {

    return this.filter(timesheet =>
      timesheet.status === "Draft"
    );

  }

  getApproved() {

    return this.filter(timesheet =>
      timesheet.status === "Approved"
    );

  }

  getSubmitted() {

    return this.filter(timesheet =>
      timesheet.status === "Submitted"
    );

  }

  getRejected() {

    return this.filter(timesheet =>
      timesheet.status === "Rejected"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._timesheets).forEach(id => {

      if (callback(this._timesheets[id])) {

        results[id] = this._timesheets[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      timesheets: this.count(),

      draft: Object.keys(this.getDraft()).length,

      approved: Object.keys(this.getApproved()).length,

      submitted: Object.keys(this.getSubmitted()).length,

      rejected: Object.keys(this.getRejected()).length

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

      timesheets: this.getAll(),

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
  "TimesheetManager",
  new HRTimesheetManager()
);