/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 133_Projects_ProjectManager.gs
 * Module      : Projects
 * Class       : ProjectsProjectManager
 * Version     : 1.0.0
 * Description : Projects Management Service
 * =============================================================================
 */

'use strict';

class ProjectsProjectManager extends BaseService {

  constructor() {

    super("ProjectsProjectManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._projects = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(projectId, data) {

    if (this.exists(projectId)) {

      return false;

    }

    this._projects[projectId] = Object.assign({

      projectCode: "",

      projectName: "",

      customer: "",

      manager: "",

      startDate: "",

      endDate: "",

      budget: 0,

      progress: 0,

      status: "Draft"

    }, data || {});

    return true;

  }

  update(projectId, data) {

    if (!this.exists(projectId)) {

      return false;

    }

    Object.assign(

      this._projects[projectId],

      data || {}

    );

    return true;

  }

  get(projectId) {

    return this._projects[projectId] || null;

  }

  getAll() {

    return this._projects;

  }

  exists(projectId) {

    return this._projects.hasOwnProperty(projectId);

  }

  remove(projectId) {

    if (!this.exists(projectId)) {

      return false;

    }

    delete this._projects[projectId];

    return true;

  }

  clear() {

    this._projects = {};

    return true;

  }

  count() {

    return Object.keys(this._projects).length;

  }

  keys() {

    return Object.keys(this._projects);

  }

  //=========================================================================
  // Workflow
  //=========================================================================

  approve(projectId) {

    if (!this.exists(projectId)) {

      return false;

    }

    this._projects[projectId].status = "Approved";

    return true;

  }

  start(projectId) {

    if (!this.exists(projectId)) {

      return false;

    }

    this._projects[projectId].status = "In Progress";

    return true;

  }

  complete(projectId) {

    if (!this.exists(projectId)) {

      return false;

    }

    this._projects[projectId].status = "Completed";

    this._projects[projectId].progress = 100;

    return true;

  }

  reopen(projectId) {

    if (!this.exists(projectId)) {

      return false;

    }

    this._projects[projectId].status = "Draft";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getDraft() {

    return this.filter(project =>
      project.status === "Draft"
    );

  }

  getApproved() {

    return this.filter(project =>
      project.status === "Approved"
    );

  }

  getInProgress() {

    return this.filter(project =>
      project.status === "In Progress"
    );

  }

  getCompleted() {

    return this.filter(project =>
      project.status === "Completed"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._projects).forEach(id => {

      if (callback(this._projects[id])) {

        results[id] = this._projects[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      projects: this.count(),

      draft: Object.keys(this.getDraft()).length,

      approved: Object.keys(this.getApproved()).length,

      inProgress: Object.keys(this.getInProgress()).length,

      completed: Object.keys(this.getCompleted()).length

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

      projects: this.getAll(),

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
  "Projects",
  "ProjectManager",
  new ProjectsProjectManager()
);