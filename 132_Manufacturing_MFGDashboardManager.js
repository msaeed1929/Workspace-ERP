/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 132_Manufacturing_MFGDashboardManager.gs
 * Module      : Manufacturing
 * Class       : ManufacturingMFGDashboardManager
 * Version     : 1.0.0
 * Description : Manufacturing Dashboard Management Service
 * =============================================================================
 */

'use strict';

class ManufacturingMFGDashboardManager extends BaseService {

  constructor() {

    super("ManufacturingMFGDashboardManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._dashboard = {};

    return this;

  }

  //=========================================================================
  // Dashboard
  //=========================================================================

  create(snapshotId, data) {

    if (this.exists(snapshotId)) {

      return false;

    }

    this._dashboard[snapshotId] = Object.assign({

      snapshotDate: "",

      productionOrders: 0,

      completedOrders: 0,

      pendingOrders: 0,

      plannedQuantity: 0,

      producedQuantity: 0,

      rejectedQuantity: 0,

      machineUtilization: 0,

      efficiency: 0,

      status: "Draft"

    }, data || {});

    return true;

  }

  update(snapshotId, data) {

    if (!this.exists(snapshotId)) {

      return false;

    }

    Object.assign(

      this._dashboard[snapshotId],

      data || {}

    );

    return true;

  }

  get(snapshotId) {

    return this._dashboard[snapshotId] || null;

  }

  getAll() {

    return this._dashboard;

  }

  exists(snapshotId) {

    return this._dashboard.hasOwnProperty(snapshotId);

  }

  remove(snapshotId) {

    if (!this.exists(snapshotId)) {

      return false;

    }

    delete this._dashboard[snapshotId];

    return true;

  }

  clear() {

    this._dashboard = {};

    return true;

  }

  count() {

    return Object.keys(this._dashboard).length;

  }

  keys() {

    return Object.keys(this._dashboard);

  }

  //=========================================================================
  // Workflow
  //=========================================================================

  approve(snapshotId) {

    if (!this.exists(snapshotId)) {

      return false;

    }

    this._dashboard[snapshotId].status = "Approved";

    return true;

  }

  publish(snapshotId) {

    if (!this.exists(snapshotId)) {

      return false;

    }

    this._dashboard[snapshotId].status = "Published";

    return true;

  }

  archive(snapshotId) {

    if (!this.exists(snapshotId)) {

      return false;

    }

    this._dashboard[snapshotId].status = "Archived";

    return true;

  }

  reopen(snapshotId) {

    if (!this.exists(snapshotId)) {

      return false;

    }

    this._dashboard[snapshotId].status = "Draft";

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

    Object.keys(this._dashboard).forEach(id => {

      if (callback(this._dashboard[id])) {

        results[id] = this._dashboard[id];

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

      dashboard: this.getAll(),

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
function bootManufacturingMFGDashboardManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "Manufacturing",
      "MFGDashboardManager",
      new ManufacturingMFGDashboardManager()
    );
  }
}