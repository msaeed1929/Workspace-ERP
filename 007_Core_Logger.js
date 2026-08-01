/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 007_Core_Logger.gs
 * Version     : 3.2.0
 * Description : Central Logging Service
 * Author      : OpenAI + Muhammad Saeed Anser
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

          environment: WEF.Config.get("ENVIRONMENT"),

          frameworkVersion: WEF.Info.version,

          frameworkBuild: WEF.Info.build,

          message: message,

          data: data || null

      };

      this._history.push(record);

      if (this._history.length > 1000) {

          this._history.shift();

      }

      Logger.log(

          "[" +
          level +
          "] " +
          message

      );

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

  success(message,data){

      return this.write(

          "SUCCESS",

          message,

          data

      );

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

  fatal(message,data){

      return this.write(

          "FATAL",

          message,

          data

      );

  }

  /**
   * ===========================================================================
   * Debug
   * ===========================================================================
   */
  debug(message, data) {

    if (
        WEF.Config.get("DEBUG") &&
        WEF.Config.get("ENVIRONMENT") === "DEVELOPMENT"
    ) {

        return this.write(
            this._levels.DEBUG,
            message,
            data
        );

    }

    return null;

  }

  trace(message,data){

      return this.write(

          "TRACE",

          message,

          data

      );

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

  search(level){

      return this._history.filter(function(log){

          return log.level===level;

      });

  }

  export(){

      return JSON.stringify(

          this._history,

          null,

          2

      );

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

    this._timers[label] = Date.now();

  }

  timeEnd(label) {

    if (!this._timers || !this._timers[label]) {

      return null;

    }

    const elapsed=Date.now()-this._timers[label];

    delete this._timers[label];

    this.info(label + " completed", {

      elapsed: elapsed

    });

    return elapsed;

  }

  statistics(){

      return{

          total:this.count(),

          info:this.search("INFO").length,

          warning:this.search("WARNING").length,

          error:this.search("ERROR").length,

          debug:this.search("DEBUG").length,

          trace:this.search("TRACE").length

      };

  }

}

/**
 * ===========================================================================
 * Register Service
 * ===========================================================================
 */

WEF.Logger = new LoggerService();

WEF.Logger.initialize();

if(!WEF.ServiceRegistry.has("Logger")){

    WEF.ServiceRegistry.register(

        "Logger",

        WEF.Logger

    );

}

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

  Logger.log(WEF.Logger.count());

  Logger.log(WEF.Logger.statistics());

  Logger.log(WEF.Logger.search("ERROR"));

  Logger.log(WEF.Logger.export());

  WEF.Logger.success("Import Finished");

  WEF.Logger.trace("Trace Message");

  WEF.Logger.fatal("Fatal Example");

}