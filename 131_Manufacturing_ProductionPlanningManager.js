/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 131_Manufacturing_ProductionPlanningManager.gs
 * Module      : Manufacturing
 * Class       : ManufacturingProductionPlanningManager
 * Version     : 1.0.0
 * Description : Manufacturing Production Planning Management Service
 * =============================================================================
 */

'use strict';

class ManufacturingProductionPlanningManager extends BaseService {

  constructor() {

    super("ManufacturingProductionPlanningManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._productionPlans = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(planId, data) {

    if (this.exists(planId)) {

      return false;

    }

    this._productionPlans[planId] = Object.assign({

      planNo: "",

      productCode: "",

      productName: "",

      plannedQuantity: 0,

      startDate: "",

      endDate: "",

      workCenter: "",

      planner: "",

      remarks: "",

      status: "Draft"

    }, data || {});

    return true;

  }

  update(planId, data) {

    if (!this.exists(planId)) {

      return false;

    }

    Object.assign(

      this._productionPlans[planId],

      data || {}

    );

    return true;

  }

  get(planId) {

    return this._productionPlans[planId] || null;

  }

  getAll() {

    return this._productionPlans;

  }

  exists(planId) {

    return this._productionPlans.hasOwnProperty(planId);

  }

  remove(planId) {

    if (!this.exists(planId)) {

      return false;

    }

    delete this._productionPlans[planId];

    return true;

  }

  clear() {

    this._productionPlans = {};

    return true;

  }

  count() {

    return Object.keys(this._productionPlans).length;

  }

  keys() {

    return Object.keys(this._productionPlans);

  }

  //=========================================================================
  // Workflow
  //=========================================================================

  approve(planId) {

    if (!this.exists(planId)) {

      return false;

    }

    this._productionPlans[planId].status = "Approved";

    return true;

  }

  release(planId) {

    if (!this.exists(planId)) {

      return false;

    }

    this._productionPlans[planId].status = "Released";

    return true;

  }

  complete(planId) {

    if (!this.exists(planId)) {

      return false;

    }

    this._productionPlans[planId].status = "Completed";

    return true;

  }

  reopen(planId) {

    if (!this.exists(planId)) {

      return false;

    }

    this._productionPlans[planId].status = "Draft";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getDraft() {

    return this.filter(plan =>
      plan.status === "Draft"
    );

  }

  getApproved() {

    return this.filter(plan =>
      plan.status === "Approved"
    );

  }

  getReleased() {

    return this.filter(plan =>
      plan.status === "Released"
    );

  }

  getCompleted() {

    return this.filter(plan =>
      plan.status === "Completed"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._productionPlans).forEach(id => {

      if (callback(this._productionPlans[id])) {

        results[id] = this._productionPlans[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      productionPlans: this.count(),

      draft: Object.keys(this.getDraft()).length,

      approved: Object.keys(this.getApproved()).length,

      released: Object.keys(this.getReleased()).length,

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

      productionPlans: this.getAll(),

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
function bootManufacturingProductionPlanningManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "Manufacturing",
      "ProductionPlanningManager",
      new ManufacturingProductionPlanningManager()
    );
  }
}