/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 163_System_SystemManager.gs
 * Module      : System
 * Class       : SystemManager
 * Version     : 1.0.0
 * Description : System Management Service
 * =============================================================================
 */

'use strict';

class SystemManager extends BaseService {

  constructor() {

    super("SystemManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._systems = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(systemId, data) {

    if (this.exists(systemId)) {

      return false;

    }

    this._systems[systemId] = Object.assign({

      systemName: "",

      frameworkVersion: "",

      environment: "",

      buildNumber: "",

      startupTime: "",

      timezone: "",

      locale: "",

      modulesLoaded: 0,

      status: "Stopped"

    }, data || {});

    return true;

  }

  update(systemId, data) {

    if (!this.exists(systemId)) {

      return false;

    }

    Object.assign(

      this._systems[systemId],

      data || {}

    );

    return true;

  }

  get(systemId) {

    return this._systems[systemId] || null;

  }

  getAll() {

    return this._systems;

  }

  exists(systemId) {

    return this._systems.hasOwnProperty(systemId);

  }

  remove(systemId) {

    if (!this.exists(systemId)) {

      return false;

    }

    delete this._systems[systemId];

    return true;

  }

  clear() {

    this._systems = {};

    return true;

  }

  count() {

    return Object.keys(this._systems).length;

  }

  keys() {

    return Object.keys(this._systems);

  }

  //=========================================================================
  // System Lifecycle
  //=========================================================================

  start(systemId) {

    if (!this.exists(systemId)) {

      return false;

    }

    this._systems[systemId].status = "Running";

    this._systems[systemId].startupTime = new Date();

    return true;

  }

  stop(systemId) {

    if (!this.exists(systemId)) {

      return false;

    }

    this._systems[systemId].status = "Stopped";

    return true;

  }

  maintenance(systemId) {

    if (!this.exists(systemId)) {

      return false;

    }

    this._systems[systemId].status = "Maintenance";

    return true;

  }

  restart(systemId) {

    if (!this.exists(systemId)) {

      return false;

    }

    this._systems[systemId].status = "Restarting";

    this._systems[systemId].startupTime = new Date();

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getRunning() {

    return this.filter(system =>
      system.status === "Running"
    );

  }

  getStopped() {

    return this.filter(system =>
      system.status === "Stopped"
    );

  }

  getMaintenance() {

    return this.filter(system =>
      system.status === "Maintenance"
    );

  }

  getRestarting() {

    return this.filter(system =>
      system.status === "Restarting"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._systems).forEach(id => {

      if (callback(this._systems[id])) {

        results[id] = this._systems[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      systems: this.count(),

      running: Object.keys(this.getRunning()).length,

      stopped: Object.keys(this.getStopped()).length,

      maintenance: Object.keys(this.getMaintenance()).length,

      restarting: Object.keys(this.getRestarting()).length

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

      systems: this.getAll(),

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
function bootSystemManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "System",
      "SystemManager",
      new SystemManager()
    );
  }
}