/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 203_UI_Router.gs
 * Layer       : Presentation
 * Component   : UI Router
 * Version     : 1.0.0
 * Description : Manages navigation and routing for the Presentation Layer.
 * =============================================================================
 */

'use strict';

class UIRouter {

  constructor() {

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    this._routes = {};

    this._currentRoute = null;

    this._defaultRoute = "dashboard";

    this._history = [];

    this._initialized = true;

    return this;

  }

  //=========================================================================
  // Route Registration
  //=========================================================================

  register(route, page) {

    this._routes[route] = page;

    return this;

  }

  registerMany(routes) {

    Object.keys(routes).forEach(route => {

      this.register(route, routes[route]);

    });

    return this;

  }

  //=========================================================================
  // Route Lookup
  //=========================================================================

  exists(route) {

    return this._routes.hasOwnProperty(route);

  }

  get(route) {

    return this._routes[route] || null;

  }

  getAll() {

    return this._routes;

  }

  count() {

    return Object.keys(this._routes).length;

  }

  keys() {

    return Object.keys(this._routes);

  }

  //=========================================================================
  // Default Route
  //=========================================================================

  setDefault(route) {

    this._defaultRoute = route;

    return this;

  }

  getDefault() {

    return this._defaultRoute;

  }

  //=========================================================================
  // Navigation
  //=========================================================================

  navigate(route) {

    if (!this.exists(route)) {

      Logger.warning("Route not found: " + route);

      return false;

    }

    this._currentRoute = route;

    this._history.push(route);

    Logger.info("Navigated to: " + route);

    return true;

  }

  current() {

    return this._currentRoute;

  }

  history() {

    return this._history;

  }

  //=========================================================================
  // Navigation History
  //=========================================================================

  previous() {

    if (this._history.length < 2) {

      return null;

    }

    return this._history[this._history.length - 2];

  }

  clearHistory() {

    this._history = [];

    return this;

  }

  //=========================================================================
  // Route Management
  //=========================================================================

  remove(route) {

    if (!this.exists(route)) {

      return false;

    }

    delete this._routes[route];

    return true;

  }

  clear() {

    this._routes = {};

    this._currentRoute = null;

    this._history = [];

    return this;

  }

  //=========================================================================
  // Information
  //=========================================================================

  isInitialized() {

    return this._initialized;

  }

  info() {

    return {

      component: "UI Router",

      version: "1.0.0",

      initialized: this.isInitialized(),

      routes: this.count(),

      currentRoute: this.current(),

      defaultRoute: this.getDefault()

    };

  }

}

/*==============================================================================
  Module Registration
==============================================================================*/

WEF.UI.Core.Router = new UIRouter();