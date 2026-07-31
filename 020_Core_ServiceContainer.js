/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 20_Core_ServiceContainer.gs
 * Version     : 1.0.0
 * Description : Dependency Injection & Service Container
 * =============================================================================
 */

'use strict';

class ServiceContainer extends BaseService {

  constructor() {

    super("ServiceContainer");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this.reset();

    return this;

  }

  reset() {

    this._bindings = {};

    this._singletons = {};

    this._instances = {};

    this._aliases = {};

    this._resolved = {};

    this._building = [];

    this._frozen = false;

    this._locked = false;

    this._statistics = {

      bindings:0,

      singletons:0,

      instances:0,

      aliases:0,

      resolved:0,

      removed:0

    };

    return this;

  }

  //=========================================================================
  // Registration
  //=========================================================================

  bind(name, constructor) {

    this.ensureUnlocked();

    if (!name)
      throw new Error(
        "Service name is required."
      );

    if (typeof constructor !== "function")
      throw new Error(
        "Constructor must be a function."
      );

    this._bindings[name] = constructor;

    this._statistics.bindings++;

    return this;

  }

  singleton(name, constructor) {

    this.ensureUnlocked();

    if (!name)
      throw new Error(
        "Service name is required."
      );

    if (typeof constructor !== "function")
      throw new Error(
        "Constructor must be a function."
      );

    this._singletons[name] = constructor;

    this._statistics.singletons++;

    return this;

  }

  instance(name, object) {

    this.ensureUnlocked();

    if (!name)
      throw new Error(
        "Service name is required."
      );

    this._instances[name] = object;

    this._statistics.instances++;

    return this;

  }

  alias(alias, service) {

    this.ensureUnlocked();

    this._aliases[alias] = service;

    this._statistics.aliases++;

    return this;

  }

  //=========================================================================
  // Exists
  //=========================================================================

  has(name) {

    name = this.resolveAlias(name);

    return (

      this._bindings.hasOwnProperty(name) ||

      this._singletons.hasOwnProperty(name) ||

      this._instances.hasOwnProperty(name)

    );

  }

  exists(name) {

    return this.has(name);

  }

  //=========================================================================
  // Remove
  //=========================================================================

  remove(name) {

    this.ensureUnlocked();

    name = this.resolveAlias(name);

    delete this._bindings[name];

    delete this._singletons[name];

    delete this._instances[name];

    delete this._resolved[name];

    this._statistics.removed++;

    return this;

  }

  clear() {

    this.ensureUnlocked();

    return this.reset();

  }

  /**
   * ============================================================================
   * Register Module Service
   * ============================================================================
   */
  registerModuleService(moduleName, serviceName, instance) {


    if (!moduleName) {

      throw new Error(
        "Module name is required."
      );

    }


    if (!serviceName) {

      throw new Error(
        "Service name is required."
      );

    }


    if (!WEF.Modules) {

        WEF.Modules = Object.create(null);

    }

    if (!WEF.Modules[moduleName]) {

        WEF.Modules[moduleName] =
            Object.create(null);

    }


    // Register inside module namespace

    Object.defineProperty(
      WEF.Modules[moduleName],
      serviceName,
      {
        value: instance,
        writable: false,
        configurable: false,
        enumerable: true
      }
    );


    // Register inside Service Container

    this.instance(
      moduleName + "." + serviceName,
      instance
    );


    return instance;

  }

  /**
   * ============================================================================
   * Get Module Service
   * ============================================================================
   */
  getModuleService(moduleName, serviceName) {

    return this.make(
      moduleName + "." + serviceName
    );

  }

  /**
   * ============================================================================
   * Has Module Service
   * ============================================================================
   */
  hasModuleService(moduleName, serviceName) {

    return this.has(
      moduleName + "." + serviceName
    );

  }

/**
 * ============================================================================
 * Remove Module Service
 * ============================================================================
 */
removeModuleService(moduleName, serviceName) {

  delete WEF.Modules[moduleName][serviceName];

  return this.remove(
      moduleName + "." + serviceName
  );

}

/**
 * ============================================================================
 * List Module Services
 * ============================================================================
 */
listModuleServices(moduleName) {

  if (!WEF.Modules[moduleName]) {

    return [];

  }

  return Object.keys(
      WEF.Modules[moduleName]
  );

}

  //=========================================================================
  // Alias
  //=========================================================================

  resolveAlias(name) {

    if (this._aliases[name])

      return this._aliases[name];

    return name;

  }

  aliases() {

    return Object.assign({}, this._aliases);

  }

  //=========================================================================
  // Freeze / Lock
  //=========================================================================

  freeze() {

    this._frozen = true;

    return this;

  }

  unfreeze() {

    this._frozen = false;

    return this;

  }

  isFrozen() {

    return this._frozen;

  }

  lock() {

    this._locked = true;

    return this;

  }

  unlock() {

    this._locked = false;

    return this;

  }

  isLocked() {

    return this._locked;

  }

  ensureUnlocked() {

    if (this._locked)
      throw new Error(
        "Service Container is locked."
      );

    if (this._frozen)
      throw new Error(
        "Service Container is frozen."
      );

  }

