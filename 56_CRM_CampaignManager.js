/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 56_CRM_CampaignManager.gs
 * Version     : 1.0.0
 * Description : CRM Campaign Manager
 * =============================================================================
 */

'use strict';

class CRMCampaignManager extends BaseService {

  constructor() {

    super("CRMCampaignManager");

    this.initialize();

  }

  initialize() {

    super.initialize();

    this._campaigns = {};

    return this;

  }

  //=========================================================================
  // Campaigns
  //=========================================================================

  create(code, campaign) {

    if (this.exists(code))
      return null;

    this._campaigns[code] = campaign;

    return campaign;

  }

  exists(code) {

    return !!this._campaigns[code];

  }

  get(code) {

    return this._campaigns[code] || null;

  }

  update(code, campaign) {

    if (!this.exists(code))
      return null;

    this._campaigns[code] = campaign;

    return campaign;

  }

  remove(code) {

    if (!this.exists(code))
      return false;

    delete this._campaigns[code];

    return true;

  }

  all() {

    return this._campaigns;

  }

  codes() {

    return Object.keys(this._campaigns);

  }

  count() {

    return this.codes().length;

  }

  //=========================================================================
  // Campaign Status
  //=========================================================================

  activate(code) {

    if (!this.exists(code))
      return false;

    this._campaigns[code].active = true;

    return true;

  }

  deactivate(code) {

    if (!this.exists(code))
      return false;

    this._campaigns[code].active = false;

    return true;

  }

  active() {

    var campaigns = {};

    Object.keys(this._campaigns).forEach(function(code){

      if (this._campaigns[code].active)
        campaigns[code] = this._campaigns[code];

    }, this);

    return campaigns;

  }

  inactive() {

    var campaigns = {};

    Object.keys(this._campaigns).forEach(function(code){

      if (!this._campaigns[code].active)
        campaigns[code] = this._campaigns[code];

    }, this);

    return campaigns;

  }

  //=========================================================================
  // Maintenance
  //=========================================================================

  clear() {

    this._campaigns = {};

    return true;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      campaigns: this.count(),
      active: Object.keys(this.active()).length,
      inactive: Object.keys(this.inactive()).length

    };

  }

  health() {

    return {

      initialized: this.isInitialized(),
      healthy: true,
      campaigns: this.count(),
      active: Object.keys(this.active()).length,
      inactive: Object.keys(this.inactive()).length

    };

  }

  report() {

    return {

      campaigns: this.codes(),
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

//==============================================================================
// CRM Registration
//==============================================================================function bootCRMCampaignManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "CRM",
      "CampaignManager",
      new CRMCampaignManager()
    );
  }
}