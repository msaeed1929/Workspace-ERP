/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 212_UI_TableManager.gs
 * Layer       : Presentation
 * Component   : UI Table Manager
 * Version     : 1.0.0
 * Description : Manages UI data tables, grids and table operations.
 * =============================================================================
 */

'use strict';

class UITableManager {

  constructor() {

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    this._tables = {};

    this._activeTable = null;

    this._initialized = true;

    return this;

  }

  //=========================================================================
  // Table Registration
  //=========================================================================

  register(name, definition) {

    this._tables[name] = {

      name: name,

      title: definition.title || name,

      columns: definition.columns || [],

      data: definition.data || [],

      pageSize: definition.pageSize || 25,

      sortable: definition.sortable !== false,

      filterable: definition.filterable !== false,

      selectable: definition.selectable !== false,

      enabled: true,

      created: new Date()

    };

    return this;

  }

  registerMany(tables) {

    Object.keys(tables).forEach(name => {

      this.register(name, tables[name]);

    });

    return this;

  }

  //=========================================================================
  // Table Lookup
  //=========================================================================

  exists(name) {

    return this._tables.hasOwnProperty(name);

  }

  get(name) {

    return this._tables[name] || null;

  }

  getAll() {

    return this._tables;

  }

  keys() {

    return Object.keys(this._tables);

  }

  count() {

    return this.keys().length;

  }

  //=========================================================================
  // Active Table
  //=========================================================================

  open(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._activeTable = name;

    Logger.info("Table opened: " + name);

    return true;

  }

  close() {

    this._activeTable = null;

    return this;

  }

  active() {

    return this._activeTable;

  }

  getActiveTable() {

    if (!this._activeTable) {

      return null;

    }

    return this.get(this._activeTable);

  }

  //=========================================================================
  // Table State
  //=========================================================================

  enable(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._tables[name].enabled = true;

    return true;

  }

  disable(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._tables[name].enabled = false;

    return true;

  }

  //=========================================================================
  // Table Operations
  //=========================================================================

  sort(name, column, direction) {

    if (!this.exists(name)) {

      return false;

    }

    Logger.info(
      "Sorting table [" + name + "] by " +
      column + " (" + (direction || "ASC") + ")"
    );

    return true;

  }

  filter(name, criteria) {

    if (!this.exists(name)) {

      return false;

    }

    Logger.info(
      "Filtering table [" + name + "]"
    );

    return true;

  }

  refresh(name) {

    if (!this.exists(name)) {

      return false;

    }

    Logger.info(
      "Refreshing table: " + name
    );

    return true;

  }

  //=========================================================================
  // Table Management
  //=========================================================================

  remove(name) {

    if (!this.exists(name)) {

      return false;

    }

    if (this._activeTable === name) {

      this._activeTable = null;

    }

    delete this._tables[name];

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

      component: "UI Table Manager",

      version: "1.0.0",

      initialized: this.isInitialized(),

      tables: this.count(),

      activeTable: this.active()

    };

  }

}

/*==============================================================================
  Module Registration
==============================================================================*/

WEF.UI.Core.TableManager = new UITableManager();