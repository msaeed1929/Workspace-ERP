/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 117_HR_AttendanceManager.gs
 * Module      : Human Resources (HR)
 * Class       : HRAttendanceManager
 * Version     : 1.0.0
 * Description : Employee Attendance Management Service
 * =============================================================================
 */

'use strict';

class HRAttendanceManager extends BaseService {

  constructor() {

    super("HRAttendanceManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._attendance = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(attendanceId, data) {

    if (this.exists(attendanceId)) {

      return false;

    }

    this._attendance[attendanceId] = Object.assign({

      employeeId: "",

      attendanceDate: "",

      checkIn: "",

      checkOut: "",

      department: "",

      status: "Draft"

    }, data || {});

    return true;

  }

  update(attendanceId, data) {

    if (!this.exists(attendanceId)) {

      return false;

    }

    Object.assign(

      this._attendance[attendanceId],

      data || {}

    );

    return true;

  }

  get(attendanceId) {

    return this._attendance[attendanceId] || null;

  }

  getAll() {

    return this._attendance;

  }

  exists(attendanceId) {

    return this._attendance.hasOwnProperty(attendanceId);

  }

  remove(attendanceId) {

    if (!this.exists(attendanceId)) {

      return false;

    }

    delete this._attendance[attendanceId];

    return true;

  }

  clear() {

    this._attendance = {};

    return true;

  }

  count() {

    return Object.keys(this._attendance).length;

  }

  keys() {

    return Object.keys(this._attendance);

  }

  //=========================================================================
  // Workflow
  //=========================================================================

  approve(attendanceId) {

    if (!this.exists(attendanceId)) {

      return false;

    }

    this._attendance[attendanceId].status = "Approved";

    return true;

  }

  checkIn(attendanceId) {

    if (!this.exists(attendanceId)) {

      return false;

    }

    this._attendance[attendanceId].status = "Checked In";

    return true;

  }

  checkOut(attendanceId) {

    if (!this.exists(attendanceId)) {

      return false;

    }

    this._attendance[attendanceId].status = "Checked Out";

    return true;

  }

  reopen(attendanceId) {

    if (!this.exists(attendanceId)) {

      return false;

    }

    this._attendance[attendanceId].status = "Draft";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getDraft() {

    return this.filter(attendance =>
      attendance.status === "Draft"
    );

  }

  getApproved() {

    return this.filter(attendance =>
      attendance.status === "Approved"
    );

  }

  getCheckedIn() {

    return this.filter(attendance =>
      attendance.status === "Checked In"
    );

  }

  getCheckedOut() {

    return this.filter(attendance =>
      attendance.status === "Checked Out"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._attendance).forEach(id => {

      if (callback(this._attendance[id])) {

        results[id] = this._attendance[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      attendance: this.count(),

      draft: Object.keys(this.getDraft()).length,

      approved: Object.keys(this.getApproved()).length,

      checkedIn: Object.keys(this.getCheckedIn()).length,

      checkedOut: Object.keys(this.getCheckedOut()).length

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

      attendance: this.getAll(),

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
  "AttendanceManager",
  new HRAttendanceManager()
);