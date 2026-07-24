/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 310_FixedAssets.gs
 * Layer       : ERP Application
 * Component   : Fixed Assets Workspace
 * Version     : 1.0.0
 * Description : Fixed Assets application workspace responsible for asset
 *               registration, asset categories, depreciation, transfers,
 *               maintenance, disposal and fixed asset analytics.
 * =============================================================================
 */

'use strict';

class ERPFixedAssets {

  constructor() {

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    this._initialized = false;

    this._running = false;

    this._workspaceName = "Fixed Assets Workspace";

    this._version = "1.0.0";

    this._dashboard = {};

    this._assets = [];

    this._categories = [];

    this._depreciation = [];

    this._transfers = [];

    this._maintenance = [];

    this._disposals = [];

    this._reports = [];

    this._bootTime = null;

    return this;

  }

  //=========================================================================
  // Workspace Boot
  //=========================================================================

  boot() {

    Logger.info("========== Fixed Assets Workspace Boot Started ==========");

    this.loadDashboard();

    this.loadAssets();

    this.loadCategories();

    this.loadDepreciation();

    this.loadTransfers();

    this.loadMaintenance();

    this.loadDisposals();

    this.loadReports();

    this._bootTime = new Date();

    this._initialized = true;

    Logger.info("========== Fixed Assets Workspace Ready ==========");

    return this;

  }

  //=========================================================================
  // Loaders
  //=========================================================================

  loadDashboard() {

    Logger.info("Loading Fixed Assets Dashboard");

    this._dashboard = {

      assets: 0,

      categories: 0,

      depreciation: 0,

      transfers: 0,

      maintenance: 0,

      disposals: 0

    };

    return this;

  }

  loadAssets() {

    Logger.info("Loading Assets");

    this._assets = [];

    return this;

  }

  loadCategories() {

    Logger.info("Loading Asset Categories");

    this._categories = [];

    return this;

  }

  loadDepreciation() {

    Logger.info("Loading Depreciation");

    this._depreciation = [];

    return this;

  }

  loadTransfers() {

    Logger.info("Loading Asset Transfers");

    this._transfers = [];

    return this;

  }

  loadMaintenance() {

    Logger.info("Loading Asset Maintenance");

    this._maintenance = [];

    return this;

  }

  loadDisposals() {

    Logger.info("Loading Asset Disposals");

    this._disposals = [];

    return this;

  }

  loadReports() {

    Logger.info("Loading Fixed Assets Reports");

    this._reports = [];

    return this;

  }

  //=========================================================================
  // Runtime
  //=========================================================================

  start() {

    if (!this._initialized) {

      this.boot();

    }

    this._running = true;

    Logger.info("========== Fixed Assets Workspace Started ==========");

    return this;

  }

  stop() {

    this._running = false;

    Logger.info("========== Fixed Assets Workspace Stopped ==========");

    return this;

  }

  restart() {

    this.stop();

    this.start();

    Logger.info("========== Fixed Assets Workspace Restarted ==========");

    return this;

  }

  //=========================================================================
  // Workspace Data
  //=========================================================================

  dashboard() {

    return this._dashboard;

  }

  assets() {

    return this._assets;

  }

  categories() {

    return this._categories;

  }

  depreciation() {

    return this._depreciation;

  }

  transfers() {

    return this._transfers;

  }

  maintenance() {

    return this._maintenance;

  }

  disposals() {

    return this._disposals;

  }

  reports() {

    return this._reports;

  }

  //=========================================================================
  // Navigation
  //=========================================================================

  openAssets() {

    Logger.info("Opening Assets");

    return true;

  }

  openCategories() {

    Logger.info("Opening Asset Categories");

    return true;

  }

  openDepreciation() {

    Logger.info("Opening Depreciation");

    return true;

  }

  openTransfers() {

    Logger.info("Opening Asset Transfers");

    return true;

  }

  openMaintenance() {

    Logger.info("Opening Asset Maintenance");

    return true;

  }

  openDisposals() {

    Logger.info("Opening Asset Disposals");

    return true;

  }

  openReports() {

    Logger.info("Opening Fixed Assets Reports");

    return true;

  }

  //=========================================================================
  // Workspace Operations
  //=========================================================================

  refresh() {

    Logger.info("Refreshing Fixed Assets Workspace");

    this.boot();

    return this;

  }

  //=========================================================================
  // Runtime Information
  //=========================================================================

  runtime() {

    return {

      initialized: this._initialized,

      running: this._running,

      workspace: this._workspaceName,

      version: this._version,

      assets: this._assets.length,

      categories: this._categories.length,

      depreciation: this._depreciation.length,

      transfers: this._transfers.length,

      maintenance: this._maintenance.length,

      disposals: this._disposals.length,

      reports: this._reports.length,

      bootTime: this._bootTime

    };

  }

  info() {

    return {

      name: this._workspaceName,

      layer: "ERP Application",

      version: this._version,

      runtime: this.runtime()

    };

  }

  //=========================================================================
  // Reset
  //=========================================================================

  reset() {

    this.stop();

    this.initialize();

    Logger.info("========== Fixed Assets Workspace Reset ==========");

    return this;

  }

}

/*==============================================================================
  Module Registration
==============================================================================*/

WEF.App = WEF.App || {};

WEF.App.FixedAssets = new ERPFixedAssets();