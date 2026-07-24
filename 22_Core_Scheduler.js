/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 22_Core_Scheduler.gs
 * Version     : 1.0.0
 * Description : Enterprise Scheduler Service
 * =============================================================================
 */

'use strict';

class SchedulerService extends BaseService {

  constructor(){

    super("Scheduler");

    this.initialize();

  }

  initialize(){

    super.initialize();

    this.reset();

    return this;

  }

  reset(){

    this._jobs={};

    this._queue=[];

    this._history=[];

    this._running=false;

    this._statistics={

      jobs:0,
      runs:0,
      executions:0,
      failures:0,
      removed:0,
      enabled:0,
      disabled:0

    };

    return this;

  }

  //=========================================================================
  // Job Registration
  //=========================================================================

  register(name,callback,options){

    if(typeof callback!=="function")
      throw new Error(
        "Scheduler callback must be a function."
      );

    this._jobs[name]={

      name:name,

      callback:callback,

      enabled:true,

      created:new Date(),

      options:options||{},

      runs:0,

      executions:0,

      failures:0,

      nextRun:null,

      lastRun:null,

      lastStatus:null,

      retry:0,

      interval:0

    };

    this._statistics.jobs++;

    return this;

  }

  has(name){

    return this._jobs.hasOwnProperty(name);

  }

  job(name){

    return this._jobs[name]||null;

  }

  get(name){

    return this._jobs[name] || null;

  }

  jobs(){

    return Object.keys(this._jobs);

  }

  count(){

    return this.jobs().length;

  }

  remove(name){

    if(this.has(name)){

      delete this._jobs[name];

      this._statistics.removed++;

    }

    return this;

  }

  clear(){

    this.reset();

    return this;

  }

  //=========================================================================
  // Enable / Disable
  //=========================================================================

  enable(name){

    if(this.has(name)){

      this._jobs[name].enabled=true;

      this._statistics.enabled++;

    }

    return this;

  }

  disable(name){

    if(this.has(name)){

      this._jobs[name].enabled=false;

      this._statistics.disabled++;

    }

    return this;

  }

  isEnabled(name){

    return this.has(name)
      ? this._jobs[name].enabled
      : false;

  }

    //=========================================================================
  // Execute Scheduler
  //=========================================================================

  run() {

    const now = new Date();

    this._running = true;

    this._statistics.runs++;

    Object.values(this._jobs).forEach(task => {

      if (!task.enabled)
        return;

      if (this.shouldRun(task, now)) {

        this.execute(task);

      }

    });

    this._running = false;

    return this;

  }

  execute(task) {

    try {

      task.callback();

      task.lastRun = new Date();

      task.executions++;

      this._statistics.executions++;

      if (task.interval > 0)
        task.nextRun =
          new Date(
            Date.now() +
            task.interval
          );

    }

    catch (error) {

      task.failures++;

      this._statistics.failures++;

      Logger.error(error);

      if (task.retry > 0) {

        task.retry--;

        this.execute(task);

      }

    }

    return this;

  }

  //=========================================================================
  // Execution Rules
  //=========================================================================

  shouldRun(task, now) {

    if (!task.enabled)
      return false;

    if (task.nextRun === null)
      return true;

    return now >= task.nextRun;

  }

  runTask(name) {

    const task = this.get(name);

    if (!task)
      throw new Error(
        "Task not found."
      );

    this.execute(task);

    return this;

  }

  runAll(){

      Object.values(this._jobs).forEach(task=>{

          this.execute(task);

      });

      return this;

  }

  //=========================================================================
  // Queue Processing
  //=========================================================================

  queue(name) {

    const task = this.get(name);

    if (!task)
      return this;

    this._queue.push(task);

    return this;

  }

  queueAll(){

      Object.values(this._jobs).forEach(task=>{

          this._queue.push(task);

      });

      return this;

  }

  processQueue() {

    while (this._queue.length) {

      const task = this._queue.shift();

      this.execute(task);

    }

    return this;

  }

  clearQueue() {

    this._queue = [];

    return this;

  }

  queueSize() {

    return this._queue.length;

  }

  //=========================================================================
  // Enable / Disable
  //=========================================================================

  enable(name) {

    const task = this.get(name);

    if (task)
      task.enabled = true;

    return this;

  }

  disable(name) {

    const task = this.get(name);

    if (task)
      task.enabled = false;

    return this;

  }

  toggle(name) {

    const task = this.get(name);

    if (task)
      task.enabled = !task.enabled;

    return this;

  }

  isRunning() {

    return this._running;

  }

    //=========================================================================
  // Statistics
  //=========================================================================

  statistics(){

    return{

      jobs:this.count(),

      executions:this._statistics.executions,

      failures:this._statistics.failures,

      removed:this._statistics.removed,

      enabled:Object.values(this._jobs)
        .filter(job=>job.enabled).length,

      disabled:Object.values(this._jobs)
        .filter(job=>!job.enabled).length,

      queued:this.queueSize(),

      running:this._running

    };

  }

  //=========================================================================
  // Health
  //=========================================================================

  health() {

    return {

      initialized: this.isInitialized(),

      running: this._running,

      jobs: this.count(),

      queue: this.queueSize()

    };

  }

  //=========================================================================
  // Report
  //=========================================================================

  report() {

    return {

      statistics: this.statistics(),

      health: this.health(),

      jobs: this.jobs()

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

WEF.Scheduler = new SchedulerService();