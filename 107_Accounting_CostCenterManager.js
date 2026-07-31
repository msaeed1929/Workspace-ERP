/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 107_Accounting_CostCenterManager.gs
 * Module      : Accounting
 * Class       : AccountingCostCenterManager
 * Version     : 1.0.0
 * Description : Cost Center Management Service
 * =============================================================================
 */

'use strict';

class AccountingCostCenterManager extends BaseService {

  constructor() {

    super("AccountingCostCenterManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._costCenters = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(costCenterId, data) {

    if (this.exists(costCenterId)) {

      return false;

    }

    this._costCenters[costCenterId] = Object.assign({

      name: "",

      department: "",

      manager: "",

      budget: 0,

      status: "Draft"

    }, data || {});

    return true;

  }

  update(costCenterId, data) {

    if (!this.exists(costCenterId)) {

      return false;

    }

    Object.assign(

      this._costCenters[costCenterId],

      data || {}

    );

    return true;

  }

  get(costCenterId) {

    return this._costCenters[costCenterId] || null;

  }

  getAll() {

    return this._costCenters;

  }

  exists(costCenterId) {

    return this._costCenters.hasOwnProperty(costCenterId);

  }

  remove(costCenterId) {

    if (!this.exists(costCenterId)) {

      return false;

    }

    delete this._costCenters[costCenterId];

    return true;

  }

  clear() {

    this._costCenters = {};

    return true;

  }

  count() {

    return Object.keys(this._costCenters).length;

  }

  keys() {

    return Object.keys(this._costCenters);

  }

  //=========================================================================
  // Workflow
  //=========================================================================

  approve(costCenterId) {

    if (!this.exists(costCenterId)) {

      return false;

    }

    this._costCenters[costCenterId].status = "Approved";

    return true;

  }

  activate(costCenterId) {

    if (!this.exists(costCenterId)) {

      return false;

    }

    this._costCenters[costCenterId].status = "Active";

    return true;

  }

  deactivate(costCenterId) {

    if (!this.exists(costCenterId)) {

      return false;

    }

    this._costCenters[costCenterId].status = "Inactive";

    return true;

  }

  reopen(costCenterId) {

    if (!this.exists(costCenterId)) {

      return false;

    }

    this._costCenters[costCenterId].status = "Draft";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getDraft() {

    return this.filter(costCenter =>
      costCenter.status === "Draft"
    );

  }

  getApproved() {

    return this.filter(costCenter =>
      costCenter.status === "Approved"
    );

  }

  getActive() {

    return this.filter(costCenter =>
      costCenter.status === "Active"
    );

  }

  getInactive() {

    return this.filter(costCenter =>
      costCenter.status === "Inactive"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._costCenters).forEach(id => {

      if (callback(this._costCenters[id])) {

        results[id] = this._costCenters[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      costCenters: this.count(),

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

      costCenters: this.getAll(),

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

function registerAccountingCostCenterManager() {
function bootAccountingCostCenterManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "Accounting",
      "CostCenterManager",
      new AccountingCostCenterManager()
    );
  }
}
}