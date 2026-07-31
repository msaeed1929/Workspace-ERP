/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 121_HR_SalaryStructureManager.gs
 * Module      : Human Resources (HR)
 * Class       : HRSalaryStructureManager
 * Version     : 1.0.0
 * Description : Salary Structure Management Service
 * =============================================================================
 */

'use strict';

class HRSalaryStructureManager extends BaseService {

  constructor() {

    super("HRSalaryStructureManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._salaryStructures = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(structureId, data) {

    if (this.exists(structureId)) {

      return false;

    }

    this._salaryStructures[structureId] = Object.assign({

      designation: "",

      basicSalary: 0,

      houseAllowance: 0,

      medicalAllowance: 0,

      transportAllowance: 0,

      otherAllowance: 0,

      grossSalary: 0,

      status: "Draft"

    }, data || {});

    return true;

  }

  update(structureId, data) {

    if (!this.exists(structureId)) {

      return false;

    }

    Object.assign(

      this._salaryStructures[structureId],

      data || {}

    );

    return true;

  }

  get(structureId) {

    return this._salaryStructures[structureId] || null;

  }

  getAll() {

    return this._salaryStructures;

  }

  exists(structureId) {

    return this._salaryStructures.hasOwnProperty(structureId);

  }

  remove(structureId) {

    if (!this.exists(structureId)) {

      return false;

    }

    delete this._salaryStructures[structureId];

    return true;

  }

  clear() {

    this._salaryStructures = {};

    return true;

  }

  count() {

    return Object.keys(this._salaryStructures).length;

  }

  keys() {

    return Object.keys(this._salaryStructures);

  }

  //=========================================================================
  // Workflow
  //=========================================================================

  approve(structureId) {

    if (!this.exists(structureId)) {

      return false;

    }

    this._salaryStructures[structureId].status = "Approved";

    return true;

  }

  activate(structureId) {

    if (!this.exists(structureId)) {

      return false;

    }

    this._salaryStructures[structureId].status = "Active";

    return true;

  }

  deactivate(structureId) {

    if (!this.exists(structureId)) {

      return false;

    }

    this._salaryStructures[structureId].status = "Inactive";

    return true;

  }

  reopen(structureId) {

    if (!this.exists(structureId)) {

      return false;

    }

    this._salaryStructures[structureId].status = "Draft";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getDraft() {

    return this.filter(structure =>
      structure.status === "Draft"
    );

  }

  getApproved() {

    return this.filter(structure =>
      structure.status === "Approved"
    );

  }

  getActive() {

    return this.filter(structure =>
      structure.status === "Active"
    );

  }

  getInactive() {

    return this.filter(structure =>
      structure.status === "Inactive"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._salaryStructures).forEach(id => {

      if (callback(this._salaryStructures[id])) {

        results[id] = this._salaryStructures[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      structures: this.count(),

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

      salaryStructures: this.getAll(),

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

function registerHRSalaryStructureManager() {
  WEF.ServiceContainer.registerModuleService(
    "HR",
    "SalaryStructureManager",
    new HRSalaryStructureManager()
  );
}