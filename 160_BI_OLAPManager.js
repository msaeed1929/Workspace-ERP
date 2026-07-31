/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 160_BI_OLAPManager.gs
 * Module      : Business Intelligence
 * Class       : BIOLAPManager
 * Version     : 1.0.0
 * Description : OLAP Cube Management Service
 * =============================================================================
 */

'use strict';

class BIOLAPManager extends BaseService {

  constructor() {

    super("BIOLAPManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._cubes = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(cubeId, data) {

    if (this.exists(cubeId)) {

      return false;

    }

    this._cubes[cubeId] = Object.assign({

      cubeName: "",

      subjectArea: "",

      dimensions: 0,

      measures: 0,

      factTables: 0,

      lastProcessed: "",

      processingMode: "Incremental",

      storageMode: "MOLAP",

      status: "Offline"

    }, data || {});

    return true;

  }

  update(cubeId, data) {

    if (!this.exists(cubeId)) {

      return false;

    }

    Object.assign(

      this._cubes[cubeId],

      data || {}

    );

    return true;

  }

  get(cubeId) {

    return this._cubes[cubeId] || null;

  }

  getAll() {

    return this._cubes;

  }

  exists(cubeId) {

    return this._cubes.hasOwnProperty(cubeId);

  }

  remove(cubeId) {

    if (!this.exists(cubeId)) {

      return false;

    }

    delete this._cubes[cubeId];

    return true;

  }

  clear() {

    this._cubes = {};

    return true;

  }

  count() {

    return Object.keys(this._cubes).length;

  }

  keys() {

    return Object.keys(this._cubes);

  }

  //=========================================================================
  // Cube Lifecycle
  //=========================================================================

  online(cubeId) {

    if (!this.exists(cubeId)) {

      return false;

    }

    this._cubes[cubeId].status = "Online";

    return true;

  }

  process(cubeId) {

    if (!this.exists(cubeId)) {

      return false;

    }

    this._cubes[cubeId].status = "Processing";

    this._cubes[cubeId].lastProcessed = new Date();

    return true;

  }

  maintenance(cubeId) {

    if (!this.exists(cubeId)) {

      return false;

    }

    this._cubes[cubeId].status = "Maintenance";

    return true;

  }

  offline(cubeId) {

    if (!this.exists(cubeId)) {

      return false;

    }

    this._cubes[cubeId].status = "Offline";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getOnline() {

    return this.filter(cube =>
      cube.status === "Online"
    );

  }

  getOffline() {

    return this.filter(cube =>
      cube.status === "Offline"
    );

  }

  getProcessing() {

    return this.filter(cube =>
      cube.status === "Processing"
    );

  }

  getMaintenance() {

    return this.filter(cube =>
      cube.status === "Maintenance"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._cubes).forEach(id => {

      if (callback(this._cubes[id])) {

        results[id] = this._cubes[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      cubes: this.count(),

      online: Object.keys(this.getOnline()).length,

      offline: Object.keys(this.getOffline()).length,

      processing: Object.keys(this.getProcessing()).length,

      maintenance: Object.keys(this.getMaintenance()).length

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

      cubes: this.getAll(),

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
function bootBIOLAPManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "BI",
      "OLAPManager",
      new BIOLAPManager()
    );
  }
}