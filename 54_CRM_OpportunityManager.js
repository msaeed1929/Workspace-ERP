/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 54_CRM_OpportunityManager.gs
 * Version     : 1.0.0
 * Description : CRM Opportunity Manager
 * =============================================================================
 */

'use strict';

class CRMOpportunityManager extends BaseService {

  constructor() {

    super("CRMOpportunityManager");

    this.initialize();

  }

  initialize() {

    super.initialize();

    this._opportunities = {};

    return this;

  }

  //=========================================================================
  // Opportunities
  //=========================================================================

  create(code, opportunity) {

    if (this.exists(code))
      return null;

    this._opportunities[code] = opportunity;

    return opportunity;

  }

  exists(code) {

    return !!this._opportunities[code];

  }

  get(code) {

    return this._opportunities[code] || null;

  }

  update(code, opportunity) {

    if (!this.exists(code))
      return null;

    this._opportunities[code] = opportunity;

    return opportunity;

  }

  remove(code) {

    if (!this.exists(code))
      return false;

    delete this._opportunities[code];

    return true;

  }

  all() {

    return this._opportunities;

  }

  codes() {

    return Object.keys(this._opportunities);

  }

  count() {

    return this.codes().length;

  }

  //=========================================================================
  // Opportunity Status
  //=========================================================================

  win(code) {

    if (!this.exists(code))
      return false;

    this._opportunities[code].status = "Won";

    return true;

  }

  lose(code) {

    if (!this.exists(code))
      return false;

    this._opportunities[code].status = "Lost";

    return true;

  }

  open(code) {

    if (!this.exists(code))
      return false;

    this._opportunities[code].status = "Open";

    return true;

  }

  won() {

    var opportunities = {};

    Object.keys(this._opportunities).forEach(function(code){

      if (this._opportunities[code].status === "Won")
        opportunities[code] = this._opportunities[code];

    }, this);

    return opportunities;

  }

  lost() {

    var opportunities = {};

    Object.keys(this._opportunities).forEach(function(code){

      if (this._opportunities[code].status === "Lost")
        opportunities[code] = this._opportunities[code];

    }, this);

    return opportunities;

  }

  openOpportunities() {

    var opportunities = {};

    Object.keys(this._opportunities).forEach(function(code){

      if (this._opportunities[code].status === "Open")
        opportunities[code] = this._opportunities[code];

    }, this);

    return opportunities;

  }

  //=========================================================================
  // Maintenance
  //=========================================================================

  clear() {

    this._opportunities = {};

    return true;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      opportunities : this.count(),
      open : Object.keys(this.openOpportunities()).length,
      won : Object.keys(this.won()).length,
      lost : Object.keys(this.lost()).length

    };

  }

  health() {

    return {

      initialized : this.isInitialized(),
      healthy : true,
      opportunities : this.count(),
      open : Object.keys(this.openOpportunities()).length,
      won : Object.keys(this.won()).length,
      lost : Object.keys(this.lost()).length

    };

  }

  report() {

    return {

      opportunities : this.codes(),
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
//==============================================================================function bootCRMOpportunityManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "CRM",
      "OpportunityManager",
      new CRMOpportunityManager()
    );
  }
}