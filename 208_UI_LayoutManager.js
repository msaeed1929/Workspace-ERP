/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 208_UI_LayoutManager.gs
 * Layer       : Presentation
 * Component   : UI Layout Manager
 * Version     : 1.0.0
 * Description : Manages application layouts, regions and page structure.
 * =============================================================================
 */

'use strict';

class UILayoutManager {

  constructor() {

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    this._layouts = {};

    this._activeLayout = null;

    this._regions = {};

    this._initialized = true;

    return this;

  }

  //=========================================================================
  // Layout Registration
  //=========================================================================

  register(name, layout) {

    this._layouts[name] = {

      name: name,

      definition: layout || {},

      enabled: true,

      created: new Date()

    };

    if (!this._activeLayout) {

      this._activeLayout = name;

    }

    return this;

  }

  registerMany(layouts) {

    Object.keys(layouts).forEach(name => {

      this.register(name, layouts[name]);

    });

    return this;

  }

  //=========================================================================
  // Layout Lookup
  //=========================================================================

  exists(name) {

    return this._layouts.hasOwnProperty(name);

  }

  get(name) {

    return this._layouts[name] || null;

  }

  getAll() {

    return this._layouts;

  }

  keys() {

    return Object.keys(this._layouts);

  }

  count() {

    return this.keys().length;

  }

  //=========================================================================
  // Active Layout
  //=========================================================================

  setActive(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._activeLayout = name;

    Logger.info("Active layout changed to: " + name);

    return true;

  }

  getActive() {

    return this._activeLayout;

  }

  getActiveLayout() {

    if (!this._activeLayout) {

      return null;

    }

    return this.get(this._activeLayout);

  }

  //=========================================================================
  // Regions
  //=========================================================================

  setRegion(name, value) {

    this._regions[name] = value;

    return this;

  }

  getRegion(name) {

    return this._regions[name] || null;

  }

  getRegions() {

    return this._regions;

  }

  clearRegions() {

    this._regions = {};

    return this;

  }

  //=========================================================================
  // Layout State
  //=========================================================================

  enable(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._layouts[name].enabled = true;

    return true;

  }

  disable(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._layouts[name].enabled = false;

    return true;

  }

  //=========================================================================
  // Layout Management
  //=========================================================================

  remove(name) {

    if (!this.exists(name)) {

      return false;

    }

    if (this._activeLayout === name) {

      this._activeLayout = null;

    }

    delete this._layouts[name];

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

      component: "UI Layout Manager",

      version: "1.0.0",

      initialized: this.isInitialized(),

      layouts: this.count(),

      activeLayout: this.getActive(),

      regions: Object.keys(this._regions).length

    };

  }

}

/*==============================================================================
  Module Registration
==============================================================================*/

WEF.UI.Core.LayoutManager = new UILayoutManager();