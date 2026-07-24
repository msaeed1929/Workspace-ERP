/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 205_UI_AssetManager.gs
 * Layer       : Presentation
 * Component   : UI Asset Manager
 * Version     : 1.0.0
 * Description : Manages CSS, JavaScript, images, fonts and other UI assets.
 * =============================================================================
 */

'use strict';

class UIAssetManager {

  constructor() {

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    this._assets = {};

    this._groups = {

      css: {},

      javascript: {},

      images: {},

      fonts: {},

      icons: {},

      other: {}

    };

    this._initialized = true;

    return this;

  }

  //=========================================================================
  // Asset Registration
  //=========================================================================

  register(name, path, type) {

    type = (type || "other").toLowerCase();

    if (!this._groups[type]) {

      this._groups[type] = {};

    }

    const asset = {

      name: name,

      path: path,

      type: type,

      enabled: true,

      loaded: false,

      registered: new Date()

    };

    this._assets[name] = asset;

    this._groups[type][name] = asset;

    return this;

  }

  registerMany(assetList) {

    assetList.forEach(asset => {

      this.register(

        asset.name,

        asset.path,

        asset.type

      );

    });

    return this;

  }

  //=========================================================================
  // Lookup
  //=========================================================================

  exists(name) {

    return this._assets.hasOwnProperty(name);

  }

  get(name) {

    return this._assets[name] || null;

  }

  getAll() {

    return this._assets;

  }

  getByType(type) {

    type = (type || "other").toLowerCase();

    return this._groups[type] || {};

  }

  keys() {

    return Object.keys(this._assets);

  }

  count() {

    return this.keys().length;

  }

  //=========================================================================
  // State
  //=========================================================================

  enable(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._assets[name].enabled = true;

    return true;

  }

  disable(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._assets[name].enabled = false;

    return true;

  }

  markLoaded(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._assets[name].loaded = true;

    return true;

  }

  markUnloaded(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._assets[name].loaded = false;

    return true;

  }

  //=========================================================================
  // Asset Management
  //=========================================================================

  remove(name) {

    if (!this.exists(name)) {

      return false;

    }

    const type = this._assets[name].type;

    delete this._groups[type][name];

    delete this._assets[name];

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

      component: "UI Asset Manager",

      version: "1.0.0",

      initialized: this.isInitialized(),

      assets: this.count(),

      css: Object.keys(this.getByType("css")).length,

      javascript: Object.keys(this.getByType("javascript")).length,

      images: Object.keys(this.getByType("images")).length,

      fonts: Object.keys(this.getByType("fonts")).length,

      icons: Object.keys(this.getByType("icons")).length

    };

  }

}

/*==============================================================================
  Module Registration
==============================================================================*/

WEF.UI.Core.AssetManager = new UIAssetManager();