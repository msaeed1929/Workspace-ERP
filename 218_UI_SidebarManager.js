/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 218_UI_SidebarManager.gs
 * Layer       : Presentation
 * Component   : UI Sidebar Manager
 * Version     : 1.0.0
 * Description : Manages application sidebars, navigation panels,
 *               collapsible sections and workspace panes.
 * =============================================================================
 */

'use strict';

class UISidebarManager {

  constructor() {

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    this._sidebars = {};

    this._activeSidebar = null;

    this._initialized = true;

    return this;

  }

  //=========================================================================
  // Sidebar Registration
  //=========================================================================

  register(name, definition) {

    this._sidebars[name] = {

      name: name,

      title: definition.title || name,

      position: definition.position || "left",

      width: definition.width || 300,

      collapsible: definition.collapsible !== false,

      collapsed: definition.collapsed || false,

      sections: definition.sections || [],

      enabled: true,

      created: new Date()

    };

    return this;

  }

  registerMany(sidebars) {

    Object.keys(sidebars).forEach(name => {

      this.register(name, sidebars[name]);

    });

    return this;

  }

  //=========================================================================
  // Sidebar Lookup
  //=========================================================================

  exists(name) {

    return this._sidebars.hasOwnProperty(name);

  }

  get(name) {

    return this._sidebars[name] || null;

  }

  getAll() {

    return this._sidebars;

  }

  keys() {

    return Object.keys(this._sidebars);

  }

  count() {

    return this.keys().length;

  }

  //=========================================================================
  // Active Sidebar
  //=========================================================================

  open(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._activeSidebar = name;

    Logger.info("Sidebar opened: " + name);

    return true;

  }

  close() {

    this._activeSidebar = null;

    return this;

  }

  active() {

    return this._activeSidebar;

  }

  getActiveSidebar() {

    if (!this._activeSidebar) {

      return null;

    }

    return this.get(this._activeSidebar);

  }

  //=========================================================================
  // Sidebar State
  //=========================================================================

  enable(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._sidebars[name].enabled = true;

    return true;

  }

  disable(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._sidebars[name].enabled = false;

    return true;

  }

  //=========================================================================
  // Sidebar Operations
  //=========================================================================

  collapse(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._sidebars[name].collapsed = true;

    Logger.info("Sidebar collapsed: " + name);

    return true;

  }

  expand(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._sidebars[name].collapsed = false;

    Logger.info("Sidebar expanded: " + name);

    return true;

  }

  toggle(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._sidebars[name].collapsed =
      !this._sidebars[name].collapsed;

    Logger.info("Sidebar toggled: " + name);

    return true;

  }

  //=========================================================================
  // Sidebar Management
  //=========================================================================

  remove(name) {

    if (!this.exists(name)) {

      return false;

    }

    if (this._activeSidebar === name) {

      this._activeSidebar = null;

    }

    delete this._sidebars[name];

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

      component: "UI Sidebar Manager",

      version: "1.0.0",

      initialized: this.isInitialized(),

      sidebars: this.count(),

      activeSidebar: this.active()

    };

  }

}

/*==============================================================================
  Module Registration
==============================================================================*/

WEF.UI.Core.SidebarManager = new UISidebarManager();