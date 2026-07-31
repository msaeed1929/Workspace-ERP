/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 48_ERP_EventBus.gs
 * Version     : 1.0.0
 * Description : ERP Event Bus
 * =============================================================================
 */

'use strict';

class ERPEventBus extends BaseService {

  constructor() {

    super("ERPEventBus");

    this.initialize();

  }

  initialize() {

    super.initialize();

    this._events = {};
    this._history = [];

    return this;

  }

  //=========================================================================
  // Events
  //=========================================================================

  register(name) {

    if (!this._events[name]) {

      this._events[name] = [];

    }

    return this._events[name];

  }

  exists(name) {

    return !!this._events[name];

  }

  event(name) {

    return this._events[name] || null;

  }

  events() {

    return Object.keys(this._events);

  }

  count() {

    return this.events().length;

  }

  //=========================================================================
  // Subscribers
  //=========================================================================

  subscribe(name, listener) {

    this.register(name);

    this._events[name].push(listener);

    return true;

  }

  unsubscribe(name, listener) {

    if (!this.exists(name))
      return false;

    var index = this._events[name].indexOf(listener);

    if (index === -1)
      return false;

    this._events[name].splice(index, 1);

    return true;

  }

  subscribers(name) {

    if (!this.exists(name))
      return [];

    return this._events[name];

  }

  subscriberCount(name) {

    if (!this.exists(name))
      return 0;

    return this._events[name].length;

  }

  //=========================================================================
  // Publish
  //=========================================================================

  publish(name, payload) {

    if (!this.exists(name))
      return false;

    var entry = {

      event : name,
      payload : payload,
      time : new Date()

    };

    this._history.push(entry);

    this._events[name].forEach(function(listener){

      listener(payload);

    });

    return true;

  }

  history() {

    return this._history;

  }

  historyCount() {

    return this._history.length;

  }

  //=========================================================================
  // Maintenance
  //=========================================================================

  clear(name) {

    if (!this.exists(name))
      return false;

    this._events[name] = [];

    return true;

  }

  clearHistory() {

    this._history = [];

    return true;

  }

  clearAll() {

    this._events = {};
    this._history = [];

    return true;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    var subscribers = 0;

    this.events().forEach(function(name){

      subscribers += this.subscriberCount(name);

    }, this);

    return {

      events : this.count(),
      subscribers : subscribers,
      history : this.historyCount()

    };

  }

  health() {

    return {

      initialized : this.isInitialized(),
      healthy : true,
      events : this.count(),
      subscribers : this.statistics().subscribers,
      history : this.historyCount()

    };

  }

  report() {

    return {

      events : this.events(),
      history : this.history(),
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
