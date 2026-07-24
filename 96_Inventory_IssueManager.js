/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 96_Inventory_IssueManager.gs
 * Module      : Inventory
 * Class       : InventoryIssueManager
 * Version     : 1.0.0
 * Description : Inventory Issue Management Service
 * =============================================================================
 */

'use strict';

class InventoryIssueManager extends BaseService {

  constructor() {

    super("InventoryIssueManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._issues = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(issueNo, data) {

    if (this.exists(issueNo)) {

      return false;

    }

    this._issues[issueNo] = Object.assign({

      item: "",

      warehouse: "",

      quantity: 0,

      issuedTo: "",

      status: "Draft"

    }, data || {});

    return true;

  }

  update(issueNo, data) {

    if (!this.exists(issueNo)) {

      return false;

    }

    Object.assign(

      this._issues[issueNo],

      data || {}

    );

    return true;

  }

  get(issueNo) {

    return this._issues[issueNo] || null;

  }

  getAll() {

    return this._issues;

  }

  exists(issueNo) {

    return this._issues.hasOwnProperty(issueNo);

  }

  remove(issueNo) {

    if (!this.exists(issueNo)) {

      return false;

    }

    delete this._issues[issueNo];

    return true;

  }

  clear() {

    this._issues = {};

    return true;

  }

  count() {

    return Object.keys(this._issues).length;

  }

  keys() {

    return Object.keys(this._issues);

  }

  //=========================================================================
  // Status Management
  //=========================================================================

  approve(issueNo) {

    if (!this.exists(issueNo)) {

      return false;

    }

    this._issues[issueNo].status = "Approved";

    return true;

  }

  issue(issueNo) {

    if (!this.exists(issueNo)) {

      return false;

    }

    this._issues[issueNo].status = "Issued";

    return true;

  }

  complete(issueNo) {

    if (!this.exists(issueNo)) {

      return false;

    }

    this._issues[issueNo].status = "Completed";

    return true;

  }

  cancel(issueNo) {

    if (!this.exists(issueNo)) {

      return false;

    }

    this._issues[issueNo].status = "Cancelled";

    return true;

  }

  reopen(issueNo) {

    if (!this.exists(issueNo)) {

      return false;

    }

    this._issues[issueNo].status = "Draft";

    return true;

  }

  //=========================================================================
  // Filters
  //=========================================================================

  getDraft() {

    return Object.fromEntries(

      Object.entries(this._issues).filter(

        ([, issue]) => issue.status === "Draft"

      )

    );

  }

  getApproved() {

    return Object.fromEntries(

      Object.entries(this._issues).filter(

        ([, issue]) => issue.status === "Approved"

      )

    );

  }

  getIssued() {

    return Object.fromEntries(

      Object.entries(this._issues).filter(

        ([, issue]) => issue.status === "Issued"

      )

    );

  }

  getCompleted() {

    return Object.fromEntries(

      Object.entries(this._issues).filter(

        ([, issue]) => issue.status === "Completed"

      )

    );

  }

  getCancelled() {

    return Object.fromEntries(

      Object.entries(this._issues).filter(

        ([, issue]) => issue.status === "Cancelled"

      )

    );

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      issues: this.count(),

      draft: Object.keys(this.getDraft()).length,

      approved: Object.keys(this.getApproved()).length,

      issued: Object.keys(this.getIssued()).length,

      completed: Object.keys(this.getCompleted()).length,

      cancelled: Object.keys(this.getCancelled()).length

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

      issues: this.getAll(),

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
  "Inventory",
  "IssueManager",
  new InventoryIssueManager()
);