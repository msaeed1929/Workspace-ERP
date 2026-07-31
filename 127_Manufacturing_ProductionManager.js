/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 127_Manufacturing_ProductionManager.gs
 * Module      : Manufacturing
 * Class       : ManufacturingProductionManager
 * Version     : 1.0.0
 * Description : Manufacturing Production Management Service
 * =============================================================================
 */

'use strict';

class ManufacturingProductionManager extends BaseService {

  constructor() {

    super("ManufacturingProductionManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._productions = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(productionId, data) {

    if (this.exists(productionId)) {

      return false;

    }

    this._productions[productionId] = Object.assign({

      workOrderId: "",

      productCode: "",

      productName: "",

      productionDate: "",

      plannedQuantity: 0,

      producedQuantity: 0,

      rejectedQuantity: 0,

      status: "Draft"

    }, data || {});

    return true;

  }

  update(productionId, data) {

    if (!this.exists(productionId)) {

      return false;

    }

    Object.assign(

      this._productions[productionId],

      data || {}

    );

    return true;

  }

  get(productionId) {

    return this._productions[productionId] || null;

  }

  getAll() {

    return this._productions;

  }

  exists(productionId) {

    return this._productions.hasOwnProperty(productionId);

  }

  remove(productionId) {

    if (!this.exists(productionId)) {

      return false;

    }

    delete this._productions[productionId];

    return true;

  }

  clear() {

    this._productions = {};

    return true;

  }

  count() {

    return Object.keys(this._productions).length;

  }

  keys() {

    return Object.keys(this._productions);

  }

  //=========================================================================
  // Workflow
  //=========================================================================

  approve(productionId) {

    if (!this.exists(productionId)) {

      return false;

    }

    this._productions[productionId].status = "Approved";

    return true;

  }

  start(productionId) {

    if (!this.exists(productionId)) {

      return false;

    }

    this._productions[productionId].status = "In Progress";

    return true;

  }

  complete(productionId) {

    if (!this.exists(productionId)) {

      return false;

    }

    this._productions[productionId].status = "Completed";

    return true;

  }

  reopen(productionId) {

    if (!this.exists(productionId)) {

      return false;

    }

    this._productions[productionId].status = "Draft";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getDraft() {

    return this.filter(production =>
      production.status === "Draft"
    );

  }

  getApproved() {

    return this.filter(production =>
      production.status === "Approved"
    );

  }

  getInProgress() {

    return this.filter(production =>
      production.status === "In Progress"
    );

  }

  getCompleted() {

    return this.filter(production =>
      production.status === "Completed"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._productions).forEach(id => {

      if (callback(this._productions[id])) {

        results[id] = this._productions[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      productions: this.count(),

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

      productions: this.getAll(),

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

function registerManufacturingProductionManager() {
  WEF.ServiceContainer.registerModuleService(
    "Manufacturing",
    "ProductionManager",
    new ManufacturingProductionManager()
  );
}