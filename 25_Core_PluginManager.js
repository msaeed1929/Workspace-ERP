/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 25_Core_PluginManager.gs
 * Version     : 1.0.0
 * Description : Plugin Manager
 * =============================================================================
 */

'use strict';

class PluginManagerService extends BaseService {

  constructor() {

    super("PluginManager");

    this.initialize();

  }

  initialize() {

    super.initialize();

    this.reset();

    return this;

  }

  reset() {

    this._plugins = {};

    this._order = [];

    this._statistics = {

      installed : 0,
      enabled   : 0,
      disabled  : 0,
      started   : 0,
      stopped   : 0,
      removed   : 0,
      failures  : 0

    };

    return this;

  }

  //=========================================================================
  // Installation
  //=========================================================================

  install(plugin) {

    if (!plugin)
      throw new Error(
        "Plugin is required."
      );

    const name =
      plugin.name ||
      plugin.getName?.();

    if (!name)
      throw new Error(
        "Plugin name is required."
      );

    if (this._plugins[name])
      throw new Error(
        "Plugin '" + name + "' already installed."
      );

    this._plugins[name] = {

      instance : plugin,

      enabled  : true,

      started  : false,

      installed : new Date()

    };

    this._order.push(name);

    if (typeof plugin.install === "function")
      plugin.install();

    if (typeof plugin.register === "function")
      plugin.register();

    this._statistics.installed++;

    this._statistics.enabled++;

    return this;

  }

  uninstall(name) {

    const plugin = this._plugins[name];

    if (!plugin)
      return false;

    if (plugin.started)
      this.stop(name);

    if (typeof plugin.instance.uninstall === "function")
      plugin.instance.uninstall();

    delete this._plugins[name];

    this._order =
      this._order.filter(function(item){

        return item !== name;

      });

    this._statistics.removed++;

    return true;

  }

  //=========================================================================
  // Enable / Disable
  //=========================================================================

  enable(name) {

    const plugin = this._plugins[name];

    if (!plugin)
      return false;

    plugin.enabled = true;

    this._statistics.enabled++;

    return true;

  }

  disable(name) {

    const plugin = this._plugins[name];

    if (!plugin)
      return false;

    plugin.enabled = false;

    this._statistics.disabled++;

    return true;

  }

  isEnabled(name) {

    return !!(
      this._plugins[name] &&
      this._plugins[name].enabled
    );

  }

  //=========================================================================
  // Start / Stop
  //=========================================================================

  start(name) {

    const plugin = this._plugins[name];

    if (!plugin)
      return false;

    if (!plugin.enabled)
      return false;

    if (plugin.started)
      return true;

    if (typeof plugin.instance.boot === "function")
      plugin.instance.boot();

    if (typeof plugin.instance.start === "function")
      plugin.instance.start();

    plugin.started = true;

    this._statistics.started++;

    return true;

  }

  stop(name) {

    const plugin = this._plugins[name];

    if (!plugin)
      return false;

    if (!plugin.started)
      return true;

    if (typeof plugin.instance.stop === "function")
      plugin.instance.stop();

    plugin.started = false;

    this._statistics.stopped++;

    return true;

  }

    //=========================================================================
  // Lookup
  //=========================================================================

  get(name) {

    return this._plugins[name]
      ? this._plugins[name].instance
      : null;

  }

  exists(name) {

    return !!this._plugins[name];

  }

  plugins() {

    return this._order.slice();

  }

  count() {

    return this._order.length;

  }

  started(name) {

    return !!(
      this._plugins[name] &&
      this._plugins[name].started
    );

  }

  //=========================================================================
  // Bulk Operations
  //=========================================================================

  startAll() {

    const self = this;

    this._order.forEach(function(name){

      self.start(name);

    });

    return this;

  }

  stopAll() {

    const self = this;

    this._order.forEach(function(name){

      self.stop(name);

    });

    return this;

  }

  enableAll() {

    const self = this;

    this._order.forEach(function(name){

      self.enable(name);

    });

    return this;

  }

  disableAll() {

    const self = this;

    this._order.forEach(function(name){

      self.disable(name);

    });

    return this;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      installed : this._statistics.installed,

      enabled : this._statistics.enabled,

      disabled : this._statistics.disabled,

      started : this._statistics.started,

      stopped : this._statistics.stopped,

      removed : this._statistics.removed,

      failures : this._statistics.failures,

      plugins : this.count()

    };

  }

  health() {

    return {

      initialized : this.isInitialized(),

      plugins : this.count(),

      healthy : true

    };

  }

  report() {

    return {

      plugins : this.plugins(),

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

WEF.PluginManager = new PluginManagerService();