/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 128_Manufacturing_MaterialIssueManager.gs
 * Module      : Manufacturing
 * Class       : ManufacturingMaterialIssueManager
 * Version     : 1.0.0
 * Description : Manufacturing Material Issue Management Service
 * =============================================================================
 */

'use strict';

class ManufacturingMaterialIssueManager extends BaseService {

  constructor() {

    super("ManufacturingMaterialIssueManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._materialIssues = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(issueId, data) {

    if (this.exists(issueId)) {

      return false;

    }

    this._materialIssues[issueId] = Object.assign({

      workOrderId: "",

      materialCode: "",

      materialName: "",

      warehouse: "",

      issueDate: "",

      quantity: 0,

      unit: "",

      issuedBy: "",

      status: "Draft"

    }, data || {});

    return true;

  }

  update(issueId, data) {

    if (!this.exists(issueId)) {

      return false;

    }

    Object.assign(

      this._materialIssues[issueId],

      data || {}

    );

    return true;

  }

  get(issueId) {

    return this._materialIssues[issueId] || null;

  }

  getAll() {

    return this._materialIssues;

  }

  exists(issueId) {

    return this._materialIssues.hasOwnProperty(issueId);

  }

  remove(issueId) {

    if (!this.exists(issueId)) {

      return false;

    }

    delete this._materialIssues[issueId];

    return true;

  }

  clear() {

    this._materialIssues = {};

    return true;

  }

  count() {

    return Object.keys(this._materialIssues).length;

  }

  keys() {

    return Object.keys(this._materialIssues);

  }

  //=========================================================================
  // Workflow
  //=========================================================================

  approve(issueId) {

    if (!this.exists(issueId)) {

      return false;

    }

    this._materialIssues[issueId].status = "Approved";

    return true;

  }

  issue(issueId) {

    if (!this.exists(issueId)) {

      return false;

    }

    this._materialIssues[issueId].status = "Issued";

    return true;

  }

  reverse(issueId) {

    if (!this.exists(issueId)) {

      return false;

    }

    this._materialIssues[issueId].status = "Reversed";

    return true;

  }

  reopen(issueId) {

    if (!this.exists(issueId)) {

      return false;

    }

    this._materialIssues[issueId].status = "Draft";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getDraft() {

    return this.filter(issue =>
      issue.status === "Draft"
    );

  }

  getApproved() {

    return this.filter(issue =>
      issue.status === "Approved"
    );

  }

  getIssued() {

    return this.filter(issue =>
      issue.status === "Issued"
    );

  }

  getReversed() {

    return this.filter(issue =>
      issue.status === "Reversed"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._materialIssues).forEach(id => {

      if (callback(this._materialIssues[id])) {

        results[id] = this._materialIssues[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      materialIssues: this.count(),

      draft: Object.keys(this.getDraft()).length,

      approved: Object.keys(this.getApproved()).length,

      issued: Object.keys(this.getIssued()).length,

      reversed: Object.keys(this.getReversed()).length

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

      materialIssues: this.getAll(),

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

function registerManufacturingMaterialIssueManager() {
function bootManufacturingMaterialIssueManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "Manufacturing",
      "MaterialIssueManager",
      new ManufacturingMaterialIssueManager()
    );
  }
}
}