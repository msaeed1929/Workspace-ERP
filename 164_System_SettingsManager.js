/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 164_System_SettingsManager.gs
 * Module      : System
 * Class       : SystemSettingsManager
 * Version     : 1.0.0
 * Description : System Settings Management Service
 * =============================================================================
 */

'use strict';

class SystemSettingsManager extends BaseService {

  constructor() {

    super("SystemSettingsManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._settings = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(settingId, data) {

    if (this.exists(settingId)) {

      return false;

    }

    this._settings[settingId] = Object.assign({

      settingName: "",

      category: "",

      value: "",

      defaultValue: "",

      dataType: "String",

      editable: true,

      description: "",

      lastModified: "",

      status: "Active"

    }, data || {});

    return true;

  }

  update(settingId, data) {

    if (!this.exists(settingId)) {

      return false;

    }

    Object.assign(

      this._settings[settingId],

      data || {}

    );

    this._settings[settingId].lastModified = new Date();

    return true;

  }

  get(settingId) {

    return this._settings[settingId] || null;

  }

  getAll() {

    return this._settings;

  }

  exists(settingId) {

    return this._settings.hasOwnProperty(settingId);

  }

  remove(settingId) {

    if (!this.exists(settingId)) {

      return false;

    }

    delete this._settings[settingId];

    return true;

  }

  clear() {

    this._settings = {};

    return true;

  }

  count() {

    return Object.keys(this._settings).length;

  }

  keys() {

    return Object.keys(this._settings);

  }

  //=========================================================================
  // Settings Lifecycle
  //=========================================================================

  activate(settingId) {

    if (!this.exists(settingId)) {

      return false;

    }

    this._settings[settingId].status = "Active";

    return true;

  }

  deactivate(settingId) {

    if (!this.exists(settingId)) {

      return false;

    }

    this._settings[settingId].status = "Inactive";

    return true;

  }

  reset(settingId) {

    if (!this.exists(settingId)) {

      return false;

    }

    this._settings[settingId].value =
      this._settings[settingId].defaultValue;

    this._settings[settingId].lastModified = new Date();

    return true;

  }

  lock(settingId) {

    if (!this.exists(settingId)) {

      return false;

    }

    this._settings[settingId].editable = false;

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getActive() {

    return this.filter(setting =>
      setting.status === "Active"
    );

  }

  getInactive() {

    return this.filter(setting =>
      setting.status === "Inactive"
    );

  }

  getEditable() {

    return this.filter(setting =>
      setting.editable === true
    );

  }

  getLocked() {

    return this.filter(setting =>
      setting.editable === false
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._settings).forEach(id => {

      if (callback(this._settings[id])) {

        results[id] = this._settings[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      settings: this.count(),

      active: Object.keys(this.getActive()).length,

      inactive: Object.keys(this.getInactive()).length,

      editable: Object.keys(this.getEditable()).length,

      locked: Object.keys(this.getLocked()).length

    };

  }

  //=========================================================================
  // Health
  //=========================================================================

  health() {

    return {

      initialized: this.isInitialized(),

      healthy: true,

      service: this.getName(),

      version: this.getVersion(),

      status: "READY",

      ...this.statistics()

    };

  }

  //=========================================================================
  // Report
  //=========================================================================

  report() {

    return {

      settings: this.getAll(),

      statistics: this.statistics(),

      health: this.health()

    };

  }

  //=========================================================================
  // Information
  //=========================================================================

  info() {

    return {

      service: this.getName(),

      version: this.getVersion(),

      initialized: this.isInitialized(),

      created: this.getCreatedTime(),

      statistics: this.statistics()

    };

  }

}

//=============================================================================
// Module Registration
//=============================================================================

WEF.ServiceContainer.registerModuleService(
  "System",
  "SettingsManager",
  new SystemSettingsManager()
);