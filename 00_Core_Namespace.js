/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * -----------------------------------------------------------------------------
 * File        : 00_Core_Namespace.gs
 * Version     : 1.0.0
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
  name: "Workspace ERP Framework",
  shortName: "WEF",
  version: "1.0.0",
  build: "2026.06.29.001"
};

/**
 * ============================================================================
 * Core Containers
 * ============================================================================
 */
WEF.Config = {};
WEF.Constants = {};
WEF.Environment = {};
WEF.Utilities = {};
WEF.Schema = {};
WEF.Database = {};
WEF.Logger = {};
WEF.Validator = {};
WEF.Cache = {};
WEF.Security = {};
WEF.Settings = {};
WEF.Sequence = {};
WEF.Audit = {};
WEF.Permission = {};
WEF.Workflow = {};
WEF.Notification = {};
WEF.Email = {};
WEF.PDF = {};
WEF.Drive = {};
WEF.Backup = {};
WEF.Reports = {};
WEF.Dashboard = {};
WEF.API = {};
WEF.Modules = {};

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

    delete WEF.Services[name];

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

  WEF.Runtime.Name =
    WEF.Runtime.Spreadsheet.getName();

  WEF.Initialized = true;

}

/**
 * =============================================================================
 * TEST
 * =============================================================================
 */
function test_Namespace() {

  initializeWEF();

  Logger.log(WEF.Info);

  Logger.log(WEF.Runtime);

  Logger.log(WEF.Initialized);

}