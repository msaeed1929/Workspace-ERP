/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 32_Core_Backup.gs
 * Version     : 1.0.0
 * Description : Backup Service
 * =============================================================================
 */

'use strict';

class BackupService extends BaseService {

  constructor() {

    super("Backup");

    this.initialize();

  }

  initialize() {

    super.initialize();

    this.reset();

    return this;

  }

  reset() {

    this._backups = {};

    this._statistics = {

      backups:0,
      restores:0,
      exports:0,
      imports:0,
      failures:0

    };

    return this;

  }

  //=========================================================================
  // Backup
  //=========================================================================

  create(name, data) {

    this._backups[name] = {

      name:name,

      created:new Date(),

      data:data || {}

    };

    this._statistics.backups++;

    return true;

  }

  exists(name) {

    return !!this._backups[name];

  }

  get(name) {

    return this._backups[name] || null;

  }

  remove(name) {

    if (!this.exists(name))
      return false;

    delete this._backups[name];

    return true;

  }

  backups() {

    return Object.keys(this._backups);

  }

  backupCount() {

    return this.backups().length;

  }

  //=========================================================================
  // Restore
  //=========================================================================

  restore(name) {

    if (!this.exists(name)) {

      this._statistics.failures++;

      throw new Error(
        "Backup not found."
      );

    }

    this._statistics.restores++;

    return this._backups[name].data;

  }

  //=========================================================================
  // Export / Import
  //=========================================================================

  export(name) {

    if (!this.exists(name)) {

      this._statistics.failures++;

      throw new Error(
        "Backup not found."
      );

    }

    this._statistics.exports++;

    return JSON.stringify(
      this._backups[name]
    );

  }

  import(json) {

    const backup = JSON.parse(json);

    this._backups[backup.name] = backup;

    this._statistics.imports++;

    return true;

  }

  //=========================================================================
  // Maintenance
  //=========================================================================

  clear() {

    this._backups = {};

    return true;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      backups:this.backupCount(),
      restores:this._statistics.restores,
      exports:this._statistics.exports,
      imports:this._statistics.imports,
      failures:this._statistics.failures

    };

  }

  health() {

    return {

      initialized:this.isInitialized(),
      healthy:true,
      backups:this.backupCount()

    };

  }

  report() {

    return {

      backups:this.backups(),

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

WEF.Backup =
  new BackupService();