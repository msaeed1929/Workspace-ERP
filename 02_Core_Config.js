/**
 * ============================================================================
 * Workspace ERP Framework (WEF)
 * ----------------------------------------------------------------------------
 * File        : 02_Core_Config.gs
 * Version     : 1.0.0
 * Author      : OpenAI + Muhammad Saeed Anser
 * Description : Global Configuration Manager
 * ============================================================================
 */

const ERPConfig = Object.freeze({

  /* -------------------------------------------------------------------------
   * Application
   * ---------------------------------------------------------------------- */

  APP_NAME: "Workspace ERP",

  APP_CODE: "WEF",

  VERSION: "1.0.0",

  FRAMEWORK_VERSION: "1.0.0",

  BUILD: "2026.06.29.001",

  ENVIRONMENT: "DEVELOPMENT", // DEVELOPMENT | TESTING | PRODUCTION


  /* -------------------------------------------------------------------------
   * Spreadsheet
   * ---------------------------------------------------------------------- */

  SPREADSHEET_ID: SpreadsheetApp.getActiveSpreadsheet().getId(),

  TIMEZONE: Session.getScriptTimeZone(),

  DATE_FORMAT: "dd/MM/yyyy",

  DATETIME_FORMAT: "dd/MM/yyyy HH:mm:ss",


  /* -------------------------------------------------------------------------
   * Cache
   * ---------------------------------------------------------------------- */

  CACHE_SECONDS: 300,

  LOCK_TIMEOUT: 30000,

  MAX_BATCH_SIZE: 500,

  MAX_RETRY: 3,


  /* -------------------------------------------------------------------------
   * Security
   * ---------------------------------------------------------------------- */

  ENABLE_AUDIT: true,

  ENABLE_LOGGING: true,

  ENABLE_CACHE: true,

  ENABLE_BACKUP: true,

  ENABLE_EMAIL_NOTIFICATIONS: true,

  DEBUG: true,

  LOG_LEVEL: "INFO",


  /* -------------------------------------------------------------------------
   * System
   * ---------------------------------------------------------------------- */

  SYSTEM_VERSION: "1.0.0",

  DATABASE_VERSION: "1.0.0",

  SCHEMA_VERSION: "1.0.0",

  FRAMEWORK_VERSION:"1.0.0",

  DEFAULT_LANGUAGE: "EN",

  DEFAULT_CURRENCY: "USD",

  DEFAULT_COUNTRY: "Pakistan",


  /* -------------------------------------------------------------------------
   * Hidden Sheets
   * ---------------------------------------------------------------------- */

  SYSTEM_SHEETS: [

    "_System",

    "_Schema",

    "_Migration",

    "_Logs",

    "_Audit",

    "_Cache",

    "_Lookup"

  ],


  /* -------------------------------------------------------------------------
   * Sheet Colors
   * ---------------------------------------------------------------------- */

  COLORS: Object.freeze({

    HEADER:"#0B5394",

    HEADER_FONT:"#FFFFFF",

    SUCCESS:"#D9EAD3",

    WARNING:"#FFF2CC",

    ERROR:"#F4CCCC",

    INFO:"#D0E0E3"

  }),


  /* -------------------------------------------------------------------------
   * Default Sequence Length
   * ---------------------------------------------------------------------- */

  DEFAULT_SEQUENCE_DIGITS: 6,


  /* -------------------------------------------------------------------------
   * Default Administrator
   * ---------------------------------------------------------------------- */

  ADMIN: Object.freeze({

    NAME:"Administrator",

    EMAIL: Session.getActiveUser().getEmail(),

    ROLE:"Administrator"

  })

});

/**
 * Returns current ERP Version
 *
 * @returns {string}
 */
function getERPVersion() {

  return ERPConfig.VERSION;

}

/**
 * Returns current Build Number
 *
 * @returns {string}
 */
function getERPBuild() {

  return ERPConfig.BUILD;

}

/**
 * Returns Application Name
 *
 * @returns {string}
 */
function getERPName() {

  return ERPConfig.APP_NAME;

}

/**
 * Returns Environment
 *
 * @returns {string}
 */
function getEnvironment() {

  return ERPConfig.ENVIRONMENT;

}

/**
 * Is Development Mode
 *
 * @returns {boolean}
 */
function isDevelopment() {

  return ERPConfig.ENVIRONMENT === "DEVELOPMENT";

}

/**
 * Is Production Mode
 *
 * @returns {boolean}
 */
function isProduction() {

  return ERPConfig.ENVIRONMENT === "PRODUCTION";

}

/**
 * ============================================================================
 * TEST
 * ============================================================================
 */

function test_Config() {

  Logger.log(ERPConfig);

  Logger.log(getERPVersion());

  Logger.log(getERPBuild());

  Logger.log(getERPName());

  Logger.log(getEnvironment());

}