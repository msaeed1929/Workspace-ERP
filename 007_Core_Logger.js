/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 07_Core_Logger.gs
 * Version     : 1.0.0
 * Description : Central Logging Service
 * =============================================================================
 */

'use strict';

class LoggerService extends BaseService {

  constructor() {

    super("Logger");

    this._levels = WEF.Constants.LogLevel;

    this._history = [];

    this._timers = {};

  }

  initialize() {

    super.initialize();

    return this;

  }

  /**
   * ===========================================================================
   * Generic Log
   * ===========================================================================
   */
  write(level, message, data) {

    const record = {

      timestamp: new Date(),

      level: level,

      service: this.getName(),

      user: WEF.Environment.getUser(),

      message: message,

      data: data || null

    };

    this._history.push(record);

    if (this._history.length > 1000) {

      this._history.shift();

    }

    Logger.log(record);

    return record;

  }

  /**
   * ===========================================================================
   * Info
   * ===========================================================================
   */
  info(message, data) {

    return this.write(this._levels.INFO, message, data);

  }

  /**
   * ===========================================================================
   * Warning
   * ===========================================================================
   */
  warning(message, data) {

    return this.write(this._levels.WARNING, message, data);

  }

  /**
   * ===========================================================================
   * Error
   * ===========================================================================
   */
  error(message, data) {

    return this.write(this._levels.ERROR, message, data);

  }

  /**
   * ===========================================================================
   * Debug
   * ===========================================================================
   */
  debug(message, data) {

    if (WEF.Config.environment() === "DEVELOPMENT") {

      return this.write(this._levels.DEBUG, message, data);

    }

  }

  /**
   * ===========================================================================
   * Exception
   * ===========================================================================
   */
  exception(error) {

    return this.write(

      this._levels.ERROR,

      error.message,

      error.stack

    );

  }

  history() {

    return this._history.slice();

  }

  clear() {

    this._history = [];

  }

  count() {

    return this._history.length;

  }

  last() {

    return this._history[this._history.length - 1] || null;

  }

  time(label) {

    this._timers = this._timers || {};

    this._timers[label] = new Date().getTime();

  }

  timeEnd(label) {

    if (!this._timers || !this._timers[label]) {

      return null;

    }

    const elapsed = new Date().getTime() - this._timers[label];

    delete this._timers[label];

    this.info(label + " completed", {

      elapsed: elapsed

    });

    return elapsed;

  }

}

/**
 * ===========================================================================
 * Register Service
 * ===========================================================================
 */

WEF.Logger = new LoggerService();

WEF.Logger.initialize();

function test_Logger() {

  WEF.Kernel.boot();

  WEF.Logger.info("ERP Started");

  WEF.Logger.warning("Low Stock");

  WEF.Logger.debug("Debug Mode");

  WEF.Logger.error("Sample Error");

  WEF.Logger.time("Import");

  Utilities.sleep(100);

  Logger.log(WEF.Logger.timeEnd("Import"));

  const last = WEF.Logger.last();

  Logger.log(last);

  Logger.log(last.level);

  Logger.log(last.timestamp);

}