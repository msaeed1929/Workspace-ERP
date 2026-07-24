/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 58_CRM_TaskManager.gs
 * Version     : 1.0.0
 * Description : CRM Task Manager
 * =============================================================================
 */

'use strict';

class CRMTaskManager extends BaseService {

  constructor() {

    super("CRMTaskManager");

    this.initialize();

  }

  initialize() {

    super.initialize();

    this._tasks = {};

    return this;

  }

  //=========================================================================
  // Tasks
  //=========================================================================

  create(id, task) {

    if (this.exists(id))
      return null;

    this._tasks[id] = task;

    return task;

  }

  exists(id) {

    return !!this._tasks[id];

  }

  get(id) {

    return this._tasks[id] || null;

  }

  update(id, task) {

    if (!this.exists(id))
      return null;

    this._tasks[id] = task;

    return task;

  }

  remove(id) {

    if (!this.exists(id))
      return false;

    delete this._tasks[id];

    return true;

  }

  all() {

    return this._tasks;

  }

  ids() {

    return Object.keys(this._tasks);

  }

  count() {

    return this.ids().length;

  }

  //=========================================================================
  // Status
  //=========================================================================

  complete(id) {

    if (!this.exists(id))
      return false;

    this._tasks[id].status = "Completed";

    return true;

  }

  reopen(id) {

    if (!this.exists(id))
      return false;

    this._tasks[id].status = "Pending";

    return true;

  }

  completed() {

    var tasks = {};

    Object.keys(this._tasks).forEach(function(id){

      if (this._tasks[id].status === "Completed")
        tasks[id] = this._tasks[id];

    }, this);

    return tasks;

  }

  pending() {

    var tasks = {};

    Object.keys(this._tasks).forEach(function(id){

      if (this._tasks[id].status === "Pending")
        tasks[id] = this._tasks[id];

    }, this);

    return tasks;

  }

  //=========================================================================
  // Filters
  //=========================================================================

  byUser(user) {

    var tasks = {};

    Object.keys(this._tasks).forEach(function(id){

      if (this._tasks[id].user === user)
        tasks[id] = this._tasks[id];

    }, this);

    return tasks;

  }

  byEntity(entityType, entityId) {

    var tasks = {};

    Object.keys(this._tasks).forEach(function(id){

      var task = this._tasks[id];

      if (
        task.entityType === entityType &&
        task.entityId === entityId
      ) {

        tasks[id] = task;

      }

    }, this);

    return tasks;

  }

  //=========================================================================
  // Maintenance
  //=========================================================================

  clear() {

    this._tasks = {};

    return true;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      tasks: this.count(),
      pending: Object.keys(this.pending()).length,
      completed: Object.keys(this.completed()).length

    };

  }

  health() {

    return {

      initialized: this.isInitialized(),
      healthy: true,
      tasks: this.count(),
      pending: Object.keys(this.pending()).length,
      completed: Object.keys(this.completed()).length

    };

  }

  report() {

    return {

      tasks: this.ids(),
      statistics: this.statistics(),
      health: this.health()

    };

  }

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

//==============================================================================
// CRM Registration
//==============================================================================

WEF.ServiceContainer.registerModuleService(
  "CRM",
  "TaskManager",
  new CRMTaskManager()
);