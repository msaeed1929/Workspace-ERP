/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 145_Workflow_WorkflowManager.gs
 * Module      : Workflow
 * Class       : WorkflowWorkflowManager
 * Version     : 1.0.0
 * Description : Workflow Management Service
 * =============================================================================
 */

'use strict';

class WorkflowWorkflowManager extends BaseService {

  constructor() {

    super("WorkflowWorkflowManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._workflows = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(workflowId, data) {

    if (this.exists(workflowId)) {

      return false;

    }

    this._workflows[workflowId] = Object.assign({

      workflowName: "",

      module: "",

      entityType: "",

      triggerEvent: "",

      currentStep: "",

      totalSteps: 0,

      owner: "",

      createdDate: "",

      status: "Draft"

    }, data || {});

    return true;

  }

  update(workflowId, data) {

    if (!this.exists(workflowId)) {

      return false;

    }

    Object.assign(

      this._workflows[workflowId],

      data || {}

    );

    return true;

  }

  get(workflowId) {

    return this._workflows[workflowId] || null;

  }

  getAll() {

    return this._workflows;

  }

  exists(workflowId) {

    return this._workflows.hasOwnProperty(workflowId);

  }

  remove(workflowId) {

    if (!this.exists(workflowId)) {

      return false;

    }

    delete this._workflows[workflowId];

    return true;

  }

  clear() {

    this._workflows = {};

    return true;

  }

  count() {

    return Object.keys(this._workflows).length;

  }

  keys() {

    return Object.keys(this._workflows);

  }

  //=========================================================================
  // Workflow Lifecycle
  //=========================================================================

  approve(workflowId) {

    if (!this.exists(workflowId)) {

      return false;

    }

    this._workflows[workflowId].status = "Approved";

    return true;

  }

  activate(workflowId) {

    if (!this.exists(workflowId)) {

      return false;

    }

    this._workflows[workflowId].status = "Active";

    return true;

  }

  deactivate(workflowId) {

    if (!this.exists(workflowId)) {

      return false;

    }

    this._workflows[workflowId].status = "Inactive";

    return true;

  }

  reopen(workflowId) {

    if (!this.exists(workflowId)) {

      return false;

    }

    this._workflows[workflowId].status = "Draft";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getDraft() {

    return this.filter(workflow =>
      workflow.status === "Draft"
    );

  }

  getApproved() {

    return this.filter(workflow =>
      workflow.status === "Approved"
    );

  }

  getActive() {

    return this.filter(workflow =>
      workflow.status === "Active"
    );

  }

  getInactive() {

    return this.filter(workflow =>
      workflow.status === "Inactive"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._workflows).forEach(id => {

      if (callback(this._workflows[id])) {

        results[id] = this._workflows[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      workflows: this.count(),

      draft: Object.keys(this.getDraft()).length,

      approved: Object.keys(this.getApproved()).length,

      active: Object.keys(this.getActive()).length,

      inactive: Object.keys(this.getInactive()).length

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

      workflows: this.getAll(),

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
function bootWorkflowWorkflowManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "Workflow",
      "WorkflowManager",
      new WorkflowWorkflowManager()
    );
  }
}