/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 138_FixedAssets_DepreciationManager.gs
 * Module      : Fixed Assets
 * Class       : FixedAssetsDepreciationManager
 * Version     : 1.0.0
 * Description : Fixed Asset Depreciation Management Service
 * =============================================================================
 */

'use strict';

class FixedAssetsDepreciationManager extends BaseService {

  constructor() {

    super("FixedAssetsDepreciationManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._depreciation = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(scheduleId, data) {

    if (this.exists(scheduleId)) {

      return false;

    }

    this._depreciation[scheduleId] = Object.assign({

      assetId: "",

      depreciationMethod: "Straight Line",

      depreciationDate: "",

      purchaseCost: 0,

      salvageValue: 0,

      usefulLife: 0,

      depreciationAmount: 0,

      accumulatedDepreciation: 0,

      bookValue: 0,

      status: "Draft"

    }, data || {});

    return true;

  }

  update(scheduleId, data) {

    if (!this.exists(scheduleId)) {

      return false;

    }

    Object.assign(

      this._depreciation[scheduleId],

      data || {}

    );

    return true;

  }

  get(scheduleId) {

    return this._depreciation[scheduleId] || null;

  }

  getAll() {

    return this._depreciation;

  }

  exists(scheduleId) {

    return this._depreciation.hasOwnProperty(scheduleId);

  }

  remove(scheduleId) {

    if (!this.exists(scheduleId)) {

      return false;

    }

    delete this._depreciation[scheduleId];

    return true;

  }

  clear() {

    this._depreciation = {};

    return true;

  }

  count() {

    return Object.keys(this._depreciation).length;

  }

  keys() {

    return Object.keys(this._depreciation);

  }

  //=========================================================================
  // Workflow
  //=========================================================================

  approve(scheduleId) {

    if (!this.exists(scheduleId)) {

      return false;

    }

    this._depreciation[scheduleId].status = "Approved";

    return true;

  }

  post(scheduleId) {

    if (!this.exists(scheduleId)) {

      return false;

    }

    this._depreciation[scheduleId].status = "Posted";

    return true;

  }

  reverse(scheduleId) {

    if (!this.exists(scheduleId)) {

      return false;

    }

    this._depreciation[scheduleId].status = "Reversed";

    return true;

  }

  reopen(scheduleId) {

    if (!this.exists(scheduleId)) {

      return false;

    }

    this._depreciation[scheduleId].status = "Draft";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getDraft() {

    return this.filter(item =>
      item.status === "Draft"
    );

  }

  getApproved() {

    return this.filter(item =>
      item.status === "Approved"
    );

  }

  getPosted() {

    return this.filter(item =>
      item.status === "Posted"
    );

  }

  getReversed() {

    return this.filter(item =>
      item.status === "Reversed"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._depreciation).forEach(id => {

      if (callback(this._depreciation[id])) {

        results[id] = this._depreciation[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      depreciationSchedules: this.count(),

      draft: Object.keys(this.getDraft()).length,

      approved: Object.keys(this.getApproved()).length,

      posted: Object.keys(this.getPosted()).length,

      reversed: Object.keys(this.getReversed()).length

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

      depreciation: this.getAll(),

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
  "FixedAssets",
  "DepreciationManager",
  new FixedAssetsDepreciationManager()
);