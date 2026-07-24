/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 40_ERP_Application.gs
 * Version     : 1.0.0
 * Description : ERP Application
 * =============================================================================
 */

'use strict';

class ERPApplication extends BaseService {

  constructor() {

    super("ERP");

    this.initialize();

  }

  initialize() {

    super.initialize();

    this._booted = false;

    this._modules = {};

    this._statistics = {

      boots : 0,
      shutdowns : 0,
      modules : 0

    };

    return this;

  }

  //=========================================================================
  // Boot
  //=========================================================================

  boot() {

    if (this._booted)
      return true;

    this._booted = true;

    this._statistics.boots++;

    return true;

  }

  shutdown() {

    if (!this._booted)
      return true;

    this._booted = false;

    this._statistics.shutdowns++;

    return true;

  }

  isBooted() {

    return this._booted;

  }

  //=========================================================================
  // Module Registration
  //=========================================================================

  registerModule(name, module) {

    this._modules[name] = module;

    this._statistics.modules =
      Object.keys(this._modules).length;

    return module;

  }

  module(name) {

    return this._modules[name] || null;

  }

  hasModule(name) {

    return !!this._modules[name];

  }

  modules() {

    return Object.keys(this._modules);

  }

  moduleCount() {

    return this.modules().length;

  }

  //=========================================================================
  // Module Management
  //=========================================================================

  removeModule(name) {

    if (!this.hasModule(name))
      return false;

    delete this._modules[name];

    this._statistics.modules =
      Object.keys(this._modules).length;

    return true;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      boots: this._statistics.boots,
      shutdowns: this._statistics.shutdowns,
      modules: this.moduleCount()

    };

  }

  health() {

    return {

      initialized: this.isInitialized(),
      healthy: true,
      booted: this.isBooted(),
      modules: this.moduleCount()

    };

  }

  report() {

    return {

      modules: this.modules(),
      statistics: this.statistics(),
      health: this.health()

    };

  }

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

//==============================================================================
// Global ERP Instance
//==============================================================================

var ERP = new ERPApplication();