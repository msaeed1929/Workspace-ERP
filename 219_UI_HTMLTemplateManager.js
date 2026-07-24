/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 219_UI_HTMLTemplateManager.gs
 * Layer       : Presentation
 * Component   : UI HTML Template Manager
 * Version     : 1.0.0
 * Description : Manages HTML template registration, loading, rendering,
 *               caching and template composition.
 * =============================================================================
 */

'use strict';

class UIHTMLTemplateManager {

  constructor() {

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    this._templates = {};

    this._activeTemplate = null;

    this._initialized = true;

    return this;

  }

  //=========================================================================
  // Template Registration
  //=========================================================================

  register(name, definition) {

    this._templates[name] = {

      name: name,

      title: definition.title || name,

      file: definition.file || "",

      cacheable: definition.cacheable !== false,

      cached: false,

      version: definition.version || "1.0.0",

      enabled: true,

      created: new Date()

    };

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

  keys() {

    return Object.keys(this._templates);

  }

  count() {

    return this.keys().length;

  }

  //=========================================================================
  // Active Template
  //=========================================================================

  open(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._activeTemplate = name;

    Logger.info("Template opened: " + name);

    return true;

  }

  close() {

    this._activeTemplate = null;

    return this;

  }

  active() {

    return this._activeTemplate;

  }

  getActiveTemplate() {

    if (!this._activeTemplate) {

      return null;

    }

    return this.get(this._activeTemplate);

  }

  //=========================================================================
  // Template State
  //=========================================================================

  enable(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._templates[name].enabled = true;

    return true;

  }

  disable(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._templates[name].enabled = false;

    return true;

  }

  //=========================================================================
  // Template Operations
  //=========================================================================

  render(name, data) {

    if (!this.exists(name)) {

      return false;

    }

    Logger.info("Rendering template: " + name);

    return {

      template: this._templates[name].file,

      data: data || {},

      rendered: true

    };

  }

  cache(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._templates[name].cached = true;

    Logger.info("Template cached: " + name);

    return true;

  }

  clearCache(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._templates[name].cached = false;

    Logger.info("Template cache cleared: " + name);

    return true;

  }

  //=========================================================================
  // Template Management
  //=========================================================================

  remove(name) {

    if (!this.exists(name)) {

      return false;

    }

    if (this._activeTemplate === name) {

      this._activeTemplate = null;

    }

    delete this._templates[name];

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

      component: "UI HTML Template Manager",

      version: "1.0.0",

      initialized: this.isInitialized(),

      templates: this.count(),

      activeTemplate: this.active()

    };

  }

}

/*==============================================================================
  Module Registration
==============================================================================*/

WEF.UI.Core.HTMLTemplateManager = new UIHTMLTemplateManager();