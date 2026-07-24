/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 220_UI_FrameworkManager.gs
 * Layer       : Presentation
 * Component   : UI Framework Manager
 * Version     : 1.0.0
 * Description : Master coordinator for the Presentation Layer. Initializes,
 *               starts, stops and manages all UI managers.
 * =============================================================================
 */

'use strict';

class UIFrameworkManager {

  constructor() {

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    this._initialized = false;

    this._running = false;

    this._bootTime = null;

    this._version = "1.0.0";

    this._managers = {

      config: WEF.UI.Core.Config,

      router: WEF.UI.Core.Router,

      templateEngine: WEF.UI.Core.TemplateEngine,

      assetManager: WEF.UI.Core.AssetManager,

      themeManager: WEF.UI.Core.ThemeManager,

      componentManager: WEF.UI.Core.ComponentManager,

      layoutManager: WEF.UI.Core.LayoutManager,

      menuManager: WEF.UI.Core.MenuManager,

      navigationManager: WEF.UI.Core.NavigationManager,

      formManager: WEF.UI.Core.FormManager,

      tableManager: WEF.UI.Core.TableManager,

      dashboardManager: WEF.UI.Core.DashboardManager,

      reportViewerManager: WEF.UI.Core.ReportViewerManager,

      chartManager: WEF.UI.Core.ChartManager,

      notificationManager: WEF.UI.Core.NotificationManager,

      dialogManager: WEF.UI.Core.DialogManager,

      sidebarManager: WEF.UI.Core.SidebarManager,

      htmlTemplateManager: WEF.UI.Core.HTMLTemplateManager

    };

    return this;

  }

  //=========================================================================
  // Boot
  //=========================================================================

  boot() {

    Logger.info("========== UI Framework Boot Started ==========");

    this._bootTime = new Date();

    Object.keys(this._managers).forEach(key => {

      const manager = this._managers[key];

      if (manager &&
          typeof manager.initialize === "function") {

        manager.initialize();

      }

    });

    this._initialized = true;

    Logger.info("========== UI Framework Boot Completed ==========");

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

    Logger.info("========== UI Framework Started ==========");

    return this;

  }

  stop() {

    this._running = false;

    Logger.info("========== UI Framework Stopped ==========");

    return this;

  }

  restart() {

    this.stop();

    this.start();

    Logger.info("========== UI Framework Restarted ==========");

    return this;

  }

  //=========================================================================
  // Runtime State
  //=========================================================================

  isInitialized() {

    return this._initialized;

  }

  isRunning() {

    return this._running;

  }

  version() {

    return this._version;

  }

  bootTime() {

    return this._bootTime;

  }

  //=========================================================================
  // Manager Access
  //=========================================================================

  managers() {

    return this._managers;

  }

  manager(name) {

    return this._managers[name] || null;

  }

  //=========================================================================
  // Runtime Information
  //=========================================================================

  runtime() {

    return {

      initialized: this.isInitialized(),

      running: this.isRunning(),

      version: this.version(),

      bootTime: this.bootTime()

    };

  }

  info() {

    return {

      name: "Workspace ERP UI Framework",

      layer: "Presentation",

      version: this.version(),

      initialized: this.isInitialized(),

      running: this.isRunning(),

      bootTime: this.bootTime(),

      managers: Object.keys(this._managers).length,

      runtime: this.runtime()

    };

  }

  //=========================================================================
  // Reset
  //=========================================================================

  reset() {

    this.stop();

    this.initialize();

    Logger.info("========== UI Framework Reset ==========");

    return this;

  }

}

/*==============================================================================
  Module Registration
==============================================================================*/

WEF.UI.Framework = new UIFrameworkManager();