/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 134_Projects_TaskManager.gs
 * Module      : Projects
 * Class       : ProjectsTaskManager
 * Version     : 1.0.0
 * Description : Project Task Management Service
 * =============================================================================
 */

'use strict';

class ProjectsTaskManager extends BaseService {

  constructor() {

    super("ProjectsTaskManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._tasks = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(taskId, data) {

    if (this.exists(taskId)) {

      return false;

    }

    this._tasks[taskId] = Object.assign({

      projectId: "",

      taskCode: "",

      taskName: "",

      assignedTo: "",

      priority: "Medium",

      startDate: "",

      dueDate: "",

      estimatedHours: 0,

      actualHours: 0,

      progress: 0,

      status: "Draft"

    }, data || {});

    return true;

  }

  update(taskId, data) {

    if (!this.exists(taskId)) {

      return false;

    }

    Object.assign(

      this._tasks[taskId],

      data || {}

    );

    return true;

  }

  get(taskId) {

    return this._tasks[taskId] || null;

  }

  getAll() {

    return this._tasks;

  }

  exists(taskId) {

    return this._tasks.hasOwnProperty(taskId);

  }

  remove(taskId) {

    if (!this.exists(taskId)) {

      return false;

    }

    delete this._tasks[taskId];

    return true;

  }

  clear() {

    this._tasks = {};

    return true;

  }

  count() {

    return Object.keys(this._tasks).length;

  }

  keys() {

    return Object.keys(this._tasks);

  }

  //=========================================================================
  // Workflow
  //=========================================================================

  approve(taskId) {

    if (!this.exists(taskId)) {

      return false;

    }

    this._tasks[taskId].status = "Approved";

    return true;

  }

  start(taskId) {

    if (!this.exists(taskId)) {

      return false;

    }

    this._tasks[taskId].status = "In Progress";

    return true;

  }

  complete(taskId) {

    if (!this.exists(taskId)) {

      return false;

    }

    this._tasks[taskId].status = "Completed";

    this._tasks[taskId].progress = 100;

    return true;

  }

  reopen(taskId) {

    if (!this.exists(taskId)) {

      return false;

    }

    this._tasks[taskId].status = "Draft";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getDraft() {

    return this.filter(task =>
      task.status === "Draft"
    );

  }

  getApproved() {

    return this.filter(task =>
      task.status === "Approved"
    );

  }

  getInProgress() {

    return this.filter(task =>
      task.status === "In Progress"
    );

  }

  getCompleted() {

    return this.filter(task =>
      task.status === "Completed"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._tasks).forEach(id => {

      if (callback(this._tasks[id])) {

        results[id] = this._tasks[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      tasks: this.count(),

      draft: Object.keys(this.getDraft()).length,

      approved: Object.keys(this.getApproved()).length,

      inProgress: Object.keys(this.getInProgress()).length,

      completed: Object.keys(this.getCompleted()).length

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

      tasks: this.getAll(),

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
  "Projects",
  "TaskManager",
  new ProjectsTaskManager()
);