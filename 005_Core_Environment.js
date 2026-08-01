/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * -----------------------------------------------------------------------------
 * File        : 005_Core_Environment.gs
 * Version     : 3.2.0
 * Description : Framework Environment Manager
 * Author      : OpenAI + Muhammad Saeed Anser
 * =============================================================================
 */

'use strict';

WEF.Environment = new (class {

  constructor() {

    this._initialized = false;

    this.refresh();

  }

  /**
   * ---------------------------------------------------------------------------
   * Refresh Runtime Information
   * ---------------------------------------------------------------------------
   */
  refresh() {

    this._spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    this._spreadsheetId = this._spreadsheet.getId();

    this._spreadsheetName = this._spreadsheet.getName();

    this._timezone = Session.getScriptTimeZone();

    this._locale = Session.getActiveUserLocale();

    this._user = Session.getActiveUser().getEmail();

    this._scriptProperties =
      PropertiesService.getScriptProperties();

    this._userProperties =
      PropertiesService.getUserProperties();

    this._documentProperties =
      PropertiesService.getDocumentProperties();

    this._cache =
      CacheService.getScriptCache();

    this._lock =
      LockService.getScriptLock();

    this._startTime = new Date();

    this._lastRefresh = new Date();

    this._initialized = true;

    // ---------------------------------------------------------------------------
    // Synchronize Runtime
    // ---------------------------------------------------------------------------

    WEF.Runtime.environment = WEF.Config.environment();

    WEF.Runtime.user = this._user;

    WEF.Runtime.locale = this._locale;

    WEF.Runtime.timezone = this._timezone;

    WEF.Runtime.spreadsheet = this._spreadsheet;

    WEF.Runtime.spreadsheetId = this._spreadsheetId;

    WEF.Runtime.spreadsheetName = this._spreadsheetName;

  }

  getLastRefresh(){

    return this._lastRefresh;

}

  //==========================================================================
  // Spreadsheet
  //==========================================================================

  getSpreadsheet() {

    return this._spreadsheet;

  }

  getSpreadsheetId() {

    return this._spreadsheetId;

  }

  getSpreadsheetName() {

    return this._spreadsheetName;

  }

  //==========================================================================
  // User
  //==========================================================================

  getUser() {

    return this._user;

  }

  getLocale() {

    return this._locale;

  }

  getTimeZone() {

    return this._timezone;

  }

  //==========================================================================
  // Runtime
  //==========================================================================

  getStartTime() {

    return this._startTime;

  }

  isInitialized() {

    return this._initialized;

  }

  getEnvironment(){

    return WEF.Config.environment();

  }

  isDevelopment(){

    return WEF.Config.environment() ===

      WEF.Constants.Environment.DEVELOPMENT;

  }

  isProduction(){

    return WEF.Config.environment() ===

      WEF.Constants.Environment.PRODUCTION;

  }

  //==========================================================================
  // Script Properties
  //==========================================================================

  getProperty(key) {

    return this._scriptProperties.getProperty(key);

  }

  setProperty(key, value) {

    this._scriptProperties.setProperty(key, value);

  }

  deleteProperty(key) {

    this._scriptProperties.deleteProperty(key);

  }

  clearProperties() {

    this._scriptProperties.deleteAllProperties();

  }

  getAllProperties() {

    return this._scriptProperties.getProperties();

  }

  //==========================================================================
  // User Properties
  //==========================================================================

  getUserProperty(key) {

    return this._userProperties.getProperty(key);

  }

  setUserProperty(key, value) {

    this._userProperties.setProperty(key, value);

  }

  deleteUserProperty(key) {

    this._userProperties.deleteProperty(key);

  }

  getAllUserProperties() {

    return this._userProperties.getProperties();

  }

  //==========================================================================
  // Document Properties
  //==========================================================================

  getDocumentProperty(key) {

    return this._documentProperties.getProperty(key);

  }

  setDocumentProperty(key, value) {

    this._documentProperties.setProperty(key, value);

  }

  deleteDocumentProperty(key) {

    this._documentProperties.deleteProperty(key);

  }

  getAllDocumentProperties() {

    return this._documentProperties.getProperties();

  }

  //==========================================================================
  // Cache
  //==========================================================================

  getCache() {

    return this._cache;

  }

  putCache(key,value,seconds){

      this._cache.put(

          key,

          value,

          seconds ||

          WEF.Config.get("CACHE_SECONDS")

      );

  }

  getCacheValue(key){

    return this._cache.get(key);

  }

  removeCache(key){

    this._cache.remove(key);

  }

  clearCache() {

    this._cache.removeAll([]);

  }

  //==========================================================================
  // Lock
  //==========================================================================

  getLock() {

    return this._lock;

  }

  waitLock(timeout){

      this._lock.waitLock(

          timeout ||

          WEF.Config.get("LOCK_TIMEOUT")

      );

  }

  releaseLock(){

    this._lock.releaseLock();

  }

  tryLock(timeout){

    return this._lock.tryLock(

      timeout ||

      WEF.Config.get("LOCK_TIMEOUT")

    );

  }

  //==========================================================================
  // Information
  //==========================================================================

  info() {

    return {

      framework: WEF.Info.name,

      frameworkVersion: WEF.Info.version,

      frameworkBuild: WEF.Info.build,

      releaseChannel: WEF.Info.channel,

      releaseDate: WEF.Info.releaseDate,

      environment: WEF.Config.environment(),

      user: this._user,

      locale: this._locale,

      timezone: this._timezone,

      spreadsheetId: this._spreadsheetId,

      spreadsheetName: this._spreadsheetName,

      started: this._startTime,

      initialized: this._initialized

    };

  }

  health(){

      return {

          initialized: this._initialized,

          spreadsheet: !!this._spreadsheet,

          user: !!this._user,

          cache: !!this._cache,

          lock: !!this._lock

      };

    }
})();

/**
 * =============================================================================
 * TEST
 * =============================================================================
 */

function test_Environment() {

  Logger.log(WEF.Environment.getUser());

  Logger.log(WEF.Environment.getSpreadsheetName());

  Logger.log(WEF.Environment.getSpreadsheetId());

  Logger.log(WEF.Environment.getLocale());

  Logger.log(WEF.Environment.getTimeZone());

  Logger.log(WEF.Environment.info());

  Logger.log(WEF.Environment.isInitialized());

  Logger.log(WEF.Environment.getAllProperties());

  Logger.log(WEF.Environment.getEnvironment());

  Logger.log(WEF.Environment.isDevelopment());

  Logger.log(WEF.Environment.health());

  Logger.log(WEF.Environment.getLastRefresh());

}