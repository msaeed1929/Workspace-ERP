/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 140_FixedAssets_FADashboardManager.gs
 * Module      : Fixed Assets
 * Class       : FixedAssetsFADashboardManager
 * Version     : 1.0.0
 * Description : Fixed Assets Dashboard Management Service
 * =============================================================================
 */

'use strict';

class FixedAssetsFADashboardManager extends BaseService {

  constructor() {

    super("FixedAssetsFADashboardManager");

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

      dashboardDate: "",

      totalAssets: 0,

      activeAssets: 0,

      disposedAssets: 0,

      totalAssetCost: 0,

      totalBookValue: 0,

      accumulatedDepreciation: 0,

      depreciationExpense: 0,

      netAssetValue: 0,

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
  // Workflow
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

    return this.filter(dashboard =>
      dashboard.status === "Draft"
    );

  }

  getApproved() {

    return this.filter(dashboard =>
      dashboard.status === "Approved"
    );

  }

  getPublished() {

    return this.filter(dashboard =>
      dashboard.status === "Published"
    );

  }

  getArchived() {

    return this.filter(dashboard =>
      dashboard.status === "Archived"
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
  "FixedAssets",
  "FADashboardManager",
  new FixedAssetsFADashboardManager()
);