/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 52_CRM_LeadManager.gs
 * Version     : 1.0.0
 * Description : CRM Lead Manager
 * =============================================================================
 */

'use strict';

class CRMLeadManager extends BaseService {

  constructor() {

    super("CRMLeadManager");

    this.initialize();

  }

  initialize() {

    super.initialize();

    this._leads = {};

    return this;

  }

  //=========================================================================
  // Leads
  //=========================================================================

  create(code, lead) {

    if (this.exists(code))
      return null;

    this._leads[code] = lead;

    return lead;

  }

  exists(code) {

    return !!this._leads[code];

  }

  get(code) {

    return this._leads[code] || null;

  }

  update(code, lead) {

    if (!this.exists(code))
      return null;

    this._leads[code] = lead;

    return lead;

  }

  remove(code) {

    if (!this.exists(code))
      return false;

    delete this._leads[code];

    return true;

  }

  all() {

    return this._leads;

  }

  codes() {

    return Object.keys(this._leads);

  }

  count() {

    return this.codes().length;

  }

  //=========================================================================
  // Lead Status
  //=========================================================================

  qualify(code) {

    if (!this.exists(code))
      return false;

    this._leads[code].qualified = true;

    return true;

  }

  disqualify(code) {

    if (!this.exists(code))
      return false;

    this._leads[code].qualified = false;

    return true;

  }

  qualifiedLeads() {

    var leads = {};

    Object.keys(this._leads).forEach(function(code) {

      if (this._leads[code].qualified)
        leads[code] = this._leads[code];

    }, this);

    return leads;

  }

  disqualifiedLeads() {

    var leads = {};

    Object.keys(this._leads).forEach(function(code) {

      if (!this._leads[code].qualified)
        leads[code] = this._leads[code];

    }, this);

    return leads;

  }

  //=========================================================================
  // Maintenance
  //=========================================================================

  clear() {

    this._leads = {};

    return true;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      leads : this.count(),
      qualified : Object.keys(this.qualifiedLeads()).length,
      disqualified : Object.keys(this.disqualifiedLeads()).length

    };

  }

  health() {

    return {

      initialized : this.isInitialized(),
      healthy : true,
      leads : this.count(),
      qualified : Object.keys(this.qualifiedLeads()).length,
      disqualified : Object.keys(this.disqualifiedLeads()).length

    };

  }

  report() {

    return {

      leads : this.codes(),
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
// CRM Registration
//==============================================================================

WEF.ServiceContainer.registerModuleService(
  "CRM",
  "LeadManager",
  new CRMLeadManager()
);