/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 206_UI_ThemeManager.gs
 * Layer       : Presentation
 * Component   : UI Theme Manager
 * Version     : 1.0.0
 * Description : Manages UI themes, colors and appearance.
 * =============================================================================
 */

'use strict';

class UIThemeManager {

  constructor() {

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    this._themes = {};

    this._activeTheme = null;

    this._initialized = true;

    return this;

  }

  //=========================================================================
  // Theme Registration
  //=========================================================================

  register(name, config) {

    this._themes[name] = {

      name: name,

      config: config || {},

      enabled: true,

      created: new Date()

    };

    if (!this._activeTheme) {

      this._activeTheme = name;

    }

    return this;

  }

  registerMany(themes) {

    Object.keys(themes).forEach(name => {

      this.register(name, themes[name]);

    });

    return this;

  }

  //=========================================================================
  // Lookup
  //=========================================================================

  exists(name) {

    return this._themes.hasOwnProperty(name);

  }

  get(name) {

    return this._themes[name] || null;

  }

  getAll() {

    return this._themes;

  }

  keys() {

    return Object.keys(this._themes);

  }

  count() {

    return this.keys().length;

  }

  //=========================================================================
  // Active Theme
  //=========================================================================

  setActive(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._activeTheme = name;

    Logger.info("Active theme changed to: " + name);

    return true;

  }

  getActive() {

    return this._activeTheme;

  }

  getActiveTheme() {

    if (!this._activeTheme) {

      return null;

    }

    return this.get(this._activeTheme);

  }

  //=========================================================================
  // Theme State
  //=========================================================================

  enable(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._themes[name].enabled = true;

    return true;

  }

  disable(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._themes[name].enabled = false;

    return true;

  }

  //=========================================================================
  // Theme Management
  //=========================================================================

  remove(name) {

    if (!this.exists(name)) {

      return false;

    }

    if (this._activeTheme === name) {

      this._activeTheme = null;

    }

    delete this._themes[name];

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

      component: "UI Theme Manager",

      version: "1.0.0",

      initialized: this.isInitialized(),

      themes: this.count(),

      activeTheme: this.getActive()

    };

  }

}

/*==============================================================================
  Module Registration
==============================================================================*/

WEF.UI.Core.ThemeManager = new UIThemeManager();