/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 55_CRM_ActivityManager.gs
 * Version     : 1.0.0
 * Description : CRM Activity Manager
 * =============================================================================
 */

'use strict';

class CRMActivityManager extends BaseService {

  constructor() {

    super("CRMActivityManager");

    this.initialize();

  }

  initialize() {

    super.initialize();

    this._activities = {};

    return this;

  }

  //=========================================================================
  // Activities
  //=========================================================================

  create(code, activity) {

    if (this.exists(code))
      return null;

    this._activities[code] = activity;

    return activity;

  }

  exists(code) {

    return !!this._activities[code];

  }

  get(code) {

    return this._activities[code] || null;

  }

  update(code, activity) {

    if (!this.exists(code))
      return null;

    this._activities[code] = activity;

    return activity;

  }

  remove(code) {

    if (!this.exists(code))
      return false;

    delete this._activities[code];

    return true;

  }

  all() {

    return this._activities;

  }

  codes() {

    return Object.keys(this._activities);

  }

  count() {

    return this.codes().length;

  }

  //=========================================================================
  // Activity Status
  //=========================================================================

  complete(code) {

    if (!this.exists(code))
      return false;

    this._activities[code].status = "Completed";

    return true;

  }

  reopen(code) {

    if (!this.exists(code))
      return false;

    this._activities[code].status = "Pending";

    return true;

  }

  completed() {

    var activities = {};

    Object.keys(this._activities).forEach(function(code){

      if (this._activities[code].status === "Completed")
        activities[code] = this._activities[code];

    }, this);

    return activities;

  }

  pending() {

    var activities = {};

    Object.keys(this._activities).forEach(function(code){

      if (this._activities[code].status === "Pending")
        activities[code] = this._activities[code];

    }, this);

    return activities;

  }

  //=========================================================================
  // Maintenance
  //=========================================================================

  clear() {

    this._activities = {};

    return true;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      activities : this.count(),
      pending : Object.keys(this.pending()).length,
      completed : Object.keys(this.completed()).length

    };

  }

  health() {

    return {

      initialized : this.isInitialized(),
      healthy : true,
      activities : this.count(),
      pending : Object.keys(this.pending()).length,
      completed : Object.keys(this.completed()).length

    };

  }

  report() {

    return {

      activities : this.codes(),
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

//==============================================================================
// CRM Registration
//==============================================================================function bootCRMActivityManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "CRM",
      "ActivityManager",
      new CRMActivityManager()
    );
  }
}