  //=========================================================================
  // Enumeration
  //=========================================================================

  keys() {

    return Object.keys(

      Object.assign(

        {},

        this._bindings,

        this._singletons,

        this._instances

      )

    );

  }

  count() {

    return this.keys().length;

  }

    //=========================================================================
  // Resolve Services
  //=========================================================================

  get(name) {

    name = this.resolveAlias(name);

    if (!this.has(name))
      throw new Error(
        "Service '" + name + "' is not registered."
      );

    // Existing instance
    if (this._instances[name]) {

      this._statistics.resolved++;

      return this._instances[name];

    }

    // Singleton
    if (this._singletons[name]) {

      if (!this._resolved[name]) {

        this._resolved[name] =
          this.build(name, this._singletons[name]);

      }

      this._statistics.resolved++;

      return this._resolved[name];

    }

    // Transient Binding

    this._statistics.resolved++;

    return this.build(
      name,
      this._bindings[name]
    );

  }

  resolve(name) {

    return this.get(name);

  }

  make(name) {

    return this.get(name);

  }

  create(name) {

    return this.get(name);

  }

  //=========================================================================
  // Object Builder
  //=========================================================================

  build(name, constructor) {

    if (this._building.indexOf(name) !== -1) {

      throw new Error(

        "Circular dependency detected: " +

        this._building.join(" -> ") +

        " -> " +

        name

      );

    }

    this._building.push(name);

    try {

      let object;

      try {

          object = new constructor(this);

      } catch (e) {

          object = constructor(this);

      }

      if (
        object &&
        typeof object.initialize === "function"
      ) {

        object.initialize();

      }

      return object;

    }

    finally {

      this._building.pop();

    }

  }

  //=========================================================================
  // Factory Registration
  //=========================================================================

  factory(name, callback) {

    return this.bind(name, callback);

  }

  //=========================================================================
  // Lazy Registration
  //=========================================================================

  lazy(name, callback) {

    return this.singleton(name, callback);

  }

  //=========================================================================
  // Build Existing Object
  //=========================================================================

  buildInstance(callback) {

    if (typeof callback !== "function")
      throw new Error(
        "Builder must be a function."
      );

    return callback(this);

  }

  //=========================================================================
  // Bulk Registration
  //=========================================================================

  register(services) {

    Object.keys(services).forEach(name => {

      this.bind(

        name,

        services[name]

      );

    });

    return this;

  }

  //=========================================================================
  // Resolve Multiple
  //=========================================================================

  resolveMany(names) {

    return names.map(name =>

      this.get(name)

    );

  }

  //=========================================================================
  // Registered Names
  //=========================================================================

  bindings() {

    return Object.keys(this._bindings);

  }

  singletons() {

    return Object.keys(this._singletons);

  }

  instances() {

    return Object.keys(this._instances);

  }

  resolved() {

    return Object.keys(this._resolved);

  }

  building() {

    return this._building.slice();

  }

  isBuilding() {

    return this._building.length > 0;

  }

  //=========================================================================
  // Flush Resolved Objects
  //=========================================================================

  flush() {

    this._resolved = {};

    return this;

  }

    //=========================================================================
  // Boot Services
  //=========================================================================

  boot() {

    this.keys().forEach(name => {

      const service = this.get(name);

      if (
        service &&
        typeof service.boot === "function"
      ) {

        service.boot();

      }

    });

    return this;

  }

  //=========================================================================
  // Refresh Service
  //=========================================================================

  refresh(name) {

    name = this.resolveAlias(name);

    delete this._resolved[name];

    return this.get(name);

  }

  //=========================================================================
  // Replace Existing Instance
  //=========================================================================

  replace(name, instance) {

      name = this.resolveAlias(name);

      if (this._instances[name]) {

          this._instances[name] = instance;

      } else {

          this._resolved[name] = instance;

      }

      return this;

  }

  //=========================================================================
  // Export / Import
  //=========================================================================

  export() {

    return {

      bindings: this.bindings(),

      singletons: this.singletons(),

      instances: this.instances(),

      aliases: this.aliases()

    };

  }

  import(configuration) {

    if (!configuration)
      return this;

    if (configuration.aliases) {

      this._aliases = configuration.aliases;

    }

    return this;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      bindings: Object.keys(this._bindings).length,

      singletons: Object.keys(this._singletons).length,

      instances: Object.keys(this._instances).length,

      aliases: Object.keys(this._aliases).length,

      resolved: Object.keys(this._resolved).length,

      building: this._building.length,

      frozen: this._frozen,

      locked: this._locked

    };

  }

  //=========================================================================
  // Health
  //=========================================================================

  health() {

    return {

      initialized: this.isInitialized(),

      services: this.count(),

      frozen: this._frozen,

      locked: this._locked,

      building: this.isBuilding()

    };

  }

  //=========================================================================
  // Report
  //=========================================================================

  report() {

    return {

      statistics: this.statistics(),

      health: this.health(),

      services: this.keys(),

      aliases: this.aliases()

    };

  }

  //=========================================================================
  // Info
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

WEF.ServiceContainer =
  new ServiceContainer();