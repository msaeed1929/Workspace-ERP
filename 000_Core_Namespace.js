/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * -----------------------------------------------------------------------------
 * File        : 000_Core_Namespace.gs
 * Version     : 3.2.0
 * Author      : OpenAI + Muhammad Saeed Anser
 * Description : Root Namespace & Service Container
 * =============================================================================
 */

'use strict';

/**
 * Root Namespace
 */
const WEF = Object.create(null);

/**
 * ============================================================================
 * Framework Information
 * ============================================================================
 */
WEF.Info = {
  name: WEF_NAME,
  shortName: WEF_API_VERSION,
  version: WEF_VERSION,
  build: WEF_BUILD,
  releaseDate: WEF_RELEASE_DATE,
  channel: WEF_RELEASE_CHANNEL,
  copyright: WEF_COPYRIGHT
};

Object.freeze(WEF.Info);

/**
 * ============================================================================
 * Core Containers
 * ============================================================================
 */
WEF.Config = Object.create(null);
WEF.Constants = Object.create(null);
WEF.Environment = Object.create(null);
WEF.Utilities = Object.create(null);
WEF.Schema = Object.create(null);
WEF.Database = Object.create(null);
WEF.Logger = Object.create(null);
WEF.Validator = Object.create(null);
WEF.Cache = Object.create(null);
WEF.Security = Object.create(null);
WEF.Settings = Object.create(null);
WEF.Sequence = Object.create(null);
WEF.Audit = Object.create(null);
WEF.Permission = Object.create(null);
WEF.Workflow = Object.create(null);
WEF.Notification = Object.create(null);
WEF.Email = Object.create(null);
WEF.PDF = Object.create(null);
WEF.Drive = Object.create(null);
WEF.Backup = Object.create(null);
WEF.Reports = Object.create(null);
WEF.Dashboard = Object.create(null);
WEF.API = Object.create(null);
WEF.Modules = Object.create(null);

//=============================================================================
// Business Modules
//=============================================================================

WEF.Modules.CRM = Object.create(null);
WEF.Modules.Sales = Object.create(null);
WEF.Modules.Purchase = Object.create(null);
WEF.Modules.Inventory = Object.create(null);
WEF.Modules.Finance = Object.create(null);
WEF.Modules.HR = Object.create(null);
WEF.Modules.Payroll = Object.create(null);
WEF.Modules.Manufacturing = Object.create(null);
WEF.Modules.Projects = Object.create(null);
WEF.Modules.Assets = Object.create(null);

/**
 * ============================================================================
 * Registered Services
 * ============================================================================
 */
WEF.Services = Object.create(null);

/**
 * ============================================================================
 * Runtime Storage
 * ============================================================================
 */
WEF.Runtime = Object.create(null);

/**
 * ============================================================================
 * Global Events
 * ============================================================================
 */
WEF.Events = Object.create(null);

/**
 * ============================================================================
 * Hooks
 * ============================================================================
 */
WEF.Hooks = Object.create(null);

/**
 * ============================================================================
 * Plugin Registry
 * ============================================================================
 */
WEF.Plugins = Object.create(null);

/**
 * ============================================================================
 * Module Registry
 * ============================================================================
 */
WEF.ModuleRegistry = Object.create(null);

/**
 * ============================================================================
 * Internal Metadata
 * ============================================================================
 */
WEF.Metadata = Object.create(null);

/**
 * ============================================================================
 * Framework Ready Flag
 * ============================================================================
 */
WEF.Initialized = false;

/**
 * =============================================================================
 * Service Registry
 * =============================================================================
 */
WEF.ServiceRegistry = class {

  /**
   * Register Service
   */
  static register(name, instance) {

    if (!name)
      throw new Error("Service name is required.");

    if (WEF.Services[name]) {

      throw new Error(
        "Service '" + name + "' is already registered."
      );

    }

    WEF.Services[name] = instance;

    return instance;

  }

  /**
   * Get Service
   */
  static get(name) {

    if (!WEF.Services[name]) {

      throw new Error(
        "Service '" + name + "' is not registered."
      );

    }

    return WEF.Services[name];

  }

  /**
   * Check Service
   */
  static has(name) {

    return Object.prototype.hasOwnProperty.call(
      WEF.Services,
      name
    );

  }

  /**
   * Remove Service
   */
  static remove(name) {

    if (this.has(name)) {
      delete WEF.Services[name];
    }

  }

  /**
   * Remove All Services
   */
  static clear() {

    Object.keys(WEF.Services).forEach(function(name){

      delete WEF.Services[name];

    });

  }

  /**
   * List Services
   */
  static list() {

    return Object.keys(WEF.Services);

  }

};

/**
 * ============================================================================
 * Module Registry
 * ============================================================================
 */

WEF.ModuleRegistry = {

  modules: Object.create(null),

  register(name, service) {

    this.modules[name] = service;

    return service;

  },

  get(name) {

    return this.modules[name] || null;

  },

  has(name) {

    return Object.prototype.hasOwnProperty.call(
      this.modules,
      name
    );

  },

  all() {

    return Object.assign({}, this.modules);

  },

  clear() {

    this.modules = Object.create(null);

  }

};

/**
 * =============================================================================
 * Initialize Framework
 * =============================================================================
 */
function initializeWEF() {

  if (WEF.Initialized) {

    return;

  }

  WEF.Runtime.StartTime = new Date();

  WEF.Runtime.User = Session.getActiveUser().getEmail();

  WEF.Runtime.TimeZone = Session.getScriptTimeZone();

  WEF.Runtime.Spreadsheet =
    SpreadsheetApp.getActiveSpreadsheet();

  WEF.Runtime.SpreadsheetId =
    WEF.Runtime.Spreadsheet.getId();

  WEF.Runtime.SpreadsheetName =
    WEF.Runtime.Spreadsheet.getName();

  WEF.Initialized = true;

  WEF.Runtime.Initialized = true;

}

/**
 * =============================================================================
 * TEST
 * =============================================================================
 */
function test_CoreNamespace() {

  initializeWEF();

  Logger.log(WEF.Info);

  Logger.log(WEF.Runtime);

  Logger.log(WEF.Initialized);

}