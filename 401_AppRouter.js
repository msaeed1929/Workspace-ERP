/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 401_AppRouter.gs
 * Layer       : Web Application
 * Component   : Application Router
 * Version     : 3.1.0
 * Description : Responsible for navigation between ERP modules,
 *               page loading, routing, layout switching and
 *               client-side page management.
 * =============================================================================
 */

'use strict';

class WEFAppRouter {

  constructor() {

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    this._initialized = false;

    this._version = "3.1.0";

    this._currentPage = "Dashboard";

    this._previousPage = null;

    this._defaultPage = "Dashboard";

    this._routes = {};

    this._history = [];

    return this;

  }

  //=========================================================================
  // Boot
  //=========================================================================

  boot() {

    if(this._initialized){

        return this;

    }

    Logger.info("========== APP ROUTER BOOT ==========");

    this.registerDefaultRoutes();

    this._initialized = true;

    Logger.info("========== APP ROUTER READY ==========");

    return this;

  }

  //=========================================================================
  // Route Registration
  //=========================================================================

  registerDefaultRoutes() {

    this.register("Dashboard", "406_Dashboard");

    this.register("CRM", "302_CRM");

    this.register("Sales", "303_Sales");

    this.register("Purchase", "304_Purchase");

    this.register("Inventory", "305_Inventory");

    this.register("Accounting", "306_Accounting");

    this.register("HR", "307_HR");

    this.register("Manufacturing", "308_Manufacturing");

    this.register("Projects", "309_Projects");

    this.register("FixedAssets", "310_FixedAssets");

    this.register("BI", "311_BI");

    this.register("System", "312_System");

    return this;

  }

  register(route, page) {

    if(!route || !page){

      throw new Error("Invalid Route");

    }

    Logger.info("Route Registered : " + route);

    return this;

  }

  unregister(route) {

    delete this._routes[route];

    Logger.info("Route Removed : " + route);

    return this;

  }

  has(route) {

    return route in this._routes;

  }

  routes() {

    return Object.freeze({

      ...this._routes

    });

  }

  count() {

    return Object.keys(this._routes).length;

  }

  //=========================================================================
  // Navigation
  //=========================================================================

  navigate(route) {

    if (!this.has(route)) {

      throw new Error("Unknown Route : " + route);

    }

    this._previousPage = this._currentPage;

    this._currentPage = route;

    this._history.push({

      page: route,

      timestamp: new Date()

    });

    Logger.info("Navigating -> " + route);

    if(route===this._currentPage){

      return this.resolve(route);

    }

  }

  file(route) {

    return this._routes[route];

  }

  //=========================================================================
  // Route Resolver
  //=========================================================================

  resolve(route){

      if(!this.has(route)){

          return null;

      }

      return {

          route: route,

          file: this.file(route)

      };

  }

  validate(route){

      return this.has(route);

  }

  current() {

    return this._currentPage;

  }

  previous() {

    return this._previousPage;

  }

  history() {

    return [...this._history];

  }

  defaultPage() {

    return this._defaultPage;

  }

  startupRoute(){

    return {

      route : this.defaultPage(),

      file : this.page(

          this.defaultPage()

      )

    };

  }

  //=========================================================================
  // Route Management
  //=========================================================================

  setDefault(route) {

    if (!this.has(route)) {

      throw new Error("Default route does not exist: " + route);

    }

    this._defaultPage = route;

    Logger.info("Default Route: " + route);

    return this;

  }

  home() {

    return this.navigate(this._defaultPage);

  }

  reload() {

    Logger.info("Reloading Route: " + this._currentPage);

    return this.render(this._currentPage);

  }

  //=========================================================================
  // Route Resolution
  //=========================================================================

  render(route) {

      if (!this.has(route)) {

          throw new Error("Unknown Route : " + route);

      }

      Logger.info("Routing -> " + route);

      return WEF.ModuleLoader.load(

          this.file(route)

      );

  }

  renderCurrent() {

    return this.render(this._currentPage);

  }

  //=========================================================================
  // Navigation Helpers
  //=========================================================================

  dashboard() {

    return this.navigate("Dashboard");

  }

  crm() {

    return this.navigate("CRM");

  }

  sales() {

    return this.navigate("Sales");

  }

  purchase() {

    return this.navigate("Purchase");

  }

  inventory() {

    return this.navigate("Inventory");

  }

  accounting() {

    return this.navigate("Accounting");

  }

  hr() {

    return this.navigate("HR");

  }

  manufacturing() {

    return this.navigate("Manufacturing");

  }

  projects() {

    return this.navigate("Projects");

  }

  fixedAssets() {

    return this.navigate("FixedAssets");

  }

  bi() {

    return this.navigate("BI");

  }

  system() {

    return this.navigate("System");

  }

  isCurrent(route){

    return this.current()===route;

  }

  list(){

    return Object.keys(this._routes);

  }

  version(){

    return this._version;

  }

  //=========================================================================
  // Runtime Information
  //=========================================================================

  status() {

    return {

      initialized: this._initialized,

      version: this._version,

      current: this.current(),

      previous: this.previous(),

      defaultPage: this.defaultPage(),

      routes: this.count(),

      history: this._history.length

    };

  }

  //=========================================================================
  // Utilities
  //=========================================================================

  clearHistory() {

    this._history = [];

    Logger.info("Navigation history cleared.");

    return this;

  }

  reset() {

    this._currentPage = this._defaultPage;

    this._previousPage = null;

    this.clearHistory();

    Logger.info("Router reset.");

    return this;

  }

  info() {

    return {

      name: "WEF Application Router",

      version: this._version,

      currentPage: this.current(),

      previousPage: this.previous(),

      defaultPage: this.defaultPage(),

      registeredRoutes: this.count(),

      initialized: this._initialized

    };

  }

}

/*==============================================================================
  Module Registration
==============================================================================*/

WEF.Router = new WEFAppRouter();

/*==============================================================================
  Public Router API
==============================================================================*/

/**
 * Returns the HTML content for a route.
 */
function routeTo(route) {

  if (!WEF.Router._initialized) {

    WEF.Router.boot();

  }

  return WEF.Router.render(route);

}

function availableRoutes(){

    return WEF.Router.routes();

}

/**
 * Returns router status.
 */
function routerStatus() {

  return WEF.Router.status();

}

/**
 * Returns router information.
 */
function routerInfo() {

  return WEF.Router.info();

}

/**
 * Returns router history.
 */
function routerHistory() {

  return WEF.Router.history();

}

function currentRoute(){

  return {

    route : WEF.Router.current(),

    page : WEF.Router.page(

        WEF.Router.current()

    )

  };

}