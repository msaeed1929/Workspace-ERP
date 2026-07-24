/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 162_BI_BIDashboardManager.gs
 * Module      : Business Intelligence
 * Class       : BIBIDashboardManager
 * Version     : 1.0.0
 * Description : Business Intelligence Dashboard Management Service
 * =============================================================================
 */

'use strict';

class BIBIDashboardManager extends BaseService {

  constructor() {

    super("BIBIDashboardManager");

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

      dashboardType: "",

      owner: "",

      audience: "",

      widgets: 0,

      refreshInterval: "15 Minutes",

      lastRefresh: "",

      successRate: 0,

      status: "Draft"

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

  approve(dashboardId) {

    if (!this.exists(dashboardId)) {

      return false;

    }

    this._dashboards[dashboardId].status = "Approved";

    return true;

  }

  publish(dashboardId) {

    if (!this.exists(dashboardId)) {

      return false;

    }

    this._dashboards[dashboardId].status = "Published";

    this._dashboards[dashboardId].lastRefresh = new Date();

    return true;

  }

  archive(dashboardId) {

    if (!this.exists(dashboardId)) {

      return false;

    }

    this._dashboards[dashboardId].status = "Archived";

    return true;

  }

  reopen(dashboardId) {

    if (!this.exists(dashboardId)) {

      return false;

    }

    this._dashboards[dashboardId].status = "Draft";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getDraft() {

    return this.filter(item =>
      item.status === "Draft"
    );

  }

  getApproved() {

    return this.filter(item =>
      item.status === "Approved"
    );

  }

  getPublished() {

    return this.filter(item =>
      item.status === "Published"
    );

  }

  getArchived() {

    return this.filter(item =>
      item.status === "Archived"
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

      draft: Object.keys(this.getDraft()).length,

      approved: Object.keys(this.getApproved()).length,

      published: Object.keys(this.getPublished()).length,

      archived: Object.keys(this.getArchived()).length

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
  "BI",
  "BIDashboardManager",
  new BIBIDashboardManager()
);