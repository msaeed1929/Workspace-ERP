/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 001_Core_Kernel.gs
 * Version     : 3.2.0
 * Description : Application Kernel
 * Author      : OpenAI + Muhammad Saeed Anser
 * =============================================================================
 */

'use strict';

/**
 * =============================================================================
 * WEF Kernel
 * =============================================================================
 */
WEF.Kernel = class {

  /**
   * ---------------------------------------------------------------------------
   * Boot Framework
   * ---------------------------------------------------------------------------
   */
  static boot() {

    if (WEF.Initialized) {
      return;
    }

    Logger.log("========== WEF Boot Started ==========");

    WEF.Runtime.Initialized = false;

    this.loadRuntime();

    this.loadConfiguration();

    this.loadEnvironment();

    this.registerCoreServices();
    
    this.registerFrameworkServices();

    WEF.Runtime.BootCompleted = new Date();

    WEF.Initialized = true;

    Logger.log("========== WEF Ready ==========");

  }

  /**
   * ---------------------------------------------------------------------------
   * Load Runtime
   * ---------------------------------------------------------------------------
   */
  static loadRuntime() {

    WEF.Runtime.StartTime = new Date();

    WEF.Runtime.TimeZone = Session.getScriptTimeZone();

    WEF.Runtime.User = Session.getActiveUser().getEmail();

    WEF.Runtime.Locale = Session.getActiveUserLocale();

    WEF.Runtime.Spreadsheet =
      SpreadsheetApp.getActiveSpreadsheet();

    WEF.Runtime.SpreadsheetId =
      WEF.Runtime.Spreadsheet.getId();

    WEF.Runtime.SpreadsheetName =
      WEF.Runtime.Spreadsheet.getName();

  }

  /**
   * ---------------------------------------------------------------------------
   * Load Configuration
   * ---------------------------------------------------------------------------
   */
  static loadConfiguration(){

    if(typeof ERPConfig==="undefined")
      throw new Error("ERPConfig not found.");

    WEF.Config.get=function(key){
      return ERPConfig[key];
    };

    WEF.Config.has=function(key){
      return Object.prototype.hasOwnProperty.call(ERPConfig,key);
    };

    WEF.Config.all=function(){
      return Object.assign({},ERPConfig);
    };

    WEF.Config.keys=function(){
      return Object.keys(ERPConfig);
    };

    WEF.Config.values=function(){
      return Object.values(ERPConfig);
    };

    WEF.Config.count=function(){
      return Object.keys(ERPConfig).length;
    };

    WEF.Config.environment=function(){
      return ERPConfig.ENVIRONMENT;
    };

    WEF.Config.version = function () {
      return ERPConfig.FRAMEWORK_VERSION || ERPConfig.VERSION;
    };

    WEF.Config.build = function () {
      return ERPConfig.BUILD;
    };

    WEF.Config.appName=function(){
      return ERPConfig.APP_NAME;
    };

  }

  /**
   * ---------------------------------------------------------------------------
   * Load Environment
   * ---------------------------------------------------------------------------
   */
  static loadEnvironment() {

    WEF.Runtime.frameworkVersion = WEF.Info.version;

    WEF.Runtime.frameworkBuild = WEF.Info.build;

    WEF.Runtime.environment =
      WEF.Config.environment();

    WEF.Runtime.spreadsheetId = WEF.Runtime.SpreadsheetId;

    WEF.Runtime.spreadsheetName =
      WEF.Runtime.SpreadsheetName;

    WEF.Runtime.user = WEF.Runtime.User;

    WEF.Runtime.timezone = WEF.Runtime.TimeZone;

    WEF.Runtime.locale = WEF.Runtime.Locale;

    WEF.Runtime.Initialized = true;

  }

  /**
   * ---------------------------------------------------------------------------
   * Register Core Services
   * ---------------------------------------------------------------------------
   */
  static registerCoreServices() {

    if (!WEF.ServiceRegistry.has("Kernel")) {

      WEF.ServiceRegistry.register(
          "Kernel",
          WEF.Kernel
      );

    }

    if (typeof registerValidatorService === "function") {
      registerValidatorService();
    }

  }

  /**
   * ===========================================================================
   * Register Framework Services
   * ===========================================================================
   */
  static registerFrameworkServices() {

    // ERP
    if (typeof registerERPServices === "function") {
      registerERPServices();
    }

    // CRM
    if (typeof registerCRMServices === "function") {
      registerCRMServices();
    }

    // Sales
    if (typeof registerSalesServices === "function") {
      registerSalesServices();
    }

    // Purchase
    if (typeof registerPurchaseServices === "function") {
      registerPurchaseServices();
    }

    // Inventory
    if (typeof registerInventoryServices === "function") {
      registerInventoryServices();
    }

    // Accounting
    if (typeof registerAccountingServices === "function") {
      registerAccountingServices();
    }

    // HR
    if (typeof registerHRServices === "function") {
      registerHRServices();
    }

    // Manufacturing
    if (typeof registerManufacturingServices === "function") {
      registerManufacturingServices();
    }

    // Projects
    if (typeof registerProjectServices === "function") {
      registerProjectServices();
    }

  }

  /**
   * ---------------------------------------------------------------------------
   * Shutdown Framework
   * ---------------------------------------------------------------------------
   */
  static shutdown() {

    Logger.log("========== WEF Shutdown ==========");

    WEF.Initialized = false;

    WEF.Runtime.Initialized = false;

    WEF.Runtime.BootCompleted = null;

  }

  /**
   * ---------------------------------------------------------------------------
   * Framework Status
   * ---------------------------------------------------------------------------
   */
  static status() {

    return {

      initialized : WEF.Initialized,

      version : WEF.Info.version,

      build : WEF.Info.build,

      spreadsheet : WEF.Runtime.SpreadsheetName,

      user : WEF.Runtime.User,

      startTime : WEF.Runtime.StartTime,

      bootCompleted : WEF.Runtime.BootCompleted

    };

  }

  /**
   * ---------------------------------------------------------------------------
   * Health Check
   * ---------------------------------------------------------------------------
   */
  static health() {

    return {

      Namespace : typeof WEF !== "undefined",

      Config : typeof ERPConfig !== "undefined",

      Runtime : !!WEF.Runtime.Initialized,

      Spreadsheet : !!WEF.Runtime.Spreadsheet,

      Initialized : WEF.Initialized

    };

  }

  /**
   * ---------------------------------------------------------------------------
   * Version
   * ---------------------------------------------------------------------------
   */
  static version() {

    return WEF.Info.version;

  }

  /**
   * Build
   */
  static build() {

      return WEF.Info.build;

  }

  /**
   * Initialized
   */
  static initialized() {

      return WEF.Initialized;

  }

  /**
   * Uptime
   */
  static uptime() {

      if (!WEF.Runtime.StartTime) {
          return 0;
      }

      return Date.now() - WEF.Runtime.StartTime.getTime();

  }

};

/**
 * =============================================================================
 * TEST
 * =============================================================================
 */

function test_ConfigAPI(){

  WEF.Kernel.boot();

  Logger.log(WEF.Config.get("APP_NAME"));
  Logger.log(WEF.Config.version());
  Logger.log(WEF.Config.build());
  Logger.log(WEF.Config.environment());
  Logger.log(WEF.Config.has("LOCK_TIMEOUT"));
  Logger.log(WEF.Config.count());
  Logger.log(WEF.Config.keys());
  Logger.log(WEF.Config.all());

}