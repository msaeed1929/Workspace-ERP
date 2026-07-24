/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 141_Reports_ReportManager.gs
 * Module      : Reports
 * Class       : ReportsReportManager
 * Version     : 1.0.0
 * Description : Report Management Service
 * =============================================================================
 */

'use strict';

class ReportsReportManager extends BaseService {

  constructor() {

    super("ReportsReportManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._reports = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(reportId, data) {

    if (this.exists(reportId)) {

      return false;

    }

    this._reports[reportId] = Object.assign({

      reportName: "",

      reportType: "",

      module: "",

      generatedBy: "",

      generatedDate: "",

      format: "PDF",

      records: 0,

      executionTime: 0,

      fileSize: 0,

      status: "Draft"

    }, data || {});

    return true;

  }

  update(reportId, data) {

    if (!this.exists(reportId)) {

      return false;

    }

    Object.assign(

      this._reports[reportId],

      data || {}

    );

    return true;

  }

  get(reportId) {

    return this._reports[reportId] || null;

  }

  getAll() {

    return this._reports;

  }

  exists(reportId) {

    return this._reports.hasOwnProperty(reportId);

  }

  remove(reportId) {

    if (!this.exists(reportId)) {

      return false;

    }

    delete this._reports[reportId];

    return true;

  }

  clear() {

    this._reports = {};

    return true;

  }

  count() {

    return Object.keys(this._reports).length;

  }

  keys() {

    return Object.keys(this._reports);

  }

  //=========================================================================
  // Workflow
  //=========================================================================

  approve(reportId) {

    if (!this.exists(reportId)) {

      return false;

    }

    this._reports[reportId].status = "Approved";

    return true;

  }

  publish(reportId) {

    if (!this.exists(reportId)) {

      return false;

    }

    this._reports[reportId].status = "Published";

    return true;

  }

  archive(reportId) {

    if (!this.exists(reportId)) {

      return false;

    }

    this._reports[reportId].status = "Archived";

    return true;

  }

  reopen(reportId) {

    if (!this.exists(reportId)) {

      return false;

    }

    this._reports[reportId].status = "Draft";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getDraft() {

    return this.filter(report =>
      report.status === "Draft"
    );

  }

  getApproved() {

    return this.filter(report =>
      report.status === "Approved"
    );

  }

  getPublished() {

    return this.filter(report =>
      report.status === "Published"
    );

  }

  getArchived() {

    return this.filter(report =>
      report.status === "Archived"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._reports).forEach(id => {

      if (callback(this._reports[id])) {

        results[id] = this._reports[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      reports: this.count(),

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

      reports: this.getAll(),

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
  "Reports",
  "ReportManager",
  new ReportsReportManager()
);