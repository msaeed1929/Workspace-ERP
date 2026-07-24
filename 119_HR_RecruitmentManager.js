/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 119_HR_RecruitmentManager.gs
 * Module      : Human Resources (HR)
 * Class       : HRRecruitmentManager
 * Version     : 1.0.0
 * Description : Recruitment Management Service
 * =============================================================================
 */

'use strict';

class HRRecruitmentManager extends BaseService {

  constructor() {

    super("HRRecruitmentManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._recruitments = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(recruitmentId, data) {

    if (this.exists(recruitmentId)) {

      return false;

    }

    this._recruitments[recruitmentId] = Object.assign({

      candidateName: "",

      position: "",

      department: "",

      interviewDate: "",

      recruiter: "",

      status: "Draft"

    }, data || {});

    return true;

  }

  update(recruitmentId, data) {

    if (!this.exists(recruitmentId)) {

      return false;

    }

    Object.assign(

      this._recruitments[recruitmentId],

      data || {}

    );

    return true;

  }

  get(recruitmentId) {

    return this._recruitments[recruitmentId] || null;

  }

  getAll() {

    return this._recruitments;

  }

  exists(recruitmentId) {

    return this._recruitments.hasOwnProperty(recruitmentId);

  }

  remove(recruitmentId) {

    if (!this.exists(recruitmentId)) {

      return false;

    }

    delete this._recruitments[recruitmentId];

    return true;

  }

  clear() {

    this._recruitments = {};

    return true;

  }

  count() {

    return Object.keys(this._recruitments).length;

  }

  keys() {

    return Object.keys(this._recruitments);

  }

  //=========================================================================
  // Workflow
  //=========================================================================

  approve(recruitmentId) {

    if (!this.exists(recruitmentId)) {

      return false;

    }

    this._recruitments[recruitmentId].status = "Approved";

    return true;

  }

  shortlist(recruitmentId) {

    if (!this.exists(recruitmentId)) {

      return false;

    }

    this._recruitments[recruitmentId].status = "Shortlisted";

    return true;

  }

  hire(recruitmentId) {

    if (!this.exists(recruitmentId)) {

      return false;

    }

    this._recruitments[recruitmentId].status = "Hired";

    return true;

  }

  reject(recruitmentId) {

    if (!this.exists(recruitmentId)) {

      return false;

    }

    this._recruitments[recruitmentId].status = "Rejected";

    return true;

  }

  reopen(recruitmentId) {

    if (!this.exists(recruitmentId)) {

      return false;

    }

    this._recruitments[recruitmentId].status = "Draft";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getDraft() {

    return this.filter(recruitment =>
      recruitment.status === "Draft"
    );

  }

  getApproved() {

    return this.filter(recruitment =>
      recruitment.status === "Approved"
    );

  }

  getShortlisted() {

    return this.filter(recruitment =>
      recruitment.status === "Shortlisted"
    );

  }

  getHired() {

    return this.filter(recruitment =>
      recruitment.status === "Hired"
    );

  }

  getRejected() {

    return this.filter(recruitment =>
      recruitment.status === "Rejected"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._recruitments).forEach(id => {

      if (callback(this._recruitments[id])) {

        results[id] = this._recruitments[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      recruitments: this.count(),

      draft: Object.keys(this.getDraft()).length,

      approved: Object.keys(this.getApproved()).length,

      shortlisted: Object.keys(this.getShortlisted()).length,

      hired: Object.keys(this.getHired()).length,

      rejected: Object.keys(this.getRejected()).length

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

      recruitments: this.getAll(),

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
  "HR",
  "RecruitmentManager",
  new HRRecruitmentManager()
);