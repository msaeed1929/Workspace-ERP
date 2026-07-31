/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 165_System_UserPreferencesManager.gs
 * Module      : System
 * Class       : SystemUserPreferencesManager
 * Version     : 1.0.0
 * Description : User Preferences Management Service
 * =============================================================================
 */

'use strict';

class SystemUserPreferencesManager extends BaseService {

  constructor() {

    super("SystemUserPreferencesManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._preferences = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(preferenceId, data) {

    if (this.exists(preferenceId)) {

      return false;

    }

    this._preferences[preferenceId] = Object.assign({

      userId: "",

      language: "English",

      theme: "Light",

      timezone: "UTC",

      dateFormat: "YYYY-MM-DD",

      currency: "USD",

      notifications: true,

      dashboardLayout: "Default",

      status: "Active"

    }, data || {});

    return true;

  }

  update(preferenceId, data) {

    if (!this.exists(preferenceId)) {

      return false;

    }

    Object.assign(

      this._preferences[preferenceId],

      data || {}

    );

    return true;

  }

  get(preferenceId) {

    return this._preferences[preferenceId] || null;

  }

  getAll() {

    return this._preferences;

  }

  exists(preferenceId) {

    return this._preferences.hasOwnProperty(preferenceId);

  }

  remove(preferenceId) {

    if (!this.exists(preferenceId)) {

      return false;

    }

    delete this._preferences[preferenceId];

    return true;

  }

  clear() {

    this._preferences = {};

    return true;

  }

  count() {

    return Object.keys(this._preferences).length;

  }

  keys() {

    return Object.keys(this._preferences);

  }

  //=========================================================================
  // Preference Lifecycle
  //=========================================================================

  activate(preferenceId) {

    if (!this.exists(preferenceId)) {

      return false;

    }

    this._preferences[preferenceId].status = "Active";

    return true;

  }

  deactivate(preferenceId) {

    if (!this.exists(preferenceId)) {

      return false;

    }

    this._preferences[preferenceId].status = "Inactive";

    return true;

  }

  enableNotifications(preferenceId) {

    if (!this.exists(preferenceId)) {

      return false;

    }

    this._preferences[preferenceId].notifications = true;

    return true;

  }

  disableNotifications(preferenceId) {

    if (!this.exists(preferenceId)) {

      return false;

    }

    this._preferences[preferenceId].notifications = false;

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getActive() {

    return this.filter(pref =>
      pref.status === "Active"
    );

  }

  getInactive() {

    return this.filter(pref =>
      pref.status === "Inactive"
    );

  }

  getNotificationsEnabled() {

    return this.filter(pref =>
      pref.notifications === true
    );

  }

  getNotificationsDisabled() {

    return this.filter(pref =>
      pref.notifications === false
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._preferences).forEach(id => {

      if (callback(this._preferences[id])) {

        results[id] = this._preferences[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      preferences: this.count(),

      active: Object.keys(this.getActive()).length,

      inactive: Object.keys(this.getInactive()).length,

      notificationsEnabled:
        Object.keys(this.getNotificationsEnabled()).length,

      notificationsDisabled:
        Object.keys(this.getNotificationsDisabled()).length

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

      preferences: this.getAll(),

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
function bootSystemUserPreferencesManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "System",
      "UserPreferencesManager",
      new SystemUserPreferencesManager()
    );
  }
}