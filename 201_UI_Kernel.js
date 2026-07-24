/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 201_UI_Kernel.gs
 * Layer       : Presentation
 * Component   : UI Kernel
 * Version     : 2.0.0
 * Description : Presentation Layer Bootstrapper
 * =============================================================================
 */

'use strict';

class UIKernel {

  constructor() {

    this._initialized = false;

    this._running = false;

    this._bootTime = null;

    this._version = "2.0.0";

  }

  //=========================================================================
  // Boot
  //=========================================================================

  boot() {

    if (this._initialized) {

      return this;

    }

    Logger.info("========== UI Boot Started ==========");

    this._bootTime = new Date();

    this.initializeConfiguration();

    this.initializeTheme();

    this.initializeAssets();

    this.initializeTemplates();

    this.initializeComponents();

    this.initializeLayouts();

    this.initializeRouter();

    this.initializePages();

    this.initializeRuntime();

    this._initialized = true;

    Logger.info("========== UI Boot Completed ==========");

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

    WEF.UI.Runtime.running = true;

    Logger.info("========== UI Started ==========");

    return this;

  }

  stop() {

    this._running = false;

    WEF.UI.Runtime.running = false;

    Logger.info("========== UI Stopped ==========");

    return this;

  }

  restart() {

    this.stop();

    this.start();

    Logger.info("========== UI Restarted ==========");

    return this;

  }

  //=========================================================================
  // Initialization Pipeline
  //=========================================================================

  initializeConfiguration() {

    Logger.info("Loading UI Configuration");

    return this;

  }

  initializeTheme() {

    Logger.info("Loading UI Theme");

    return this;

  }

  initializeAssets() {

    Logger.info("Loading UI Assets");

    return this;

  }

  initializeTemplates() {

    Logger.info("Loading HTML Templates");

    return this;

  }

  initializeComponents() {

    Logger.info("Loading UI Components");

    return this;

  }

  initializeLayouts() {

    Logger.info("Loading Layout Engine");

    return this;

  }

  initializeRouter() {

    Logger.info("Loading Router");

    return this;

  }

  initializePages() {

    Logger.info("Loading Pages");

    return this;

  }

  initializeRuntime() {

    Logger.info("Initializing Runtime");

    WEF.UI.Runtime.version = this._version;

    WEF.UI.Runtime.bootTime = this._bootTime;

    WEF.UI.Runtime.running = false;

    WEF.UI.Runtime.ready = true;

    return this;

  }

  //=========================================================================
  // Information
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

  status() {

    return {

      initialized: this.isInitialized(),

      running: this.isRunning(),

      version: this.version(),

      bootTime: this.bootTime()

    };

  }

  info() {

    return {

      name: "Workspace ERP UI Kernel",

      layer: "Presentation",

      version: this.version(),

      initialized: this.isInitialized(),

      running: this.isRunning(),

      bootTime: this.bootTime(),

      runtime: WEF.UI.Runtime

    };

  }

}

/*==============================================================================
  UI Kernel Registration
==============================================================================*/

WEF.UI.Core.Kernel = new UIKernel();