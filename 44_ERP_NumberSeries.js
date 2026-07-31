/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 44_ERP_NumberSeries.gs
 * Version     : 1.0.0
 * Description : ERP Number Series
 * =============================================================================
 */

'use strict';

class ERPNumberSeries extends BaseService {

  constructor() {

    super("ERPNumberSeries");

    this.initialize();

  }

  initialize() {

    super.initialize();

    this._series = {};

    return this;

  }

  //=========================================================================
  // Series
  //=========================================================================

  register(name, options) {

    options = options || {};

    this._series[name] = {

      prefix : options.prefix || "",
      suffix : options.suffix || "",
      next : options.start || 1,
      padding : options.padding || 6

    };

    return this._series[name];

  }

  exists(name) {

    return !!this._series[name];

  }

  get(name) {

    return this._series[name] || null;

  }

  names() {

    return Object.keys(this._series);

  }

  count() {

    return this.names().length;

  }

  //=========================================================================
  // Number Generation
  //=========================================================================

  peek(name) {

    var series = this.get(name);

    if (!series)
      return null;

    return series.prefix +
      String(series.next).padStart(series.padding, "0") +
      series.suffix;

  }

  next(name) {

    var series = this.get(name);

    if (!series)
      return null;

    var number = this.peek(name);

    series.next++;

    return number;

  }

  reset(name, start) {

    var series = this.get(name);

    if (!series)
      return false;

    series.next = start || 1;

    return true;

  }

  //=========================================================================
  // Maintenance
  //=========================================================================

  remove(name) {

    if (!this.exists(name))
      return false;

    delete this._series[name];

    return true;

  }

  clear() {

    this._series = {};

    return true;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      series : this.count()

    };

  }

  health() {

    return {

      initialized : this.isInitialized(),
      healthy : true,
      series : this.count()

    };

  }

  report() {

    return {

      series : this.names(),
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
