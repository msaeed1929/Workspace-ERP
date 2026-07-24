/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 149_Workflow_AuditWorkflowManager.gs
 * Module      : Workflow
 * Class       : WorkflowAuditWorkflowManager
 * Version     : 1.0.0
 * Description : Workflow Audit Management Service
 * =============================================================================
 */

'use strict';

class WorkflowAuditWorkflowManager extends BaseService {

  constructor() {

    super("WorkflowAuditWorkflowManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._audits = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(auditId, data) {

    if (this.exists(auditId)) {

      return false;

    }

    this._audits[auditId] = Object.assign({

      workflowId: "",

      entityType: "",

      entityId: "",

      action: "",

      performedBy: "",

      performedDate: "",

      previousStatus: "",

      currentStatus: "",

      remarks: "",

      status: "Recorded"

    }, data || {});

    return true;

  }

  update(auditId, data) {

    if (!this.exists(auditId)) {

      return false;

    }

    Object.assign(

      this._audits[auditId],

      data || {}

    );

    return true;

  }

  get(auditId) {

    return this._audits[auditId] || null;

  }

  getAll() {

    return this._audits;

  }

  exists(auditId) {

    return this._audits.hasOwnProperty(auditId);

  }

  remove(auditId) {

    if (!this.exists(auditId)) {

      return false;

    }

    delete this._audits[auditId];

    return true;

  }

  clear() {

    this._audits = {};

    return true;

  }

  count() {

    return Object.keys(this._audits).length;

  }

  keys() {

    return Object.keys(this._audits);

  }

  //=========================================================================
  // Audit Workflow
  //=========================================================================

  verify(auditId) {

    if (!this.exists(auditId)) {

      return false;

    }

    this._audits[auditId].status = "Verified";

    return true;

  }

  archive(auditId) {

    if (!this.exists(auditId)) {

      return false;

    }

    this._audits[auditId].status = "Archived";

    return true;

  }

  restore(auditId) {

    if (!this.exists(auditId)) {

      return false;

    }

    this._audits[auditId].status = "Recorded";

    return true;

  }

  deleteRecord(auditId) {

    if (!this.exists(auditId)) {

      return false;

    }

    this._audits[auditId].status = "Deleted";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getRecorded() {

    return this.filter(audit =>
      audit.status === "Recorded"
    );

  }

  getVerified() {

    return this.filter(audit =>
      audit.status === "Verified"
    );

  }

  getArchived() {

    return this.filter(audit =>
      audit.status === "Archived"
    );

  }

  getDeleted() {

    return this.filter(audit =>
      audit.status === "Deleted"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._audits).forEach(id => {

      if (callback(this._audits[id])) {

        results[id] = this._audits[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      audits: this.count(),

      recorded: Object.keys(this.getRecorded()).length,

      verified: Object.keys(this.getVerified()).length,

      archived: Object.keys(this.getArchived()).length,

      deleted: Object.keys(this.getDeleted()).length

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

      audits: this.getAll(),

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
  "Workflow",
  "AuditWorkflowManager",
  new WorkflowAuditWorkflowManager()
);