/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 41_ERP_ModuleManager.gs
 * Version     : 1.0.0
 * Description : ERP Module Manager
 * =============================================================================
 */

'use strict';

class ERPModuleManager extends BaseService {

  constructor() {

    super("ERPModuleManager");

    this.initialize();

  }

  initialize() {

    super.initialize();

    this._modules = {};

    this._statistics = {

      installed : 0,
      enabled : 0,
      disabled : 0,
      removed : 0

    };

    return this;

  }

  //=========================================================================
  // Installation
  //=========================================================================

  install(name, module) {

    this._modules[name] = {

      name : name,
      module : module,
      enabled : true,
      installed : new Date()

    };

    this._statistics.installed++;
    this._statistics.enabled++;

    return this._modules[name];

  }

  get(name) {

    return this._modules[name] || null;

  }

  exists(name) {

    return !!this._modules[name];

  }

  modules() {

    return Object.keys(this._modules);

  }

  count() {

    return this.modules().length;

  }

  //=========================================================================
  // Enable / Disable
  //=========================================================================

  enable(name) {

    if (!this.exists(name))
      return false;

    if (!this._modules[name].enabled) {

      this._modules[name].enabled = true;

      this._statistics.enabled++;

    }

    return true;

  }

  disable(name) {

    if (!this.exists(name))
      return false;

    if (this._modules[name].enabled) {

      this._modules[name].enabled = false;

      this._statistics.disabled++;

    }

    return true;

  }

  isEnabled(name) {

    return this.exists(name)
      ? this._modules[name].enabled
      : false;

  }

  //=========================================================================
  // Remove
  //=========================================================================

  remove(name) {

    if (!this.exists(name))
      return false;

    delete this._modules[name];

    this._statistics.removed++;

    return true;

  }

  //=========================================================================
  // Lists
  //=========================================================================

  installedModules() {

    return this.modules();

  }

  enabledModules() {

    return this.modules().filter(function(name){

      return this._modules[name].enabled;

    }, this);

  }

  disabledModules() {

    return this.modules().filter(function(name){

      return !this._modules[name].enabled;

    }, this);

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      enabled: this.enabledModules().length,
      disabled: this.disabledModules().length,
      modules: this.count()

    };

  }

  health() {

    return {

      initialized: this.isInitialized(),
      healthy: true,
      modules: this.count(),
      enabled: this.enabledModules().length

    };

  }

  report() {

    return {

      modules: this.modules(),
      enabled: this.enabledModules(),
      disabled: this.disabledModules(),
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
