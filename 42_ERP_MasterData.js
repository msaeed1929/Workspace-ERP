/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 42_ERP_MasterData.gs
 * Version     : 1.0.0
 * Description : ERP Master Data Manager
 * =============================================================================
 */

'use strict';

class ERPMasterData extends BaseService {

  constructor() {

    super("ERPMasterData");

    this.initialize();

  }

  initialize() {

    super.initialize();

    this._entities = {};

    return this;

  }

  //=========================================================================
  // Entity Registration
  //=========================================================================

  register(name) {

    if (!this._entities[name]) {

      this._entities[name] = {};

    }

    return this._entities[name];

  }

  exists(name) {

    return !!this._entities[name];

  }

  entity(name) {

    return this._entities[name] || null;

  }

  entities() {

    return Object.keys(this._entities);

  }

  count() {

    return this.entities().length;

  }

  //=========================================================================
  // Records
  //=========================================================================

  add(entity, id, data) {

    this.register(entity);

    this._entities[entity][id] = data;

    return data;

  }

  get(entity, id) {

    if (!this.exists(entity))
      return null;

    return this._entities[entity][id] || null;

  }

  update(entity, id, data) {

    if (!this.get(entity, id))
      return null;

    this._entities[entity][id] = data;

    return data;

  }

  remove(entity, id) {

    if (!this.get(entity, id))
      return false;

    delete this._entities[entity][id];

    return true;

  }

  all(entity) {

    if (!this.exists(entity))
      return {};

    return this._entities[entity];

  }

  recordCount(entity) {

    if (!this.exists(entity))
      return 0;

    return Object.keys(this._entities[entity]).length;

  }

  //=========================================================================
  // Maintenance
  //=========================================================================

  clear(entity) {

    if (!this.exists(entity))
      return false;

    this._entities[entity] = {};

    return true;

  }

  clearAll() {

    this._entities = {};

    return true;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    var records = 0;

    this.entities().forEach(function(entity){

      records += this.recordCount(entity);

    }, this);

    return {

      entities : this.count(),
      records : records

    };

  }

  health() {

    return {

      initialized : this.isInitialized(),
      healthy : true,
      entities : this.count(),
      records : this.statistics().records

    };

  }

  report() {

    return {

      entities : this.entities(),
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
