/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 207_UI_ComponentManager.gs
 * Layer       : Presentation
 * Component   : UI Component Manager
 * Version     : 1.0.0
 * Description : Registers and manages reusable UI components.
 * =============================================================================
 */

'use strict';

class UIComponentManager {

  constructor() {

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    this._components = {};

    this._categories = {};

    this._initialized = true;

    return this;

  }

  //=========================================================================
  // Component Registration
  //=========================================================================

  register(name, component, category) {

    category = (category || "general").toLowerCase();

    if (!this._categories[category]) {

      this._categories[category] = {};

    }

    const item = {

      name: name,

      component: component || {},

      category: category,

      enabled: true,

      registered: new Date()

    };

    this._components[name] = item;

    this._categories[category][name] = item;

    return this;

  }

  registerMany(componentList) {

    componentList.forEach(component => {

      this.register(

        component.name,

        component.definition,

        component.category

      );

    });

    return this;

  }

  //=========================================================================
  // Lookup
  //=========================================================================

  exists(name) {

    return this._components.hasOwnProperty(name);

  }

  get(name) {

    return this._components[name] || null;

  }

  getAll() {

    return this._components;

  }

  getByCategory(category) {

    category = (category || "general").toLowerCase();

    return this._categories[category] || {};

  }

  keys() {

    return Object.keys(this._components);

  }

  count() {

    return this.keys().length;

  }

  categoryKeys() {

    return Object.keys(this._categories);

  }

  categoryCount() {

    return this.categoryKeys().length;

  }

  //=========================================================================
  // Component State
  //=========================================================================

  enable(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._components[name].enabled = true;

    return true;

  }

  disable(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._components[name].enabled = false;

    return true;

  }

  //=========================================================================
  // Component Management
  //=========================================================================

  remove(name) {

    if (!this.exists(name)) {

      return false;

    }

    const category = this._components[name].category;

    delete this._categories[category][name];

    if (Object.keys(this._categories[category]).length === 0) {

      delete this._categories[category];

    }

    delete this._components[name];

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

      component: "UI Component Manager",

      version: "1.0.0",

      initialized: this.isInitialized(),

      components: this.count(),

      categories: this.categoryCount()

    };

  }

}

/*==============================================================================
  Module Registration
==============================================================================*/

WEF.UI.Core.ComponentManager = new UIComponentManager();