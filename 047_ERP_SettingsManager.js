/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 47_ERP_SettingsManager.gs
 * Version     : 1.0.0
 * Description : ERP Settings Manager
 * =============================================================================
 */

'use strict';

class ERPSettingsManager extends BaseService {

  constructor() {

    super("ERPSettingsManager");

    this.initialize();

  }

  initialize() {

    super.initialize();

    this._groups = {};

    return this;

  }

  //=========================================================================
  // Groups
  //=========================================================================

  register(group) {

    if (!this._groups[group]) {

      this._groups[group] = {};

    }

    return this._groups[group];

  }

  exists(group) {

    return !!this._groups[group];

  }

  group(group) {

    return this._groups[group] || null;

  }

  groups() {

    return Object.keys(this._groups);

  }

  count() {

    return this.groups().length;

  }

  //=========================================================================
  // Settings
  //=========================================================================

  set(group, key, value) {

    this.register(group);

    this._groups[group][key] = value;

    return value;

  }

  get(group, key) {

    if (!this.exists(group))
      return null;

    return this._groups[group].hasOwnProperty(key)
      ? this._groups[group][key]
      : null;

  }

  update(group, key, value) {

    if (this.get(group, key) === null)
      return null;

    this._groups[group][key] = value;

    return value;

  }

  remove(group, key) {

    if (this.get(group, key) === null)
      return false;

    delete this._groups[group][key];

    return true;

  }

  all(group) {

    if (!this.exists(group))
      return {};

    return this._groups[group];

  }

  settingCount(group) {

    if (!this.exists(group))
      return 0;

    return Object.keys(this._groups[group]).length;

  }

  //=========================================================================
  // Maintenance
  //=========================================================================

  clear(group) {

    if (!this.exists(group))
      return false;

    this._groups[group] = {};

    return true;

  }

  clearAll() {

    this._groups = {};

    return true;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    var settings = 0;

    this.groups().forEach(function(group){

      settings += this.settingCount(group);

    }, this);

    return {

      groups : this.count(),
      settings : settings

    };

  }

  health() {

    return {

      initialized : this.isInitialized(),
      healthy : true,
      groups : this.count(),
      settings : this.statistics().settings

    };

  }

  report() {

    return {

      groups : this.groups(),
      statistics : this.statistics(),
      health : this.health()

    };

  }

  info() {

    return {

      service : this.getName(),
      version : this.getVersion(),
      initialized : this.isInitialized(),
      created : this.getCreatedTime(),
      statistics : this.statistics()

    };

  }

}
