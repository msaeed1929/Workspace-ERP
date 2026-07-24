/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 300_Login.gs
 * Layer       : ERP Application
 * Component   : Login Application
 * Version     : 1.0.0
 * Description : Main application entry point responsible for authentication,
 *               company selection, session initialization and launching the
 *               Workspace ERP.
 * =============================================================================
 */

'use strict';

class ERPLogin {

  constructor() {

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    this._initialized = false;

    this._authenticated = false;

    this._currentUser = null;

    this._currentCompany = null;

    this._loginTime = null;

    this._version = "1.0.0";

    this._applicationName = "Workspace ERP";

    this._rememberMe = false;

    this._language = "en";

    this._theme = "default";

    return this;

  }

  //=========================================================================
  // Application Boot
  //=========================================================================

  boot() {

    Logger.info("========== ERP Login Boot Started ==========");

    this.loadConfiguration();

    this.loadEnvironment();

    this.loadTheme();

    this.loadLanguage();

    this.loadCompanies();

    this.prepareSession();

    this._initialized = true;

    Logger.info("========== ERP Login Ready ==========");

    return this;

  }

  //=========================================================================
  // Startup Components
  //=========================================================================

  loadConfiguration() {

    Logger.info("Loading Login Configuration");

    return this;

  }

  loadEnvironment() {

    Logger.info("Loading Environment");

    return this;

  }

  loadTheme() {

    Logger.info("Loading Theme");

    return this;

  }

  loadLanguage() {

    Logger.info("Loading Language");

    return this;

  }

  loadCompanies() {

    Logger.info("Loading Companies");

    return this;

  }

  prepareSession() {

    Logger.info("Preparing Session");

    return this;

  }

  //=========================================================================
  // Company Selection
  //=========================================================================

  selectCompany(companyCode) {

    this._currentCompany = companyCode;

    Logger.info("Company Selected : " + companyCode);

    return this;

  }

  company() {

    return this._currentCompany;

  }

  //=========================================================================
  // Login Settings
  //=========================================================================

  rememberMe(enable) {

    this._rememberMe = !!enable;

    return this;

  }

  language(code) {

    if (arguments.length === 0) {

      return this._language;

    }

    this._language = code;

    return this;

  }

  theme(name) {

    if (arguments.length === 0) {

      return this._theme;

    }

    this._theme = name;

    return this;

  }

  //=========================================================================
  // Runtime Information
  //=========================================================================

  isInitialized() {

    return this._initialized;

  }

  isAuthenticated() {

    return this._authenticated;

  }

  applicationName() {

    return this._applicationName;

  }

  version() {

    return this._version;

  }

  loginTime() {

    return this._loginTime;

  }

  //=========================================================================
  // Authentication
  //=========================================================================

  login(username, password) {

    Logger.info("========== ERP Login ==========");

    if (!username || !password) {

      Logger.error("Username or password is missing.");

      return false;

    }

    //-------------------------------------------------------------------------
    // Framework Authentication
    // Replace with WEF.Authentication.authenticate() in production.
    //-------------------------------------------------------------------------

    this._authenticated = true;

    this._currentUser = username;

    this._loginTime = new Date();

    Logger.info("User Authenticated : " + username);

    Logger.info("Company : " + (this._currentCompany || "Default"));

    Logger.info("Login Time : " + this._loginTime);

    Logger.info("========== Login Successful ==========");

    return true;

  }

  logout() {

    Logger.info("========== ERP Logout ==========");

    this._authenticated = false;

    this._currentUser = null;

    this._loginTime = null;

    Logger.info("Session Closed");

    Logger.info("========== Logout Completed ==========");

    return this;

  }

  //=========================================================================
  // User Information
  //=========================================================================

  currentUser() {

    return this._currentUser;

  }

  //=========================================================================
  // Home Application
  //=========================================================================

  openHomeDashboard() {

    if (!this.isAuthenticated()) {

      Logger.warning("User is not authenticated.");

      return false;

    }

    Logger.info("Opening Home Dashboard...");

    return true;

  }

  //=========================================================================
  // Information
  //=========================================================================

  runtime() {

    return {

      initialized: this.isInitialized(),

      authenticated: this.isAuthenticated(),

      application: this.applicationName(),

      version: this.version(),

      currentUser: this.currentUser(),

      company: this.company(),

      loginTime: this.loginTime(),

      language: this.language(),

      theme: this.theme()

    };

  }

  info() {

    return {

      name: "Workspace ERP Login",

      layer: "ERP Application",

      version: this.version(),

      initialized: this.isInitialized(),

      authenticated: this.isAuthenticated(),

      runtime: this.runtime()

    };

  }

  //=========================================================================
  // Reset
  //=========================================================================

  reset() {

    this.initialize();

    Logger.info("========== Login Reset ==========");

    return this;

  }

}

/*==============================================================================
  Module Registration
==============================================================================*/

WEF.App = WEF.App || {};

WEF.App.Login = new ERPLogin();