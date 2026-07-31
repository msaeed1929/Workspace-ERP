/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 142_Reports_KPIManager.gs
 * Module      : Reports
 * Class       : ReportsKPIManager
 * Version     : 1.0.0
 * Description : KPI Management Service
 * =============================================================================
 */

'use strict';

class ReportsKPIManager extends BaseService {

  constructor() {

    super("ReportsKPIManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._kpis = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(kpiId, data) {

    if (this.exists(kpiId)) {

      return false;

    }

    this._kpis[kpiId] = Object.assign({

      kpiName: "",

      module: "",

      period: "",

      targetValue: 0,

      actualValue: 0,

      variance: 0,

      achievement: 0,

      owner: "",

      measurementDate: "",

      status: "Draft"

    }, data || {});

    return true;

  }

  update(kpiId, data) {

    if (!this.exists(kpiId)) {

      return false;

    }

    Object.assign(

      this._kpis[kpiId],

      data || {}

    );

    return true;

  }

  get(kpiId) {

    return this._kpis[kpiId] || null;

  }

  getAll() {

    return this._kpis;

  }

  exists(kpiId) {

    return this._kpis.hasOwnProperty(kpiId);

  }

  remove(kpiId) {

    if (!this.exists(kpiId)) {

      return false;

    }

    delete this._kpis[kpiId];

    return true;

  }

  clear() {

    this._kpis = {};

    return true;

  }

  count() {

    return Object.keys(this._kpis).length;

  }

  keys() {

    return Object.keys(this._kpis);

  }

  //=========================================================================
  // Workflow
  //=========================================================================

  approve(kpiId) {

    if (!this.exists(kpiId)) {

      return false;

    }

    this._kpis[kpiId].status = "Approved";

    return true;

  }

  publish(kpiId) {

    if (!this.exists(kpiId)) {

      return false;

    }

    this._kpis[kpiId].status = "Published";

    return true;

  }

  archive(kpiId) {

    if (!this.exists(kpiId)) {

      return false;

    }

    this._kpis[kpiId].status = "Archived";

    return true;

  }

  reopen(kpiId) {

    if (!this.exists(kpiId)) {

      return false;

    }

    this._kpis[kpiId].status = "Draft";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getDraft() {

    return this.filter(kpi =>
      kpi.status === "Draft"
    );

  }

  getApproved() {

    return this.filter(kpi =>
      kpi.status === "Approved"
    );

  }

  getPublished() {

    return this.filter(kpi =>
      kpi.status === "Published"
    );

  }

  getArchived() {

    return this.filter(kpi =>
      kpi.status === "Archived"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._kpis).forEach(id => {

      if (callback(this._kpis[id])) {

        results[id] = this._kpis[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      kpis: this.count(),

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

      kpis: this.getAll(),

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
function bootReportsKPIManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "Reports",
      "KPIManager",
      new ReportsKPIManager()
    );
  }
}