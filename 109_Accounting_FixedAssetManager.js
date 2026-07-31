/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 109_Accounting_FixedAssetManager.gs
 * Module      : Accounting
 * Class       : AccountingFixedAssetManager
 * Version     : 1.0.0
 * Description : Fixed Asset Management Service
 * =============================================================================
 */

'use strict';

class AccountingFixedAssetManager extends BaseService {

  constructor() {

    super("AccountingFixedAssetManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._assets = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(assetId, data) {

    if (this.exists(assetId)) {

      return false;

    }

    this._assets[assetId] = Object.assign({

      name: "",

      category: "",

      purchaseDate: "",

      cost: 0,

      status: "Draft"

    }, data || {});

    return true;

  }

  update(assetId, data) {

    if (!this.exists(assetId)) {

      return false;

    }

    Object.assign(

      this._assets[assetId],

      data || {}

    );

    return true;

  }

  get(assetId) {

    return this._assets[assetId] || null;

  }

  getAll() {

    return this._assets;

  }

  exists(assetId) {

    return this._assets.hasOwnProperty(assetId);

  }

  remove(assetId) {

    if (!this.exists(assetId)) {

      return false;

    }

    delete this._assets[assetId];

    return true;

  }

  clear() {

    this._assets = {};

    return true;

  }

  count() {

    return Object.keys(this._assets).length;

  }

  keys() {

    return Object.keys(this._assets);

  }

  //=========================================================================
  // Workflow
  //=========================================================================

  approve(assetId) {

    if (!this.exists(assetId)) {

      return false;

    }

    this._assets[assetId].status = "Approved";

    return true;

  }

  activate(assetId) {

    if (!this.exists(assetId)) {

      return false;

    }

    this._assets[assetId].status = "Active";

    return true;

  }

  dispose(assetId) {

    if (!this.exists(assetId)) {

      return false;

    }

    this._assets[assetId].status = "Disposed";

    return true;

  }

  reopen(assetId) {

    if (!this.exists(assetId)) {

      return false;

    }

    this._assets[assetId].status = "Draft";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getDraft() {

    return this.filter(asset =>
      asset.status === "Draft"
    );

  }

  getApproved() {

    return this.filter(asset =>
      asset.status === "Approved"
    );

  }

  getActive() {

    return this.filter(asset =>
      asset.status === "Active"
    );

  }

  getDisposed() {

    return this.filter(asset =>
      asset.status === "Disposed"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._assets).forEach(id => {

      if (callback(this._assets[id])) {

        results[id] = this._assets[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      assets: this.count(),

      draft: Object.keys(this.getDraft()).length,

      approved: Object.keys(this.getApproved()).length,

      active: Object.keys(this.getActive()).length,

      disposed: Object.keys(this.getDisposed()).length

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

      assets: this.getAll(),

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

function registerAccountingFixedAssetManager() {
function bootAccountingFixedAssetManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "Accounting",
      "FixedAssetManager",
      new AccountingFixedAssetManager()
    );
  }
}
}