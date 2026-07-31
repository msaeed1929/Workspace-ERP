/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 158_BI_DataWarehouseManager.gs
 * Module      : Business Intelligence
 * Class       : BIDataWarehouseManager
 * Version     : 1.0.0
 * Description : Data Warehouse Management Service
 * =============================================================================
 */

'use strict';

class BIDataWarehouseManager extends BaseService {

  constructor() {

    super("BIDataWarehouseManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._warehouses = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(warehouseId, data) {

    if (this.exists(warehouseId)) {

      return false;

    }

    this._warehouses[warehouseId] = Object.assign({

      warehouseName: "",

      databaseType: "",

      server: "",

      database: "",

      storageSizeGB: 0,

      tables: 0,

      lastRefresh: "",

      refreshFrequency: "Daily",

      status: "Offline"

    }, data || {});

    return true;

  }

  update(warehouseId, data) {

    if (!this.exists(warehouseId)) {

      return false;

    }

    Object.assign(

      this._warehouses[warehouseId],

      data || {}

    );

    return true;

  }

  get(warehouseId) {

    return this._warehouses[warehouseId] || null;

  }

  getAll() {

    return this._warehouses;

  }

  exists(warehouseId) {

    return this._warehouses.hasOwnProperty(warehouseId);

  }

  remove(warehouseId) {

    if (!this.exists(warehouseId)) {

      return false;

    }

    delete this._warehouses[warehouseId];

    return true;

  }

  clear() {

    this._warehouses = {};

    return true;

  }

  count() {

    return Object.keys(this._warehouses).length;

  }

  keys() {

    return Object.keys(this._warehouses);

  }

  //=========================================================================
  // Warehouse Lifecycle
  //=========================================================================

  online(warehouseId) {

    if (!this.exists(warehouseId)) {

      return false;

    }

    this._warehouses[warehouseId].status = "Online";

    return true;

  }

  offline(warehouseId) {

    if (!this.exists(warehouseId)) {

      return false;

    }

    this._warehouses[warehouseId].status = "Offline";

    return true;

  }

  refresh(warehouseId) {

    if (!this.exists(warehouseId)) {

      return false;

    }

    this._warehouses[warehouseId].lastRefresh = new Date();

    this._warehouses[warehouseId].status = "Refreshing";

    return true;

  }

  maintenance(warehouseId) {

    if (!this.exists(warehouseId)) {

      return false;

    }

    this._warehouses[warehouseId].status = "Maintenance";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getOnline() {

    return this.filter(item =>
      item.status === "Online"
    );

  }

  getOffline() {

    return this.filter(item =>
      item.status === "Offline"
    );

  }

  getRefreshing() {

    return this.filter(item =>
      item.status === "Refreshing"
    );

  }

  getMaintenance() {

    return this.filter(item =>
      item.status === "Maintenance"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._warehouses).forEach(id => {

      if (callback(this._warehouses[id])) {

        results[id] = this._warehouses[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      warehouses: this.count(),

      online: Object.keys(this.getOnline()).length,

      offline: Object.keys(this.getOffline()).length,

      refreshing: Object.keys(this.getRefreshing()).length,

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

      warehouses: this.getAll(),

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
function bootBIDataWarehouseManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "BI",
      "DataWarehouseManager",
      new BIDataWarehouseManager()
    );
  }
}