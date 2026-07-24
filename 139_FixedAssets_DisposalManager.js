/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 139_FixedAssets_DisposalManager.gs
 * Module      : Fixed Assets
 * Class       : FixedAssetsDisposalManager
 * Version     : 1.0.0
 * Description : Fixed Asset Disposal Management Service
 * =============================================================================
 */

'use strict';

class FixedAssetsDisposalManager extends BaseService {

  constructor() {

    super("FixedAssetsDisposalManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._disposals = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(disposalId, data) {

    if (this.exists(disposalId)) {

      return false;

    }

    this._disposals[disposalId] = Object.assign({

      assetId: "",

      disposalDate: "",

      disposalMethod: "",

      disposalReason: "",

      saleAmount: 0,

      bookValue: 0,

      gainLoss: 0,

      approvedBy: "",

      remarks: "",

      status: "Draft"

    }, data || {});

    return true;

  }

  update(disposalId, data) {

    if (!this.exists(disposalId)) {

      return false;

    }

    Object.assign(

      this._disposals[disposalId],

      data || {}

    );

    return true;

  }

  get(disposalId) {

    return this._disposals[disposalId] || null;

  }

  getAll() {

    return this._disposals;

  }

  exists(disposalId) {

    return this._disposals.hasOwnProperty(disposalId);

  }

  remove(disposalId) {

    if (!this.exists(disposalId)) {

      return false;

    }

    delete this._disposals[disposalId];

    return true;

  }

  clear() {

    this._disposals = {};

    return true;

  }

  count() {

    return Object.keys(this._disposals).length;

  }

  keys() {

    return Object.keys(this._disposals);

  }

  //=========================================================================
  // Workflow
  //=========================================================================

  approve(disposalId) {

    if (!this.exists(disposalId)) {

      return false;

    }

    this._disposals[disposalId].status = "Approved";

    return true;

  }

  complete(disposalId) {

    if (!this.exists(disposalId)) {

      return false;

    }

    this._disposals[disposalId].status = "Completed";

    return true;

  }

  cancel(disposalId) {

    if (!this.exists(disposalId)) {

      return false;

    }

    this._disposals[disposalId].status = "Cancelled";

    return true;

  }

  reopen(disposalId) {

    if (!this.exists(disposalId)) {

      return false;

    }

    this._disposals[disposalId].status = "Draft";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getDraft() {

    return this.filter(disposal =>
      disposal.status === "Draft"
    );

  }

  getApproved() {

    return this.filter(disposal =>
      disposal.status === "Approved"
    );

  }

  getCompleted() {

    return this.filter(disposal =>
      disposal.status === "Completed"
    );

  }

  getCancelled() {

    return this.filter(disposal =>
      disposal.status === "Cancelled"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._disposals).forEach(id => {

      if (callback(this._disposals[id])) {

        results[id] = this._disposals[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      disposals: this.count(),

      draft: Object.keys(this.getDraft()).length,

      approved: Object.keys(this.getApproved()).length,

      completed: Object.keys(this.getCompleted()).length,

      cancelled: Object.keys(this.getCancelled()).length

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

      disposals: this.getAll(),

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
  "DisposalManager",
  new FixedAssetsDisposalManager()
);