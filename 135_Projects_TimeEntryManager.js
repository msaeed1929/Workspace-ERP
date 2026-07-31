/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 135_Projects_TimeEntryManager.gs
 * Module      : Projects
 * Class       : ProjectsTimeEntryManager
 * Version     : 1.0.0
 * Description : Project Time Entry Management Service
 * =============================================================================
 */

'use strict';

class ProjectsTimeEntryManager extends BaseService {

  constructor() {

    super("ProjectsTimeEntryManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._timeEntries = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(entryId, data) {

    if (this.exists(entryId)) {

      return false;

    }

    this._timeEntries[entryId] = Object.assign({

      projectId: "",

      taskId: "",

      employeeId: "",

      workDate: "",

      hours: 0,

      description: "",

      billable: true,

      status: "Draft"

    }, data || {});

    return true;

  }

  update(entryId, data) {

    if (!this.exists(entryId)) {

      return false;

    }

    Object.assign(

      this._timeEntries[entryId],

      data || {}

    );

    return true;

  }

  get(entryId) {

    return this._timeEntries[entryId] || null;

  }

  getAll() {

    return this._timeEntries;

  }

  exists(entryId) {

    return this._timeEntries.hasOwnProperty(entryId);

  }

  remove(entryId) {

    if (!this.exists(entryId)) {

      return false;

    }

    delete this._timeEntries[entryId];

    return true;

  }

  clear() {

    this._timeEntries = {};

    return true;

  }

  count() {

    return Object.keys(this._timeEntries).length;

  }

  keys() {

    return Object.keys(this._timeEntries);

  }

  //=========================================================================
  // Workflow
  //=========================================================================

  approve(entryId) {

    if (!this.exists(entryId)) {

      return false;

    }

    this._timeEntries[entryId].status = "Approved";

    return true;

  }

  submit(entryId) {

    if (!this.exists(entryId)) {

      return false;

    }

    this._timeEntries[entryId].status = "Submitted";

    return true;

  }

  reject(entryId) {

    if (!this.exists(entryId)) {

      return false;

    }

    this._timeEntries[entryId].status = "Rejected";

    return true;

  }

  reopen(entryId) {

    if (!this.exists(entryId)) {

      return false;

    }

    this._timeEntries[entryId].status = "Draft";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getDraft() {

    return this.filter(entry =>
      entry.status === "Draft"
    );

  }

  getApproved() {

    return this.filter(entry =>
      entry.status === "Approved"
    );

  }

  getSubmitted() {

    return this.filter(entry =>
      entry.status === "Submitted"
    );

  }

  getRejected() {

    return this.filter(entry =>
      entry.status === "Rejected"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._timeEntries).forEach(id => {

      if (callback(this._timeEntries[id])) {

        results[id] = this._timeEntries[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      timeEntries: this.count(),

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

      timeEntries: this.getAll(),

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
function bootProjectsTimeEntryManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "Projects",
      "TimeEntryManager",
      new ProjectsTimeEntryManager()
    );
  }
}