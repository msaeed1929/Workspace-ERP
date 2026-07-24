/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 214_UI_ReportViewerManager.gs
 * Layer       : Presentation
 * Component   : UI Report Viewer Manager
 * Version     : 1.0.0
 * Description : Manages report registration, viewing, rendering and export.
 * =============================================================================
 */

'use strict';

class UIReportViewerManager {

  constructor() {

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    this._reports = {};

    this._activeReport = null;

    this._initialized = true;

    return this;

  }

  //=========================================================================
  // Report Registration
  //=========================================================================

  register(name, definition) {

    this._reports[name] = {

      name: name,

      title: definition.title || name,

      category: definition.category || "General",

      template: definition.template || "",

      exportFormats: definition.exportFormats || [

        "PDF",

        "Excel"

      ],

      enabled: true,

      created: new Date()

    };

    return this;

  }

  registerMany(reports) {

    Object.keys(reports).forEach(name => {

      this.register(name, reports[name]);

    });

    return this;

  }

  //=========================================================================
  // Report Lookup
  //=========================================================================

  exists(name) {

    return this._reports.hasOwnProperty(name);

  }

  get(name) {

    return this._reports[name] || null;

  }

  getAll() {

    return this._reports;

  }

  keys() {

    return Object.keys(this._reports);

  }

  count() {

    return this.keys().length;

  }

  //=========================================================================
  // Active Report
  //=========================================================================

  open(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._activeReport = name;

    Logger.info("Report opened: " + name);

    return true;

  }

  close() {

    this._activeReport = null;

    return this;

  }

  active() {

    return this._activeReport;

  }

  getActiveReport() {

    if (!this._activeReport) {

      return null;

    }

    return this.get(this._activeReport);

  }

  //=========================================================================
  // Report State
  //=========================================================================

  enable(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._reports[name].enabled = true;

    return true;

  }

  disable(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._reports[name].enabled = false;

    return true;

  }

  //=========================================================================
  // Report Operations
  //=========================================================================

  render(name, parameters) {

    if (!this.exists(name)) {

      return false;

    }

    Logger.info("Rendering report: " + name);

    return true;

  }

  export(name, format) {

    if (!this.exists(name)) {

      return false;

    }

    format = format || "PDF";

    Logger.info(

      "Exporting report [" +

      name +

      "] as " +

      format

    );

    return true;

  }

  refresh(name) {

    if (!this.exists(name)) {

      return false;

    }

    Logger.info("Refreshing report: " + name);

    return true;

  }

  //=========================================================================
  // Report Management
  //=========================================================================

  remove(name) {

    if (!this.exists(name)) {

      return false;

    }

    if (this._activeReport === name) {

      this._activeReport = null;

    }

    delete this._reports[name];

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

      component: "UI Report Viewer Manager",

      version: "1.0.0",

      initialized: this.isInitialized(),

      reports: this.count(),

      activeReport: this.active()

    };

  }

}

/*==============================================================================
  Module Registration
==============================================================================*/

WEF.UI.Core.ReportViewerManager = new UIReportViewerManager();