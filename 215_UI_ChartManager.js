/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 215_UI_ChartManager.gs
 * Layer       : Presentation
 * Component   : UI Chart Manager
 * Version     : 1.0.0
 * Description : Manages charts, datasets and visualization components.
 * =============================================================================
 */

'use strict';

class UIChartManager {

  constructor() {

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    this._charts = {};

    this._activeChart = null;

    this._initialized = true;

    return this;

  }

  //=========================================================================
  // Chart Registration
  //=========================================================================

  register(name, definition) {

    this._charts[name] = {

      name: name,

      title: definition.title || name,

      type: definition.type || "bar",

      dataset: definition.dataset || [],

      options: definition.options || {},

      refreshInterval: definition.refreshInterval || 300,

      enabled: true,

      created: new Date()

    };

    return this;

  }

  registerMany(charts) {

    Object.keys(charts).forEach(name => {

      this.register(name, charts[name]);

    });

    return this;

  }

  //=========================================================================
  // Chart Lookup
  //=========================================================================

  exists(name) {

    return this._charts.hasOwnProperty(name);

  }

  get(name) {

    return this._charts[name] || null;

  }

  getAll() {

    return this._charts;

  }

  keys() {

    return Object.keys(this._charts);

  }

  count() {

    return this.keys().length;

  }

  //=========================================================================
  // Active Chart
  //=========================================================================

  open(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._activeChart = name;

    Logger.info("Chart opened: " + name);

    return true;

  }

  close() {

    this._activeChart = null;

    return this;

  }

  active() {

    return this._activeChart;

  }

  getActiveChart() {

    if (!this._activeChart) {

      return null;

    }

    return this.get(this._activeChart);

  }

  //=========================================================================
  // Chart State
  //=========================================================================

  enable(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._charts[name].enabled = true;

    return true;

  }

  disable(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._charts[name].enabled = false;

    return true;

  }


  //=========================================================================
  // Chart Operations
  //=========================================================================

  render(name) {

    if (!this.exists(name)) {

      return false;

    }

    Logger.info("Rendering chart: " + name);

    return true;

  }

  refresh(name) {

    if (!this.exists(name)) {

      return false;

    }

    Logger.info("Refreshing chart: " + name);

    return true;

  }

  updateDataset(name, dataset) {

    if (!this.exists(name)) {

      return false;

    }

    this._charts[name].dataset = dataset || [];

    return true;

  }

  //=========================================================================
  // Chart Management
  //=========================================================================

  remove(name) {

    if (!this.exists(name)) {

      return false;

    }

    if (this._activeChart === name) {

      this._activeChart = null;

    }

    delete this._charts[name];

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

      component: "UI Chart Manager",

      version: "1.0.0",

      initialized: this.isInitialized(),

      charts: this.count(),

      activeChart: this.active()

    };

  }

}

/*==============================================================================
  Module Registration
==============================================================================*/

WEF.UI.Core.ChartManager = new UIChartManager();