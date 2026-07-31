/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 146_Workflow_ApprovalManager.gs
 * Module      : Workflow
 * Class       : WorkflowApprovalManager
 * Version     : 1.0.0
 * Description : Workflow Approval Management Service
 * =============================================================================
 */

'use strict';

class WorkflowApprovalManager extends BaseService {

  constructor() {

    super("WorkflowApprovalManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._approvals = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(approvalId, data) {

    if (this.exists(approvalId)) {

      return false;

    }

    this._approvals[approvalId] = Object.assign({

      workflowId: "",

      documentNo: "",

      module: "",

      approvalLevel: 1,

      approver: "",

      submittedBy: "",

      submittedDate: "",

      approvedDate: "",

      remarks: "",

      status: "Pending"

    }, data || {});

    return true;

  }

  update(approvalId, data) {

    if (!this.exists(approvalId)) {

      return false;

    }

    Object.assign(

      this._approvals[approvalId],

      data || {}

    );

    return true;

  }

  get(approvalId) {

    return this._approvals[approvalId] || null;

  }

  getAll() {

    return this._approvals;

  }

  exists(approvalId) {

    return this._approvals.hasOwnProperty(approvalId);

  }

  remove(approvalId) {

    if (!this.exists(approvalId)) {

      return false;

    }

    delete this._approvals[approvalId];

    return true;

  }

  clear() {

    this._approvals = {};

    return true;

  }

  count() {

    return Object.keys(this._approvals).length;

  }

  keys() {

    return Object.keys(this._approvals);

  }

  //=========================================================================
  // Approval Actions
  //=========================================================================

  approve(approvalId) {

    if (!this.exists(approvalId)) {

      return false;

    }

    this._approvals[approvalId].status = "Approved";

    return true;

  }

  reject(approvalId) {

    if (!this.exists(approvalId)) {

      return false;

    }

    this._approvals[approvalId].status = "Rejected";

    return true;

  }

  cancel(approvalId) {

    if (!this.exists(approvalId)) {

      return false;

    }

    this._approvals[approvalId].status = "Cancelled";

    return true;

  }

  reopen(approvalId) {

    if (!this.exists(approvalId)) {

      return false;

    }

    this._approvals[approvalId].status = "Pending";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getPending() {

    return this.filter(approval =>
      approval.status === "Pending"
    );

  }

  getApproved() {

    return this.filter(approval =>
      approval.status === "Approved"
    );

  }

  getRejected() {

    return this.filter(approval =>
      approval.status === "Rejected"
    );

  }

  getCancelled() {

    return this.filter(approval =>
      approval.status === "Cancelled"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._approvals).forEach(id => {

      if (callback(this._approvals[id])) {

        results[id] = this._approvals[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      approvals: this.count(),

      pending: Object.keys(this.getPending()).length,

      approved: Object.keys(this.getApproved()).length,

      rejected: Object.keys(this.getRejected()).length,

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

      approvals: this.getAll(),

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
function bootWorkflowApprovalManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "Workflow",
      "ApprovalManager",
      new WorkflowApprovalManager()
    );
  }
}