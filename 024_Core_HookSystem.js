/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 24_Core_HookSystem.gs
 * Version     : 1.0.0
 * Description : Hook Management Service
 * =============================================================================
 */

'use strict';

class HookSystemService extends BaseService {

  constructor() {

    super("HookSystem");

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

    this._hooks = {};

    this._statistics = {

      registered : 0,
      executed   : 0,
      removed    : 0,
      failures   : 0,
      enabled    : 0,
      disabled   : 0

    };

    return this;

  }

  //=========================================================================
  // Registration
  //=========================================================================

  register(name, callback, priority) {

    if(typeof callback !== "function")
      throw new Error(
        "Hook callback must be a function."
      );

    priority = priority || 100;

    if(!this._hooks[name])
      this._hooks[name] = [];

    this._hooks[name].push({

      callback : callback,
      priority : priority,
      enabled  : true,
      once     : false

    });

    this._hooks[name].sort(function(a,b){

      return a.priority-b.priority;

    });

    this._statistics.registered++;

    return this;

  }

  once(name, callback, priority){

    this.register(
      name,
      callback,
      priority
    );

    const hook =
      this._hooks[name][
        this._hooks[name].length-1
      ];

    hook.once = true;

    return this;

  }

  //=========================================================================
  // Lookup
  //=========================================================================

  exists(name){

    return !!this._hooks[name];

  }

  hooks(){

    return Object.keys(this._hooks);

  }

  callbacks(name){

    if(!this.exists(name))
      return [];

    return this._hooks[name].slice();

  }

  count(name){

    if(name)
      return this.callbacks(name).length;

    return this.hooks().length;

  }

  //=========================================================================
  // Enable / Disable
  //=========================================================================

  enable(name){

    if(!this.exists(name))
      return this;

    this._hooks[name].forEach(function(h){

      h.enabled=true;

    });

    this._statistics.enabled++;

    return this;

  }

  disable(name){

    if(!this.exists(name))
      return this;

    this._hooks[name].forEach(function(h){

      h.enabled=false;

    });

    this._statistics.disabled++;

    return this;

  }

  isEnabled(name){

    if(!this.exists(name))
      return false;

    return this._hooks[name].some(function(h){

      return h.enabled;

    });

  }

  //=========================================================================
  // Removal
  //=========================================================================

  remove(name){

    if(!this.exists(name))
      return this;

    delete this._hooks[name];

    this._statistics.removed++;

    return this;

  }

  clear(){

    this.reset();

    return this;

  }

  //=========================================================================
  // Execution
  //=========================================================================

  execute(name, context) {

    if (!this.exists(name))
      return context;

    context = context || {};

    const removeIndexes = [];

    for (let i = 0; i < this._hooks[name].length; i++) {

      const hook = this._hooks[name][i];

      if (!hook.enabled)
        continue;

      try {

        const result = hook.callback(context);

        if (result !== undefined)
          context = result;

        this._statistics.executed++;

      } catch (error) {

        this._statistics.failures++;

        throw error;

      }

      if (hook.once)
        removeIndexes.push(i);

    }

    // Remove one-time hooks (reverse order)
    for (let i = removeIndexes.length - 1; i >= 0; i--) {

      this._hooks[name].splice(removeIndexes[i], 1);

    }

    if (this._hooks[name].length === 0)
      delete this._hooks[name];

    return context;

  }

  //=========================================================================
  // Pipeline Execution
  //=========================================================================

  executePipeline(names, context) {

    names = names || [];

    context = context || {};

    for (let i = 0; i < names.length; i++) {

      context = this.execute(names[i], context);

    }

    return context;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      hooks      : this.count(),
      registered : this._statistics.registered,
      executed   : this._statistics.executed,
      removed    : this._statistics.removed,
      enabled    : this._statistics.enabled,
      disabled   : this._statistics.disabled,
      failures   : this._statistics.failures

    };

  }

  //=========================================================================
  // Health
  //=========================================================================

  health() {

    return {

      initialized : this.isInitialized(),
      healthy     : this._statistics.failures === 0,
      hooks       : this.count()

    };

  }

  //=========================================================================
  // Report
  //=========================================================================

  report() {

    return {

      statistics : this.statistics(),
      health     : this.health(),
      hooks      : this.hooks()

    };

  }

  //=========================================================================
  // Information
  //=========================================================================

  info() {

    return {

      service     : this.getName(),
      version     : this.getVersion(),
      initialized : this.isInitialized(),
      created     : this.getCreatedTime(),
      statistics  : this.statistics()

    };

  }

}

//=============================================================================
// Framework Registration
//=============================================================================

WEF.HookSystem = new HookSystemService();