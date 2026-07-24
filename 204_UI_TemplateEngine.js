/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 204_UI_TemplateEngine.gs
 * Layer       : Presentation
 * Component   : UI Template Engine
 * Version     : 1.0.0
 * Description : Manages HTML templates for the Presentation Layer.
 * =============================================================================
 */

'use strict';

class UITemplateEngine {

  constructor() {

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    this._templates = {};

    this._cache = {};

    this._initialized = true;

    return this;

  }

  //=========================================================================
  // Template Registration
  //=========================================================================

  register(name, html) {

    this._templates[name] = html;

    return this;

  }

  registerMany(templates) {

    Object.keys(templates).forEach(name => {

      this.register(name, templates[name]);

    });

    return this;

  }

  //=========================================================================
  // Template Lookup
  //=========================================================================

  exists(name) {

    return this._templates.hasOwnProperty(name);

  }

  get(name) {

    return this._templates[name] || null;

  }

  getAll() {

    return this._templates;

  }

  count() {

    return Object.keys(this._templates).length;

  }

  keys() {

    return Object.keys(this._templates);

  }

  //=========================================================================
  // Cache
  //=========================================================================

  cache(name, html) {

    this._cache[name] = html;

    return this;

  }

  getCache(name) {

    return this._cache[name] || null;

  }

  clearCache() {

    this._cache = {};

    return this;

  }

  cacheSize() {

    return Object.keys(this._cache).length;

  }

  //=========================================================================
  // Render
  //=========================================================================

  render(name) {

    if (!this.exists(name)) {

      Logger.warning("Template not found: " + name);

      return null;

    }

    return this.get(name);

  }

  //=========================================================================
  // Template Management
  //=========================================================================

  remove(name) {

    if (!this.exists(name)) {

      return false;

    }

    delete this._templates[name];

    delete this._cache[name];

    return true;

  }

  clear() {

    this._templates = {};

    this._cache = {};

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

      component: "UI Template Engine",

      version: "1.0.0",

      initialized: this.isInitialized(),

      templates: this.count(),

      cacheEntries: this.cacheSize()

    };

  }

}

/*==============================================================================
  Module Registration
==============================================================================*/

WEF.UI.Core.TemplateEngine = new UITemplateEngine();