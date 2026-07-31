/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 59_CRM_PipelineManager.gs
 * Version     : 1.0.0
 * Description : CRM Pipeline Manager
 * =============================================================================
 */

'use strict';

class CRMPipelineManager extends BaseService {

  constructor() {

    super("CRMPipelineManager");

    this.initialize();

  }

  initialize() {

    super.initialize();

    this._stages = {};
    this._pipeline = {};

    return this;

  }

  //=========================================================================
  // Stage Management
  //=========================================================================

  register(stage, data) {

    if (this.exists(stage))
      return null;

    this._stages[stage] = data;

    return data;

  }

  exists(stage) {

    return !!this._stages[stage];

  }

  get(stage) {

    return this._stages[stage] || null;

  }

  update(stage, data) {

    if (!this.exists(stage))
      return null;

    this._stages[stage] = data;

    return data;

  }

  remove(stage) {

    if (!this.exists(stage))
      return false;

    delete this._stages[stage];

    return true;

  }

  all() {

    return this._stages;

  }

  stages() {

    return Object.keys(this._stages);

  }

  count() {

    return this.stages().length;

  }

  //=========================================================================
  // Opportunity Pipeline
  //=========================================================================

  move(opportunityId, stage) {

    if (!this.exists(stage))
      return false;

    this._pipeline[opportunityId] = stage;

    return true;

  }

  stage(opportunityId) {

    return this._pipeline[opportunityId] || null;

  }

  byStage(stage) {

    var opportunities = {};

    Object.keys(this._pipeline).forEach(function(id){

      if (this._pipeline[id] === stage)
        opportunities[id] = stage;

    }, this);

    return opportunities;

  }

  //=========================================================================
  // Maintenance
  //=========================================================================

  clear() {

    this._stages = {};
    this._pipeline = {};

    return true;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      stages: this.count(),
      opportunities: Object.keys(this._pipeline).length

    };

  }

  health() {

    return {

      initialized: this.isInitialized(),
      healthy: true,
      stages: this.count(),
      opportunities: Object.keys(this._pipeline).length

    };

  }

  report() {

    return {

      stages: this.stages(),
      pipeline: this._pipeline,
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
//==============================================================================function bootCRMPipelineManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "CRM",
      "PipelineManager",
      new CRMPipelineManager()
    );
  }
}