/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 301_HomeDashboard.gs
 * Layer       : ERP Application
 * Component   : Home Dashboard
 * Version     : 1.0.0
 * Description : Main ERP landing page. Displays KPIs, widgets, notifications,
 *               shortcuts and navigation after successful login.
 * =============================================================================
 */

'use strict';

class ERPHomeDashboard {

  constructor() {

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    this._initialized = false;

    this._running = false;

    this._dashboardName = "Workspace ERP Dashboard";

    this._version = "1.0.0";

    this._widgets = [];

    this._shortcuts = [];

    this._notifications = [];

    this._kpis = {};

    this._bootTime = null;

    return this;

  }

  //=========================================================================
  // Dashboard Boot
  //=========================================================================

  boot() {

    Logger.info("========== Home Dashboard Boot Started ==========");

    this.loadWidgets();

    this.loadKPIs();

    this.loadShortcuts();

    this.loadNotifications();

    this.loadNavigation();

    this.loadWorkspace();

    this._bootTime = new Date();

    this._initialized = true;

    Logger.info("========== Home Dashboard Ready ==========");

    return this;

  }

  //=========================================================================
  // Dashboard Loaders
  //=========================================================================

  loadWidgets() {

    Logger.info("Loading Dashboard Widgets");

    this._widgets = [

      "Sales KPI",

      "Purchase KPI",

      "Inventory KPI",

      "Accounting KPI",

      "Notifications",

      "Calendar"

    ];

    return this;

  }

  loadKPIs() {

    Logger.info("Loading KPIs");

    this._kpis = {

      sales: 0,

      purchase: 0,

      inventory: 0,

      receivable: 0,

      payable: 0

    };

    return this;

  }

  loadShortcuts() {

    Logger.info("Loading Shortcuts");

    this._shortcuts = [

      "CRM",

      "Sales",

      "Purchase",

      "Inventory",

      "Accounting",

      "HR"

    ];

    return this;

  }

  loadNotifications() {

    Logger.info("Loading Notifications");

    this._notifications = [];

    return this;

  }

  loadNavigation() {

    Logger.info("Loading Navigation");

    return this;

  }

  loadWorkspace() {

    Logger.info("Loading Workspace");

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

    Logger.info("========== Home Dashboard Started ==========");

    return this;

  }

  stop() {

    this._running = false;

    Logger.info("========== Home Dashboard Stopped ==========");

    return this;

  }

  restart() {

    this.stop();

    this.start();

    Logger.info("========== Home Dashboard Restarted ==========");

    return this;

  }

  //=========================================================================
  // Dashboard Information
  //=========================================================================

  dashboardName() {

    return this._dashboardName;

  }

  version() {

    return this._version;

  }

  bootTime() {

    return this._bootTime;

  }

  isInitialized() {

    return this._initialized;

  }

  isRunning() {

    return this._running;

  }

  //=========================================================================
  // Dashboard Data
  //=========================================================================

  widgets() {

    return this._widgets;

  }

  shortcuts() {

    return this._shortcuts;

  }

  notifications() {

    return this._notifications;

  }

  kpis() {

    return this._kpis;

  }

  //=========================================================================
  // Dashboard Operations
  //=========================================================================

  refresh() {

    Logger.info("Refreshing Dashboard...");

    this.loadKPIs();

    this.loadNotifications();

    return this;

  }

  openModule(moduleName) {

    Logger.info("Opening Module : " + moduleName);

    return true;

  }

  //=========================================================================
  // Runtime Information
  //=========================================================================

  runtime() {

    return {

      initialized: this.isInitialized(),

      running: this.isRunning(),

      dashboard: this.dashboardName(),

      version: this.version(),

      widgets: this._widgets.length,

      shortcuts: this._shortcuts.length,

      notifications: this._notifications.length,

      bootTime: this.bootTime()

    };

  }

  info() {

    return {

      name: "Workspace ERP Home Dashboard",

      layer: "ERP Application",

      version: this.version(),

      initialized: this.isInitialized(),

      running: this.isRunning(),

      runtime: this.runtime()

    };

  }

  //=========================================================================
  // Reset
  //=========================================================================

  reset() {

    this.stop();

    this.initialize();

    Logger.info("========== Home Dashboard Reset ==========");

    return this;

  }

}

/*==============================================================================
  Module Registration
==============================================================================*/

WEF.App = WEF.App || {};

WEF.App.HomeDashboard = new ERPHomeDashboard();