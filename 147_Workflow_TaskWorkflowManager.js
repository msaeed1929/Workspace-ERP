/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 147_Workflow_TaskWorkflowManager.gs
 * Module      : Workflow
 * Class       : WorkflowTaskWorkflowManager
 * Version     : 1.0.0
 * Description : Workflow Task Management Service
 * =============================================================================
 */

'use strict';

class WorkflowTaskWorkflowManager extends BaseService {

  constructor() {

    super("WorkflowTaskWorkflowManager");

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

      workflowId: "",

      taskName: "",

      module: "",

      assignedTo: "",

      priority: "Normal",

      dueDate: "",

      completedDate: "",

      progress: 0,

      remarks: "",

      status: "Pending"

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
  // Task Workflow
  //=========================================================================

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

  cancel(taskId) {

    if (!this.exists(taskId)) {

      return false;

    }

    this._tasks[taskId].status = "Cancelled";

    return true;

  }

  reopen(taskId) {

    if (!this.exists(taskId)) {

      return false;

    }

    this._tasks[taskId].status = "Pending";

    this._tasks[taskId].progress = 0;

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getPending() {

    return this.filter(task =>
      task.status === "Pending"
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

  getCancelled() {

    return this.filter(task =>
      task.status === "Cancelled"
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

      pending: Object.keys(this.getPending()).length,

      inProgress: Object.keys(this.getInProgress()).length,

      completed: Object.keys(this.getCompleted()).length,

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
  "Workflow",
  "TaskWorkflowManager",
  new WorkflowTaskWorkflowManager()
);