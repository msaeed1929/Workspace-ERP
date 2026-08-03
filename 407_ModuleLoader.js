/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 407_ModuleLoader.gs
 * Layer       : Web Application
 * Component   : Module Loader
 * Version     : 3.1.0
 * Description : Centralized HTML module loader for Workspace ERP.
 *               Responsible for routing, rendering and caching UI modules.
 * =============================================================================
 */

'use strict';

/*==============================================================================
    Module Loader
==============================================================================*/

class WEFModuleLoader {

  constructor() {

    this.initialize();

  }

  /*==========================================================================
      Initialize
  ==========================================================================*/

  initialize() {

    this._initialized = false;

    this._version =

      WEF_FRAMEWORK.VERSION;

    this._cache = {};

    this._currentModule = null;

    this._history = [];

    return this;

  }

  /*==========================================================================
      Boot
  ==========================================================================*/

  boot() {

    if (this._initialized) {

      return this;

    }

    Logger.info(
      "========== MODULE LOADER BOOT =========="
    );

    this._initialized = true;

    Logger.info(
      "========== MODULE LOADER READY =========="
    );

    return this;

  }

  /*==========================================================================
      Load Module
  ==========================================================================*/

  load(moduleName) {

    this.boot();

    if (!moduleName) {

      moduleName = "Dashboard";

    }

    Logger.info(
      "Loading Module : " + moduleName
    );

    this._currentModule = moduleName;

    this._history.push({

        module : moduleName,

        time : new Date()

    });

    if(this._history.length > 100){

        this._history.shift();

    }

    return this.render(moduleName);

  }

  /*==========================================================================
      Render Module
  ==========================================================================*/

  render(moduleName) {

    if (this.isCached(moduleName)) {

      Logger.info(
        "Module Cache Hit : " + moduleName
      );

      return this._cache[moduleName].html;

    }

    Logger.info(
      "Rendering Module : " + moduleName
    );

    let html;

    try{

        html = HtmlService

            .createHtmlOutputFromFile(

                moduleName

            )

            .getContent();

    }

    catch(error){

        Logger.error(

            "Module not found : " +

            moduleName

        );

        html =

            HtmlService

              .createHtmlOutput(

                  "<div class='module-error'>" +

                  "<h2>Module Not Found</h2>" +

                  "<p>" +

                  moduleName +

                  "</p>" +

                  "</div>"

              )

              .getContent();

    }

    if(html){

        this.cache(

            moduleName,

            html

        );

    }

    return html;

  }

  /*==========================================================================
      Cache Module
  ==========================================================================*/

  cache(moduleName, html) {

    this._cache[moduleName] = {

      html : html,

      cached : new Date()

    };

    Logger.info(

      "Module Cached : " + moduleName

    );

    return this;

  }

  /*==========================================================================
      Cache Exists
  ==========================================================================*/

  isCached(moduleName) {

    return Object.prototype.hasOwnProperty.call(

        this._cache,

        moduleName

    );

  }

  /*==========================================================================
      Get Cached Module
  ==========================================================================*/

  getCache(moduleName) {

    return this._cache[moduleName]

      ? this._cache[moduleName].html

      : null;

  }

  /*==========================================================================
      Clear Cache
  ==========================================================================*/

  clearCache(moduleName) {

    if (moduleName) {

      delete this._cache[moduleName];

      Logger.info(

        "Cache Cleared : " + moduleName

      );

    } else {

      this._cache = {};

      Logger.info(

        "All Module Cache Cleared"

      );

    }

    return this;

  }

  /*==========================================================================
      Cache Count
  ==========================================================================*/

  cacheCount() {

    return Object.keys(

      this._cache

    ).length;

  }

  cacheInformation(){

    return this._cache;

  }

  /*==========================================================================
      Current Module
  ==========================================================================*/

  currentModule() {

    return this._currentModule;

  }

  /*==========================================================================
      Module History
  ==========================================================================*/

  history() {

    return this._history.slice();

  }

  /*==========================================================================
      Status
  ==========================================================================*/

  status() {

    return {

      initialized :

        this._initialized,

      version :

        this._version,

      currentModule :

        this._currentModule,

      cacheEnabled :

       true,

      cachedModules :

        this.cacheCount(),

      historyCount :

        this._history.length

    };

  }

  /*==========================================================================
      Information
  ==========================================================================*/

  info() {

    return {

      name :

        "Workspace ERP Module Loader",

      layer :

        "Web Application",

      version :

        this._version,

      status :

        this.status()

    };

  }

  /*==========================================================================
      Reset
  ==========================================================================*/

  reset() {

    this.clearCache();

    this._currentModule = null;

    this._history = [];

    Logger.info(

      "========== MODULE LOADER RESET =========="

    );

    return this;

  }

}

/*==============================================================================
    Framework Registration
==============================================================================*/

WEF.ModuleLoader =

    new WEFModuleLoader();

/*==============================================================================
    Public API
==============================================================================*/

/**
 * Loads an HTML module.
 */
function loadModule(moduleName) {

  return WEF.ModuleLoader.load(

    moduleName

  );

}

/**
 * Returns cached HTML module.
 */
function getCachedModule(moduleName) {

  return WEF.ModuleLoader.getCache(

    moduleName

  );

}

function moduleCacheInformation(){

    return WEF.ModuleLoader

        .cacheInformation();

}

/**
 * Clears module cache.
 */
function clearModuleCache(moduleName) {

  return WEF.ModuleLoader.clearCache(

    moduleName

  );

}

/**
 * Returns loader status.
 */
function moduleLoaderStatus() {

  return WEF.ModuleLoader.status();

}

/**
 * Returns loader information.
 */
function moduleLoaderInfo() {

  return WEF.ModuleLoader.info();

}

/**
 * Returns current module.
 */
function currentModule() {

  return WEF.ModuleLoader.currentModule();

}

/**
 * Returns module history.
 */
function moduleHistory() {

  return WEF.ModuleLoader.history();

}

/**
 * Resets the module loader.
 */
function resetModuleLoader() {

  return WEF.ModuleLoader.reset();

}