/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 125_Manufacturing_BOMManager.gs
 * Module      : Manufacturing
 * Class       : ManufacturingBOMManager
 * Version     : 1.0.0
 * Description : Bill of Materials (BOM) Management Service
 * =============================================================================
 */

'use strict';

class ManufacturingBOMManager extends BaseService {

  constructor() {

    super("ManufacturingBOMManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._boms = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(bomId, data) {

    if (this.exists(bomId)) {

      return false;

    }

    this._boms[bomId] = Object.assign({

      productCode: "",

      productName: "",

      version: "1.0",

      components: [],

      quantity: 1,

      unit: "PCS",

      status: "Draft"

    }, data || {});

    return true;

  }

  update(bomId, data) {

    if (!this.exists(bomId)) {

      return false;

    }

    Object.assign(

      this._boms[bomId],

      data || {}

    );

    return true;

  }

  get(bomId) {

    return this._boms[bomId] || null;

  }

  getAll() {

    return this._boms;

  }

  exists(bomId) {

    return this._boms.hasOwnProperty(bomId);

  }

  remove(bomId) {

    if (!this.exists(bomId)) {

      return false;

    }

    delete this._boms[bomId];

    return true;

  }

  clear() {

    this._boms = {};

    return true;

  }

  count() {

    return Object.keys(this._boms).length;

  }

  keys() {

    return Object.keys(this._boms);

  }

  //=========================================================================
  // Workflow
  //=========================================================================

  approve(bomId) {

    if (!this.exists(bomId)) {

      return false;

    }

    this._boms[bomId].status = "Approved";

    return true;

  }

  activate(bomId) {

    if (!this.exists(bomId)) {

      return false;

    }

    this._boms[bomId].status = "Active";

    return true;

  }

  deactivate(bomId) {

    if (!this.exists(bomId)) {

      return false;

    }

    this._boms[bomId].status = "Inactive";

    return true;

  }

  reopen(bomId) {

    if (!this.exists(bomId)) {

      return false;

    }

    this._boms[bomId].status = "Draft";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getDraft() {

    return this.filter(bom =>
      bom.status === "Draft"
    );

  }

  getApproved() {

    return this.filter(bom =>
      bom.status === "Approved"
    );

  }

  getActive() {

    return this.filter(bom =>
      bom.status === "Active"
    );

  }

  getInactive() {

    return this.filter(bom =>
      bom.status === "Inactive"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._boms).forEach(id => {

      if (callback(this._boms[id])) {

        results[id] = this._boms[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      boms: this.count(),

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

      boms: this.getAll(),

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

function registerManufacturingBOMManager() {
function bootManufacturingBOMManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "Manufacturing",
      "BOMManager",
      new ManufacturingBOMManager()
    );
  }
}
}