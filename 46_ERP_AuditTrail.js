/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 46_ERP_AuditTrail.gs
 * Version     : 1.0.0
 * Description : ERP Audit Trail
 * =============================================================================
 */

'use strict';

class ERPAuditTrail extends BaseService {

  constructor() {

    super("ERPAuditTrail");

    this.initialize();

  }

  initialize() {

    super.initialize();

    this._entries = [];

    return this;

  }

  //=========================================================================
  // Audit Entries
  //=========================================================================

  log(user, module, action, details) {

    var entry = {

      id : Utilities.getUuid(),
      time : new Date(),
      user : user,
      module : module,
      action : action,
      details : details || {}

    };

    this._entries.push(entry);

    return entry;

  }

  entries() {

    return this._entries;

  }

  count() {

    return this._entries.length;

  }

  //=========================================================================
  // Filters
  //=========================================================================

  byUser(user) {

    return this._entries.filter(function(entry){

      return entry.user === user;

    });

  }

  byModule(module) {

    return this._entries.filter(function(entry){

      return entry.module === module;

    });

  }

  byAction(action) {

    return this._entries.filter(function(entry){

      return entry.action === action;

    });

  }

  latest() {

    if (!this.count())
      return null;

    return this._entries[this.count() - 1];

  }

  //=========================================================================
  // Maintenance
  //=========================================================================

  clear() {

    this._entries = [];

    return true;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      entries : this.count()

    };

  }

  health() {

    return {

      initialized : this.isInitialized(),
      healthy : true,
      entries : this.count()

    };

  }

  report() {

    return {

      entries : this.entries(),
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

//==============================================================================
// ERP Registration
//==============================================================================

ERP.AuditTrail = new ERPAuditTrail();