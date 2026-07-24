/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 33_Core_Monitor.gs
 * Version     : 1.0.0
 * Description : Runtime Monitor Service
 * =============================================================================
 */

'use strict';

class MonitorService extends BaseService {

  constructor() {

    super("Monitor");

    this.initialize();

  }

  initialize() {

    super.initialize();

    this.reset();

    return this;

  }

  reset() {

    this._metrics = {};

    this._events = [];

    this._statistics = {

      metrics:0,
      events:0,
      increments:0,
      failures:0

    };

    return this;

  }

  //=========================================================================
  // Metrics
  //=========================================================================

  set(name, value) {

    this._metrics[name] = value;

    this._statistics.metrics =
      this.metricCount();

    return true;

  }

  get(name) {

    return this._metrics[name];

  }

  has(name) {

    return this._metrics.hasOwnProperty(name);

  }

  increment(name, amount) {

    amount = amount || 1;

    if (!this.has(name))
      this._metrics[name] = 0;

    this._metrics[name] += amount;

    this._statistics.increments++;

    this._statistics.metrics =
      this.metricCount();

    return this._metrics[name];

  }

  remove(name) {

    if (!this.has(name))
      return false;

    delete this._metrics[name];

    this._statistics.metrics =
      this.metricCount();

    return true;

  }

  metrics() {

    return Object.assign({}, this._metrics);

  }

  metricCount() {

    return Object.keys(this._metrics).length;

  }

  //=========================================================================
  // Events
  //=========================================================================

  log(event, details) {

    this._events.push({

      event:event,

      details:details || {},

      time:new Date()

    });

    this._statistics.events++;

    return true;

  }

  events() {

    return this._events.slice();

  }

  eventCount() {

    return this._events.length;

  }

  //=========================================================================
  // Maintenance
  //=========================================================================

  clearMetrics() {

    this._metrics = {};

    this._statistics.metrics = 0;

    return true;

  }

  clearEvents() {

    this._events = [];

    this._statistics.events = 0;

    return true;

  }

  clear() {

    this.clearMetrics();

    this.clearEvents();

    return true;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      metrics:this.metricCount(),
      events:this.eventCount(),
      increments:this._statistics.increments,
      failures:this._statistics.failures

    };

  }

  health() {

    return {

      initialized:this.isInitialized(),
      healthy:true,
      metrics:this.metricCount(),
      events:this.eventCount()

    };

  }

  report() {

    return {

      metrics:this.metrics(),

      events:this.events(),

      statistics:this.statistics(),

      health:this.health()

    };

  }

  info() {

    return {

      service:this.getName(),

      version:this.getVersion(),

      initialized:this.isInitialized(),

      created:this.getCreatedTime(),

      statistics:this.statistics()

    };

  }

}

WEF.Monitor =
  new MonitorService();