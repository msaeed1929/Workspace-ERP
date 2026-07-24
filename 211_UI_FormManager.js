/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 211_UI_FormManager.gs
 * Layer       : Presentation
 * Component   : UI Form Manager
 * Version     : 1.0.0
 * Description : Manages forms, fields, validation and form lifecycle.
 * =============================================================================
 */

'use strict';

class UIFormManager {

  constructor() {

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    this._forms = {};

    this._activeForm = null;

    this._initialized = true;

    return this;

  }

  //=========================================================================
  // Form Registration
  //=========================================================================

  register(name, definition) {

    this._forms[name] = {

      name: name,

      title: definition.title || name,

      fields: definition.fields || {},

      validation: definition.validation || {},

      readOnly: definition.readOnly || false,

      enabled: true,

      created: new Date()

    };

    return this;

  }

  registerMany(forms) {

    Object.keys(forms).forEach(name => {

      this.register(name, forms[name]);

    });

    return this;

  }

  //=========================================================================
  // Form Lookup
  //=========================================================================

  exists(name) {

    return this._forms.hasOwnProperty(name);

  }

  get(name) {

    return this._forms[name] || null;

  }

  getAll() {

    return this._forms;

  }

  keys() {

    return Object.keys(this._forms);

  }

  count() {

    return this.keys().length;

  }

  //=========================================================================
  // Active Form
  //=========================================================================

  open(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._activeForm = name;

    Logger.info("Form opened: " + name);

    return true;

  }

  close() {

    this._activeForm = null;

    return this;

  }

  active() {

    return this._activeForm;

  }

  getActiveForm() {

    if (!this._activeForm) {

      return null;

    }

    return this.get(this._activeForm);

  }

  //=========================================================================
  // Form State
  //=========================================================================

  enable(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._forms[name].enabled = true;

    return true;

  }

  disable(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._forms[name].enabled = false;

    return true;

  }

  //=========================================================================
  // Form Operations
  //=========================================================================

  validate(name, data) {

    if (!this.exists(name)) {

      return false;

    }

    // Placeholder for future validation engine
    Logger.info("Validating form: " + name);

    return true;

  }

  submit(name, data) {

    if (!this.exists(name)) {

      return false;

    }

    if (!this.validate(name, data)) {

      return false;

    }

    Logger.info("Form submitted: " + name);

    return true;

  }

  reset(name) {

    if (!this.exists(name)) {

      return false;

    }

    Logger.info("Form reset: " + name);

    return true;

  }

  //=========================================================================
  // Form Management
  //=========================================================================

  remove(name) {

    if (!this.exists(name)) {

      return false;

    }

    if (this._activeForm === name) {

      this._activeForm = null;

    }

    delete this._forms[name];

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

      component: "UI Form Manager",

      version: "1.0.0",

      initialized: this.isInitialized(),

      forms: this.count(),

      activeForm: this.active()

    };

  }

}

/*==============================================================================
  Module Registration
==============================================================================*/

WEF.UI.Core.FormManager = new UIFormManager();