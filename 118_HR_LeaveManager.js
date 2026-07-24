/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 118_HR_LeaveManager.gs
 * Module      : Human Resources (HR)
 * Class       : HRLeaveManager
 * Version     : 1.0.0
 * Description : Human Resources Leave Management Service
 * =============================================================================
 */

'use strict';

class HRLeaveManager extends BaseService {

  constructor() {

    super("HRLeaveManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._leaves = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(leaveId, data) {

    if (this.exists(leaveId)) {

      return false;

    }

    this._leaves[leaveId] = Object.assign({

      employeeId: "",

      leaveType: "",

      startDate: "",

      endDate: "",

      days: 0,

      reason: "",

      status: "Draft"

    }, data || {});

    return true;

  }

  update(leaveId, data) {

    if (!this.exists(leaveId)) {

      return false;

    }

    Object.assign(

      this._leaves[leaveId],

      data || {}

    );

    return true;

  }

  get(leaveId) {

    return this._leaves[leaveId] || null;

  }

  getAll() {

    return this._leaves;

  }

  exists(leaveId) {

    return this._leaves.hasOwnProperty(leaveId);

  }

  remove(leaveId) {

    if (!this.exists(leaveId)) {

      return false;

    }

    delete this._leaves[leaveId];

    return true;

  }

  clear() {

    this._leaves = {};

    return true;

  }

  count() {

    return Object.keys(this._leaves).length;

  }

  keys() {

    return Object.keys(this._leaves);

  }

  //=========================================================================
  // Workflow
  //=========================================================================

  approve(leaveId) {

    if (!this.exists(leaveId)) {

      return false;

    }

    this._leaves[leaveId].status = "Approved";

    return true;

  }

  reject(leaveId) {

    if (!this.exists(leaveId)) {

      return false;

    }

    this._leaves[leaveId].status = "Rejected";

    return true;

  }

  cancel(leaveId) {

    if (!this.exists(leaveId)) {

      return false;

    }

    this._leaves[leaveId].status = "Cancelled";

    return true;

  }

  reopen(leaveId) {

    if (!this.exists(leaveId)) {

      return false;

    }

    this._leaves[leaveId].status = "Draft";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getDraft() {

    return this.filter(leave =>
      leave.status === "Draft"
    );

  }

  getApproved() {

    return this.filter(leave =>
      leave.status === "Approved"
    );

  }

  getRejected() {

    return this.filter(leave =>
      leave.status === "Rejected"
    );

  }

  getCancelled() {

    return this.filter(leave =>
      leave.status === "Cancelled"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._leaves).forEach(id => {

      if (callback(this._leaves[id])) {

        results[id] = this._leaves[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      leaves: this.count(),

      draft: Object.keys(this.getDraft()).length,

      approved: Object.keys(this.getApproved()).length,

      rejected: Object.keys(this.getRejected()).length,

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

      leaves: this.getAll(),

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
  "LeaveManager",
  new HRLeaveManager()
);