/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 159_BI_ETLManager.gs
 * Module      : Business Intelligence
 * Class       : BIETLManager
 * Version     : 1.0.0
 * Description : ETL (Extract, Transform, Load) Management Service
 * =============================================================================
 */

'use strict';

class BIETLManager extends BaseService {

  constructor() {

    super("BIETLManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._etlJobs = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(jobId, data) {

    if (this.exists(jobId)) {

      return false;

    }

    this._etlJobs[jobId] = Object.assign({

      jobName: "",

      source: "",

      destination: "",

      schedule: "Daily",

      lastRun: "",

      nextRun: "",

      recordsExtracted: 0,

      recordsLoaded: 0,

      recordsRejected: 0,

      status: "Idle"

    }, data || {});

    return true;

  }

  update(jobId, data) {

    if (!this.exists(jobId)) {

      return false;

    }

    Object.assign(

      this._etlJobs[jobId],

      data || {}

    );

    return true;

  }

  get(jobId) {

    return this._etlJobs[jobId] || null;

  }

  getAll() {

    return this._etlJobs;

  }

  exists(jobId) {

    return this._etlJobs.hasOwnProperty(jobId);

  }

  remove(jobId) {

    if (!this.exists(jobId)) {

      return false;

    }

    delete this._etlJobs[jobId];

    return true;

  }

  clear() {

    this._etlJobs = {};

    return true;

  }

  count() {

    return Object.keys(this._etlJobs).length;

  }

  keys() {

    return Object.keys(this._etlJobs);

  }

  //=========================================================================
  // ETL Lifecycle
  //=========================================================================

  start(jobId) {

    if (!this.exists(jobId)) {

      return false;

    }

    this._etlJobs[jobId].status = "Running";

    this._etlJobs[jobId].lastRun = new Date();

    return true;

  }

  complete(jobId, extracted, loaded, rejected) {

    if (!this.exists(jobId)) {

      return false;

    }

    this._etlJobs[jobId].status = "Completed";

    this._etlJobs[jobId].recordsExtracted = extracted || 0;

    this._etlJobs[jobId].recordsLoaded = loaded || 0;

    this._etlJobs[jobId].recordsRejected = rejected || 0;

    return true;

  }

  fail(jobId) {

    if (!this.exists(jobId)) {

      return false;

    }

    this._etlJobs[jobId].status = "Failed";

    return true;

  }

  reset(jobId) {

    if (!this.exists(jobId)) {

      return false;

    }

    this._etlJobs[jobId].status = "Idle";

    this._etlJobs[jobId].recordsExtracted = 0;

    this._etlJobs[jobId].recordsLoaded = 0;

    this._etlJobs[jobId].recordsRejected = 0;

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getIdle() {

    return this.filter(job =>
      job.status === "Idle"
    );

  }

  getRunning() {

    return this.filter(job =>
      job.status === "Running"
    );

  }

  getCompleted() {

    return this.filter(job =>
      job.status === "Completed"
    );

  }

  getFailed() {

    return this.filter(job =>
      job.status === "Failed"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._etlJobs).forEach(id => {

      if (callback(this._etlJobs[id])) {

        results[id] = this._etlJobs[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      jobs: this.count(),

      idle: Object.keys(this.getIdle()).length,

      running: Object.keys(this.getRunning()).length,

      completed: Object.keys(this.getCompleted()).length,

      failed: Object.keys(this.getFailed()).length

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

      etlJobs: this.getAll(),

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
function bootBIETLManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "BI",
      "ETLManager",
      new BIETLManager()
    );
  }
}