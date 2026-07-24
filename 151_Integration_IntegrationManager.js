/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 151_Integration_IntegrationManager.gs
 * Module      : Integration
 * Class       : IntegrationIntegrationManager
 * Version     : 1.0.0
 * Description : Integration Management Service
 * =============================================================================
 */

'use strict';

class IntegrationIntegrationManager extends BaseService {

  constructor() {

    super("IntegrationIntegrationManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._integrations = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(integrationId, data) {

    if (this.exists(integrationId)) {

      return false;

    }

    this._integrations[integrationId] = Object.assign({

      integrationName: "",

      provider: "",

      type: "REST API",

      endpoint: "",

      authentication: "API Key",

      status: "Inactive",

      lastSync: "",

      syncDirection: "Bidirectional",

      remarks: ""

    }, data || {});

    return true;

  }

  update(integrationId, data) {

    if (!this.exists(integrationId)) {

      return false;

    }

    Object.assign(

      this._integrations[integrationId],

      data || {}

    );

    return true;

  }

  get(integrationId) {

    return this._integrations[integrationId] || null;

  }

  getAll() {

    return this._integrations;

  }

  exists(integrationId) {

    return this._integrations.hasOwnProperty(integrationId);

  }

  remove(integrationId) {

    if (!this.exists(integrationId)) {

      return false;

    }

    delete this._integrations[integrationId];

    return true;

  }

  clear() {

    this._integrations = {};

    return true;

  }

  count() {

    return Object.keys(this._integrations).length;

  }

  keys() {

    return Object.keys(this._integrations);

  }

  //=========================================================================
  // Integration Lifecycle
  //=========================================================================

  activate(integrationId) {

    if (!this.exists(integrationId)) {

      return false;

    }

    this._integrations[integrationId].status = "Active";

    return true;

  }

  deactivate(integrationId) {

    if (!this.exists(integrationId)) {

      return false;

    }

    this._integrations[integrationId].status = "Inactive";

    return true;

  }

  synchronize(integrationId) {

    if (!this.exists(integrationId)) {

      return false;

    }

    this._integrations[integrationId].lastSync = new Date();

    this._integrations[integrationId].status = "Synchronized";

    return true;

  }

  error(integrationId) {

    if (!this.exists(integrationId)) {

      return false;

    }

    this._integrations[integrationId].status = "Error";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getActive() {

    return this.filter(integration =>
      integration.status === "Active"
    );

  }

  getInactive() {

    return this.filter(integration =>
      integration.status === "Inactive"
    );

  }

  getSynchronized() {

    return this.filter(integration =>
      integration.status === "Synchronized"
    );

  }

  getErrors() {

    return this.filter(integration =>
      integration.status === "Error"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._integrations).forEach(id => {

      if (callback(this._integrations[id])) {

        results[id] = this._integrations[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      integrations: this.count(),

      active: Object.keys(this.getActive()).length,

      inactive: Object.keys(this.getInactive()).length,

      synchronized: Object.keys(this.getSynchronized()).length,

      errors: Object.keys(this.getErrors()).length

    };

  }

  //=========================================================================
  // Health
  //=========================================================================

  health() {

    return {

      initialized: this.isInitialized(),

      healthy: true,

      service: this.getName(),

      version: this.getVersion(),

      status: "READY",

      ...this.statistics()

    };

  }

  //=========================================================================
  // Report
  //=========================================================================

  report() {

    return {

      integrations: this.getAll(),

      statistics: this.statistics(),

      health: this.health()

    };

  }

  //=========================================================================
  // Information
  //=========================================================================

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

//=============================================================================
// Module Registration
//=============================================================================

WEF.ServiceContainer.registerModuleService(
  "Integration",
  "IntegrationManager",
  new IntegrationIntegrationManager()
);