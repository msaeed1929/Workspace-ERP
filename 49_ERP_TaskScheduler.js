/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 49_ERP_TaskScheduler.gs
 * Version     : 1.0.0
 * Description : ERP Task Scheduler
 * =============================================================================
 */

'use strict';

class ERPTaskScheduler extends BaseService {

  constructor() {

    super("ERPTaskScheduler");

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

  register(name, callback) {

    this._tasks[name] = {

      name : name,
      callback : callback,
      enabled : true,
      created : new Date(),
      lastRun : null

    };

    return this._tasks[name];

  }

  exists(name) {

    return !!this._tasks[name];

  }

  task(name) {

    return this._tasks[name] || null;

  }

  tasks() {

    return Object.keys(this._tasks);

  }

  count() {

    return this.tasks().length;

  }

  //=========================================================================
  // Execution
  //=========================================================================

  run(name) {

    if (!this.exists(name))
      return false;

    var task = this._tasks[name];

    if (!task.enabled)
      return false;

    task.callback();

    task.lastRun = new Date();

    return true;

  }

  enable(name) {

    if (!this.exists(name))
      return false;

    this._tasks[name].enabled = true;

    return true;

  }

  disable(name) {

    if (!this.exists(name))
      return false;

    this._tasks[name].enabled = false;

    return true;

  }

  enabled() {

    return this.tasks().filter(function(name){

      return this._tasks[name].enabled;

    }, this);

  }

  disabled() {

    return this.tasks().filter(function(name){

      return !this._tasks[name].enabled;

    }, this);

  }

  //=========================================================================
  // Maintenance
  //=========================================================================

  runAll() {

    var executed = 0;

    this.enabled().forEach(function(name){

      if (this.run(name)) {

        executed++;

      }

    }, this);

    return executed;

  }

  remove(name) {

    if (!this.exists(name))
      return false;

    delete this._tasks[name];

    return true;

  }

  clear() {

    this._tasks = {};

    return true;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      tasks : this.count(),
      enabled : this.enabled().length,
      disabled : this.disabled().length

    };

  }

  health() {

    return {

      initialized : this.isInitialized(),
      healthy : true,
      tasks : this.count(),
      enabled : this.enabled().length,
      disabled : this.disabled().length

    };

  }

  report() {

    return {

      tasks : this.tasks(),
      enabled : this.enabled(),
      disabled : this.disabled(),
      statistics : this.statistics(),
      health : this.health()

    };

  }

  info() {

    return {

      service : this.getName(),
      version : this.getVersion(),
      initialized : this.isInitialized(),
      created : this.getCreatedTime(),
      statistics : this.statistics()

    };

  }

}
