/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 35_Core_FrameworkManager.gs
 * Version     : 1.0.0
 * Description : Framework Manager
 * =============================================================================
 */

'use strict';

class FrameworkManagerService extends BaseService {

  constructor() {

    super("FrameworkManager");

    this.initialize();

  }

  initialize() {

    super.initialize();

    this.reset();

    return this;

  }

  reset() {

    this._services = {};

    this._statistics = {

      registered : 0,
      initialized : 0,
      resets : 0

    };

    return this;

  }

  //=========================================================================
  // Service Registration
  //=========================================================================

  register(name, service) {

    this._services[name] = service;

    this._statistics.registered++;

    return service;

  }

  get(name) {

    return this._services[name] || null;

  }

  exists(name) {

    return !!this._services[name];

  }

  remove(name) {

    if (!this.exists(name))
      return false;

    delete this._services[name];

    return true;

  }

  services() {

    return Object.keys(this._services);

  }

  count() {

    return this.services().length;

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initializeServices() {

    Object.keys(this._services).forEach(function(name){

      const service = this._services[name];

      if (
        service &&
        typeof service.initialize === "function"
      ) {

        service.initialize();

        this._statistics.initialized++;

      }

    }, this);

    return true;

  }

  //=========================================================================
  // Reset Services
  //=========================================================================

  resetServices() {

    Object.keys(this._services).forEach(function(name){

      const service = this._services[name];

      if (
        service &&
        typeof service.reset === "function"
      ) {

        service.reset();

      }

    }, this);

    this._statistics.resets++;

    return true;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      services: this.count(),
      registered: this._statistics.registered,
      initialized: this._statistics.initialized,
      resets: this._statistics.resets

    };

  }

  health() {

    return {

      initialized: this.isInitialized(),
      healthy: true,
      services: this.count()

    };

  }

  report() {

    return {

      services: this.services(),
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

WEF.FrameworkManager =
  new FrameworkManagerService();