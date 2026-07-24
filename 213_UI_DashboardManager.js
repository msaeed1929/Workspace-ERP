/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 213_UI_DashboardManager.gs
 * Layer       : Presentation
 * Component   : UI Dashboard Manager
 * Version     : 1.0.0
 * Description : Manages ERP dashboards, widgets and KPI layouts.
 * =============================================================================
 */

'use strict';

class UIDashboardManager {

  constructor() {

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    this._dashboards = {};

    this._activeDashboard = null;

    this._initialized = true;

    return this;

  }

  //=========================================================================
  // Dashboard Registration
  //=========================================================================

  register(name, definition) {

    this._dashboards[name] = {

      name: name,

      title: definition.title || name,

      widgets: definition.widgets || [],

      layout: definition.layout || "default",

      refreshInterval: definition.refreshInterval || 300,

      enabled: true,

      created: new Date()

    };

    return this;

  }

  registerMany(dashboards) {

    Object.keys(dashboards).forEach(name => {

      this.register(name, dashboards[name]);

    });

    return this;

  }

  //=========================================================================
  // Dashboard Lookup
  //=========================================================================

  exists(name) {

    return this._dashboards.hasOwnProperty(name);

  }

  get(name) {

    return this._dashboards[name] || null;

  }

  getAll() {

    return this._dashboards;

  }

  keys() {

    return Object.keys(this._dashboards);

  }

  count() {

    return this.keys().length;

  }

  //=========================================================================
  // Active Dashboard
  //=========================================================================

  open(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._activeDashboard = name;

    Logger.info("Dashboard opened: " + name);

    return true;

  }

  close() {

    this._activeDashboard = null;

    return this;

  }

  active() {

    return this._activeDashboard;

  }

  getActiveDashboard() {

    if (!this._activeDashboard) {

      return null;

    }

    return this.get(this._activeDashboard);

  }

  //=========================================================================
  // Dashboard State
  //=========================================================================

  enable(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._dashboards[name].enabled = true;

    return true;

  }

  disable(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._dashboards[name].enabled = false;

    return true;

  }

  //=========================================================================
  // Dashboard Operations
  //=========================================================================

  refresh(name) {

    if (!this.exists(name)) {

      return false;

    }

    Logger.info("Refreshing dashboard: " + name);

    return true;

  }

  addWidget(name, widget) {

    if (!this.exists(name)) {

      return false;

    }

    this._dashboards[name].widgets.push(widget);

    return true;

  }

  removeWidget(name, widgetName) {

    if (!this.exists(name)) {

      return false;

    }

    this._dashboards[name].widgets =
      this._dashboards[name].widgets.filter(function(widget) {

        if (typeof widget === "string") {

          return widget !== widgetName;

        }

        return widget.name !== widgetName;

      });

    return true;

  }

  //=========================================================================
  // Dashboard Management
  //=========================================================================

  remove(name) {

    if (!this.exists(name)) {

      return false;

    }

    if (this._activeDashboard === name) {

      this._activeDashboard = null;

    }

    delete this._dashboards[name];

    return true;

  }

  clear() {

    this.initialize();

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

      component: "UI Dashboard Manager",

      version: "1.0.0",

      initialized: this.isInitialized(),

      dashboards: this.count(),

      activeDashboard: this.active()

    };

  }

}

/*==============================================================================
  Module Registration
==============================================================================*/

WEF.UI.Core.DashboardManager = new UIDashboardManager();