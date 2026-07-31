/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 143_Reports_AnalyticsManager.gs
 * Module      : Reports
 * Class       : ReportsAnalyticsManager
 * Version     : 1.0.0
 * Description : Analytics Management Service
 * =============================================================================
 */

'use strict';

class ReportsAnalyticsManager extends BaseService {

  constructor() {

    super("ReportsAnalyticsManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._analytics = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(analyticsId, data) {

    if (this.exists(analyticsId)) {

      return false;

    }

    this._analytics[analyticsId] = Object.assign({

      analysisName: "",

      module: "",

      period: "",

      metric: "",

      value: 0,

      trend: "",

      variance: 0,

      generatedDate: "",

      analyst: "",

      status: "Draft"

    }, data || {});

    return true;

  }

  update(analyticsId, data) {

    if (!this.exists(analyticsId)) {

      return false;

    }

    Object.assign(

      this._analytics[analyticsId],

      data || {}

    );

    return true;

  }

  get(analyticsId) {

    return this._analytics[analyticsId] || null;

  }

  getAll() {

    return this._analytics;

  }

  exists(analyticsId) {

    return this._analytics.hasOwnProperty(analyticsId);

  }

  remove(analyticsId) {

    if (!this.exists(analyticsId)) {

      return false;

    }

    delete this._analytics[analyticsId];

    return true;

  }

  clear() {

    this._analytics = {};

    return true;

  }

  count() {

    return Object.keys(this._analytics).length;

  }

  keys() {

    return Object.keys(this._analytics);

  }

  //=========================================================================
  // Workflow
  //=========================================================================

  approve(analyticsId) {

    if (!this.exists(analyticsId)) {

      return false;

    }

    this._analytics[analyticsId].status = "Approved";

    return true;

  }

  publish(analyticsId) {

    if (!this.exists(analyticsId)) {

      return false;

    }

    this._analytics[analyticsId].status = "Published";

    return true;

  }

  archive(analyticsId) {

    if (!this.exists(analyticsId)) {

      return false;

    }

    this._analytics[analyticsId].status = "Archived";

    return true;

  }

  reopen(analyticsId) {

    if (!this.exists(analyticsId)) {

      return false;

    }

    this._analytics[analyticsId].status = "Draft";

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

    Object.keys(this._analytics).forEach(id => {

      if (callback(this._analytics[id])) {

        results[id] = this._analytics[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      analytics: this.count(),

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

      analytics: this.getAll(),

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
function bootReportsAnalyticsManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "Reports",
      "AnalyticsManager",
      new ReportsAnalyticsManager()
    );
  }
}