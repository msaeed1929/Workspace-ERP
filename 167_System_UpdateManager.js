/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 167_System_UpdateManager.gs
 * Module      : System
 * Class       : SystemUpdateManager
 * Version     : 1.0.0
 * Description : System Update Management Service
 * =============================================================================
 */

'use strict';

class SystemUpdateManager extends BaseService {

  constructor() {

    super("SystemUpdateManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._updates = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(updateId, data) {

    if (this.exists(updateId)) {

      return false;

    }

    this._updates[updateId] = Object.assign({

      version: "",

      buildNumber: "",

      releaseDate: "",

      updateType: "Patch",

      description: "",

      installedBy: "",

      installedDate: "",

      rollbackAvailable: true,

      status: "Pending"

    }, data || {});

    return true;

  }

  update(updateId, data) {

    if (!this.exists(updateId)) {

      return false;

    }

    Object.assign(

      this._updates[updateId],

      data || {}

    );

    return true;

  }

  get(updateId) {

    return this._updates[updateId] || null;

  }

  getAll() {

    return this._updates;

  }

  exists(updateId) {

    return this._updates.hasOwnProperty(updateId);

  }

  remove(updateId) {

    if (!this.exists(updateId)) {

      return false;

    }

    delete this._updates[updateId];

    return true;

  }

  clear() {

    this._updates = {};

    return true;

  }

  count() {

    return Object.keys(this._updates).length;

  }

  keys() {

    return Object.keys(this._updates);

  }

  //=========================================================================
  // Update Lifecycle
  //=========================================================================

  install(updateId) {

    if (!this.exists(updateId)) {

      return false;

    }

    this._updates[updateId].status = "Installed";

    this._updates[updateId].installedDate = new Date();

    return true;

  }

  rollback(updateId) {

    if (!this.exists(updateId)) {

      return false;

    }

    this._updates[updateId].status = "Rolled Back";

    return true;

  }

  fail(updateId) {

    if (!this.exists(updateId)) {

      return false;

    }

    this._updates[updateId].status = "Failed";

    return true;

  }

  approve(updateId) {

    if (!this.exists(updateId)) {

      return false;

    }

    this._updates[updateId].status = "Approved";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getPending() {

    return this.filter(update =>
      update.status === "Pending"
    );

  }

  getApproved() {

    return this.filter(update =>
      update.status === "Approved"
    );

  }

  getInstalled() {

    return this.filter(update =>
      update.status === "Installed"
    );

  }

  getFailed() {

    return this.filter(update =>
      update.status === "Failed"
    );

  }

  getRolledBack() {

    return this.filter(update =>
      update.status === "Rolled Back"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._updates).forEach(id => {

      if (callback(this._updates[id])) {

        results[id] = this._updates[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      updates: this.count(),

      pending: Object.keys(this.getPending()).length,

      approved: Object.keys(this.getApproved()).length,

      installed: Object.keys(this.getInstalled()).length,

      failed: Object.keys(this.getFailed()).length,

      rolledBack: Object.keys(this.getRolledBack()).length

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

      updates: this.getAll(),

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
  "System",
  "UpdateManager",
  new SystemUpdateManager()
);