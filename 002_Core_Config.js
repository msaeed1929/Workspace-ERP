/**
 * ============================================================================
 * Workspace ERP Framework (WEF)
 * ----------------------------------------------------------------------------
 * File        : 002_Core_Config.gs
 * Version     : 3.2.0
 * Author      : OpenAI + Muhammad Saeed Anser
 * Description : Global Configuration Manager
 * ============================================================================
 */

const ERPConfig = Object.freeze({

  /* -------------------------------------------------------------------------
   * Application
   * ---------------------------------------------------------------------- */

  APP_NAME: WEF_FRAMEWORK.NAME,

  APP_CODE: "WEF",

  VERSION: WEF_FRAMEWORK.VERSION,

  FRAMEWORK_VERSION: WEF_FRAMEWORK.VERSION,

  BUILD: WEF_FRAMEWORK.BUILD,

  RELEASE_DATE: WEF_FRAMEWORK.RELEASE_DATE,

  RELEASE_CHANNEL: WEF_FRAMEWORK.RELEASE_CHANNEL,

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

  CACHE_PREFIX: "WEF",

  CACHE_COMPRESS: false,

  LOCK_TIMEOUT: 30000,

  LOCK_WAIT: 5000,

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

  ENABLE_DEBUG_TOAST: true,

  ENABLE_SQL_LOG: false,

  ENABLE_API_LOG: true,

  ENABLE_PERFORMANCE_LOG: true,


  /* -------------------------------------------------------------------------
   * System
   * ---------------------------------------------------------------------- */

  SYSTEM_VERSION: WEF_FRAMEWORK.VERSION,

  DATABASE_VERSION: "3.2.0",

  SCHEMA_VERSION: "3.2.0",

  DEFAULT_LANGUAGE: "EN",

  DEFAULT_CURRENCY: "USD",

  DEFAULT_COUNTRY: "Pakistan",


  /* -------------------------------------------------------------------------
   * Hidden Sheets
   * ---------------------------------------------------------------------- */

  SYSTEM_SHEETS: Object.freeze([

    "_System",

    "_Schema",

    "_Migration",

    "_Logs",

    "_Audit",

    "_Cache",

    "_Lookup"

  ]),


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

function getFrameworkVersion() {
  return ERPConfig.FRAMEWORK_VERSION;
}

function getReleaseChannel() {
  return ERPConfig.RELEASE_CHANNEL;
}

function getReleaseDate() {
  return ERPConfig.RELEASE_DATE;
}

function isDebug() {
  return ERPConfig.DEBUG;
}

function isLoggingEnabled() {
  return ERPConfig.ENABLE_LOGGING;
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

  Logger.log("===== CONFIG =====");

  Logger.log(getERPName());

  Logger.log(getERPVersion());

  Logger.log(getFrameworkVersion());

  Logger.log(getERPBuild());

  Logger.log(getEnvironment());

  Logger.log(getReleaseChannel());

  Logger.log(getReleaseDate());

  Logger.log(isDevelopment());

  Logger.log(isProduction());

  Logger.log(isDebug());

  Logger.log(ERPConfig);

}