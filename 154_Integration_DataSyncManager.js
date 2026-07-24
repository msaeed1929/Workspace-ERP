/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 154_Integration_DataSyncManager.gs
 * Module      : Integration
 * Class       : IntegrationDataSyncManager
 * Version     : 1.0.0
 * Description : Data Synchronization Management Service
 * =============================================================================
 */

'use strict';

class IntegrationDataSyncManager extends BaseService {

  constructor() {

    super("IntegrationDataSyncManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._syncJobs = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(syncId, data) {

    if (this.exists(syncId)) {

      return false;

    }

    this._syncJobs[syncId] = Object.assign({

      syncName: "",

      sourceSystem: "",

      targetSystem: "",

      direction: "Bidirectional",

      frequency: "Manual",

      lastSync: "",

      nextSync: "",

      recordsProcessed: 0,

      recordsFailed: 0,

      status: "Idle"

    }, data || {});

    return true;

  }

  update(syncId, data) {

    if (!this.exists(syncId)) {

      return false;

    }

    Object.assign(

      this._syncJobs[syncId],

      data || {}

    );

    return true;

  }

  get(syncId) {

    return this._syncJobs[syncId] || null;

  }

  getAll() {

    return this._syncJobs;

  }

  exists(syncId) {

    return this._syncJobs.hasOwnProperty(syncId);

  }

  remove(syncId) {

    if (!this.exists(syncId)) {

      return false;

    }

    delete this._syncJobs[syncId];

    return true;

  }

  clear() {

    this._syncJobs = {};

    return true;

  }

  count() {

    return Object.keys(this._syncJobs).length;

  }

  keys() {

    return Object.keys(this._syncJobs);

  }

  //=========================================================================
  // Synchronization Lifecycle
  //=========================================================================

  start(syncId) {

    if (!this.exists(syncId)) {

      return false;

    }

    this._syncJobs[syncId].status = "Running";

    return true;

  }

  complete(syncId, processed, failed) {

    if (!this.exists(syncId)) {

      return false;

    }

    this._syncJobs[syncId].status = "Completed";

    this._syncJobs[syncId].lastSync = new Date();

    this._syncJobs[syncId].recordsProcessed = processed || 0;

    this._syncJobs[syncId].recordsFailed = failed || 0;

    return true;

  }

  fail(syncId) {

    if (!this.exists(syncId)) {

      return false;

    }

    this._syncJobs[syncId].status = "Failed";

    return true;

  }

  reset(syncId) {

    if (!this.exists(syncId)) {

      return false;

    }

    this._syncJobs[syncId].status = "Idle";

    this._syncJobs[syncId].recordsProcessed = 0;

    this._syncJobs[syncId].recordsFailed = 0;

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getIdle() {

    return this.filter(sync =>
      sync.status === "Idle"
    );

  }

  getRunning() {

    return this.filter(sync =>
      sync.status === "Running"
    );

  }

  getCompleted() {

    return this.filter(sync =>
      sync.status === "Completed"
    );

  }

  getFailed() {

    return this.filter(sync =>
      sync.status === "Failed"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._syncJobs).forEach(id => {

      if (callback(this._syncJobs[id])) {

        results[id] = this._syncJobs[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      syncJobs: this.count(),

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

      syncJobs: this.getAll(),

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
  "Integration",
  "DataSyncManager",
  new IntegrationDataSyncManager()
);