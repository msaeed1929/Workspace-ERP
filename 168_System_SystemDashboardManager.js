/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 168_System_SystemDashboardManager.gs
 * Module      : System
 * Class       : SystemDashboardManager
 * Version     : 1.0.0
 * Description : System Dashboard Management Service
 * =============================================================================
 */

'use strict';

class SystemDashboardManager extends BaseService {

  constructor() {

    super("SystemDashboardManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._dashboards = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(dashboardId, data) {

    if (this.exists(dashboardId)) {

      return false;

    }

    this._dashboards[dashboardId] = Object.assign({

      dashboardName: "",

      owner: "",

      environment: "",

      widgets: 0,

      refreshInterval: "5 Minutes",

      lastRefresh: "",

      healthScore: 100,

      activeUsers: 0,

      systemLoad: 0,

      status: "Offline"

    }, data || {});

    return true;

  }

  update(dashboardId, data) {

    if (!this.exists(dashboardId)) {

      return false;

    }

    Object.assign(

      this._dashboards[dashboardId],

      data || {}

    );

    return true;

  }

  get(dashboardId) {

    return this._dashboards[dashboardId] || null;

  }

  getAll() {

    return this._dashboards;

  }

  exists(dashboardId) {

    return this._dashboards.hasOwnProperty(dashboardId);

  }

  remove(dashboardId) {

    if (!this.exists(dashboardId)) {

      return false;

    }

    delete this._dashboards[dashboardId];

    return true;

  }

  clear() {

    this._dashboards = {};

    return true;

  }

  count() {

    return Object.keys(this._dashboards).length;

  }

  keys() {

    return Object.keys(this._dashboards);

  }

  //=========================================================================
  // Dashboard Lifecycle
  //=========================================================================

  online(dashboardId) {

    if (!this.exists(dashboardId)) {

      return false;

    }

    this._dashboards[dashboardId].status = "Online";

    this._dashboards[dashboardId].lastRefresh = new Date();

    return true;

  }

  offline(dashboardId) {

    if (!this.exists(dashboardId)) {

      return false;

    }

    this._dashboards[dashboardId].status = "Offline";

    return true;

  }

  maintenance(dashboardId) {

    if (!this.exists(dashboardId)) {

      return false;

    }

    this._dashboards[dashboardId].status = "Maintenance";

    return true;

  }

  refresh(dashboardId) {

    if (!this.exists(dashboardId)) {

      return false;

    }

    this._dashboards[dashboardId].lastRefresh = new Date();

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getOnline() {

    return this.filter(dashboard =>
      dashboard.status === "Online"
    );

  }

  getOffline() {

    return this.filter(dashboard =>
      dashboard.status === "Offline"
    );

  }

  getMaintenance() {

    return this.filter(dashboard =>
      dashboard.status === "Maintenance"
    );

  }

  getRecentlyRefreshed() {

    return this.filter(dashboard =>
      dashboard.lastRefresh !== ""
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._dashboards).forEach(id => {

      if (callback(this._dashboards[id])) {

        results[id] = this._dashboards[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      dashboards: this.count(),

      online: Object.keys(this.getOnline()).length,

      offline: Object.keys(this.getOffline()).length,

      maintenance: Object.keys(this.getMaintenance()).length,

      refreshed: Object.keys(this.getRecentlyRefreshed()).length

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

      dashboards: this.getAll(),

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
  "SystemDashboardManager",
  new SystemDashboardManager()
);