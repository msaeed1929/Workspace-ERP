/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 155_Integration_ImportExportManager.gs
 * Module      : Integration
 * Class       : IntegrationImportExportManager
 * Version     : 1.0.0
 * Description : Import / Export Management Service
 * =============================================================================
 */

'use strict';

class IntegrationImportExportManager extends BaseService {

  constructor() {

    super("IntegrationImportExportManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._jobs = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(jobId, data) {

    if (this.exists(jobId)) {

      return false;

    }

    this._jobs[jobId] = Object.assign({

      jobName: "",

      operation: "Import",

      format: "CSV",

      source: "",

      destination: "",

      recordsProcessed: 0,

      recordsFailed: 0,

      startedAt: "",

      completedAt: "",

      status: "Pending"

    }, data || {});

    return true;

  }

  update(jobId, data) {

    if (!this.exists(jobId)) {

      return false;

    }

    Object.assign(

      this._jobs[jobId],

      data || {}

    );

    return true;

  }

  get(jobId) {

    return this._jobs[jobId] || null;

  }

  getAll() {

    return this._jobs;

  }

  exists(jobId) {

    return this._jobs.hasOwnProperty(jobId);

  }

  remove(jobId) {

    if (!this.exists(jobId)) {

      return false;

    }

    delete this._jobs[jobId];

    return true;

  }

  clear() {

    this._jobs = {};

    return true;

  }

  count() {

    return Object.keys(this._jobs).length;

  }

  keys() {

    return Object.keys(this._jobs);

  }

  //=========================================================================
  // Job Lifecycle
  //=========================================================================

  start(jobId) {

    if (!this.exists(jobId)) {

      return false;

    }

    this._jobs[jobId].status = "Running";

    this._jobs[jobId].startedAt = new Date();

    return true;

  }

  complete(jobId, processed, failed) {

    if (!this.exists(jobId)) {

      return false;

    }

    this._jobs[jobId].status = "Completed";

    this._jobs[jobId].completedAt = new Date();

    this._jobs[jobId].recordsProcessed = processed || 0;

    this._jobs[jobId].recordsFailed = failed || 0;

    return true;

  }

  fail(jobId) {

    if (!this.exists(jobId)) {

      return false;

    }

    this._jobs[jobId].status = "Failed";

    return true;

  }

  cancel(jobId) {

    if (!this.exists(jobId)) {

      return false;

    }

    this._jobs[jobId].status = "Cancelled";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getPending() {

    return this.filter(job =>
      job.status === "Pending"
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

  getCancelled() {

    return this.filter(job =>
      job.status === "Cancelled"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._jobs).forEach(id => {

      if (callback(this._jobs[id])) {

        results[id] = this._jobs[id];

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

      pending: Object.keys(this.getPending()).length,

      running: Object.keys(this.getRunning()).length,

      completed: Object.keys(this.getCompleted()).length,

      failed: Object.keys(this.getFailed()).length,

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

      jobs: this.getAll(),

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
function bootIntegrationImportExportManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "Integration",
      "ImportExportManager",
      new IntegrationImportExportManager()
    );
  }
}