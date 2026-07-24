/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 209_UI_MenuManager.gs
 * Layer       : Presentation
 * Component   : UI Menu Manager
 * Version     : 1.0.0
 * Description : Manages application menus and menu hierarchy.
 * =============================================================================
 */

'use strict';

class UIMenuManager {

  constructor() {

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    this._menus = {};

    this._activeMenu = null;

    this._initialized = true;

    return this;

  }

  //=========================================================================
  // Menu Registration
  //=========================================================================

  register(name, menu) {

    this._menus[name] = {

      name: name,

      title: menu.title || name,

      icon: menu.icon || "",

      route: menu.route || "",

      parent: menu.parent || null,

      order: menu.order || 0,

      visible: menu.visible !== false,

      enabled: true,

      created: new Date()

    };

    if (!this._activeMenu) {

      this._activeMenu = name;

    }

    return this;

  }

  registerMany(menus) {

    Object.keys(menus).forEach(name => {

      this.register(name, menus[name]);

    });

    return this;

  }

  //=========================================================================
  // Menu Lookup
  //=========================================================================

  exists(name) {

    return this._menus.hasOwnProperty(name);

  }

  get(name) {

    return this._menus[name] || null;

  }

  getAll() {

    return this._menus;

  }

  keys() {

    return Object.keys(this._menus);

  }

  count() {

    return this.keys().length;

  }

  //=========================================================================
  // Active Menu
  //=========================================================================

  setActive(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._activeMenu = name;

    Logger.info("Active menu changed to: " + name);

    return true;

  }

  getActive() {

    return this._activeMenu;

  }

  getActiveMenu() {

    if (!this._activeMenu) {

      return null;

    }

    return this.get(this._activeMenu);

  }

  //=========================================================================
  // Menu Visibility
  //=========================================================================

  show(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._menus[name].visible = true;

    return true;

  }

  hide(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._menus[name].visible = false;

    return true;

  }

  //=========================================================================
  // Menu State
  //=========================================================================

  enable(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._menus[name].enabled = true;

    return true;

  }

  disable(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._menus[name].enabled = false;

    return true;

  }

  //=========================================================================
  // Menu Management
  //=========================================================================

  remove(name) {

    if (!this.exists(name)) {

      return false;

    }

    if (this._activeMenu === name) {

      this._activeMenu = null;

    }

    delete this._menus[name];

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

    const visibleMenus = Object.values(this._menus)
      .filter(menu => menu.visible).length;

    return {

      component: "UI Menu Manager",

      version: "1.0.0",

      initialized: this.isInitialized(),

      menus: this.count(),

      visibleMenus: visibleMenus,

      activeMenu: this.getActive()

    };

  }

}

/*==============================================================================
  Module Registration
==============================================================================*/

WEF.UI.Core.MenuManager = new UIMenuManager();