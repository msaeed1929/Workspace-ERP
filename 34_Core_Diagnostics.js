/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 34_Core_Diagnostics.gs
 * Version     : 1.0.0
 * Description : Framework Diagnostics Service
 * =============================================================================
 */

'use strict';

class DiagnosticsService extends BaseService {

  constructor() {

    super("Diagnostics");

    this.initialize();

  }

  initialize() {

    super.initialize();

    this.reset();

    return this;

  }

  reset() {

    this._results = [];

    this._statistics = {

      checks:0,
      passed:0,
      failed:0

    };

    return this;

  }

  //=========================================================================
  // Diagnostics
  //=========================================================================

  check(name, passed, details) {

    const result = {

      name:name,

      passed:!!passed,

      details:details || "",

      time:new Date()

    };

    this._results.push(result);

    this._statistics.checks++;

    if (passed)
      this._statistics.passed++;
    else
      this._statistics.failed++;

    return result;

  }

  results() {

    return this._results.slice();

  }

  count() {

    return this._results.length;

  }

  clear() {

    this.reset();

    return true;

  }

  //=========================================================================
  // Framework Scan
  //=========================================================================

  scan() {

    this.clear();

    const services = [

      "Logger",
      "Validator",
      "Config",
      "Cache",
      "Scheduler",
      "LockManager",
      "HookSystem",
      "PluginManager",
      "API",
      "Security",
      "Authentication",
      "Authorization",
      "Workflow",
      "Notification",
      "Backup",
      "Monitor"

    ];

    services.forEach(function(service){

      const instance = WEF[service];

      this.check(

        service,

        !!instance,

        instance
          ? "Service available."
          : "Service missing."

      );

    }, this);

    return this.results();

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      checks: this._statistics.checks,
      passed: this._statistics.passed,
      failed: this._statistics.failed

    };

  }

  health() {

    return {

      initialized: this.isInitialized(),
      healthy: this._statistics.failed === 0,
      checks: this._statistics.checks,
      passed: this._statistics.passed,
      failed: this._statistics.failed

    };

  }

  report() {

    return {

      results: this.results(),

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

WEF.Diagnostics =
  new DiagnosticsService();