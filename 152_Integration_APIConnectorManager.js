/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 152_Integration_APIConnectorManager.gs
 * Module      : Integration
 * Class       : IntegrationAPIConnectorManager
 * Version     : 1.0.0
 * Description : API Connector Management Service
 * =============================================================================
 */

'use strict';

class IntegrationAPIConnectorManager extends BaseService {

  constructor() {

    super("IntegrationAPIConnectorManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._connectors = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(connectorId, data) {

    if (this.exists(connectorId)) {

      return false;

    }

    this._connectors[connectorId] = Object.assign({

      connectorName: "",

      provider: "",

      baseUrl: "",

      apiVersion: "v1",

      authentication: "API Key",

      timeout: 30,

      retries: 3,

      lastConnection: "",

      status: "Disconnected"

    }, data || {});

    return true;

  }

  update(connectorId, data) {

    if (!this.exists(connectorId)) {

      return false;

    }

    Object.assign(

      this._connectors[connectorId],

      data || {}

    );

    return true;

  }

  get(connectorId) {

    return this._connectors[connectorId] || null;

  }

  getAll() {

    return this._connectors;

  }

  exists(connectorId) {

    return this._connectors.hasOwnProperty(connectorId);

  }

  remove(connectorId) {

    if (!this.exists(connectorId)) {

      return false;

    }

    delete this._connectors[connectorId];

    return true;

  }

  clear() {

    this._connectors = {};

    return true;

  }

  count() {

    return Object.keys(this._connectors).length;

  }

  keys() {

    return Object.keys(this._connectors);

  }

  //=========================================================================
  // Connector Lifecycle
  //=========================================================================

  connect(connectorId) {

    if (!this.exists(connectorId)) {

      return false;

    }

    this._connectors[connectorId].status = "Connected";

    this._connectors[connectorId].lastConnection = new Date();

    return true;

  }

  disconnect(connectorId) {

    if (!this.exists(connectorId)) {

      return false;

    }

    this._connectors[connectorId].status = "Disconnected";

    return true;

  }

  testConnection(connectorId) {

    if (!this.exists(connectorId)) {

      return false;

    }

    this._connectors[connectorId].status = "Verified";

    this._connectors[connectorId].lastConnection = new Date();

    return true;

  }

  error(connectorId) {

    if (!this.exists(connectorId)) {

      return false;

    }

    this._connectors[connectorId].status = "Error";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getConnected() {

    return this.filter(connector =>
      connector.status === "Connected"
    );

  }

  getDisconnected() {

    return this.filter(connector =>
      connector.status === "Disconnected"
    );

  }

  getVerified() {

    return this.filter(connector =>
      connector.status === "Verified"
    );

  }

  getErrors() {

    return this.filter(connector =>
      connector.status === "Error"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._connectors).forEach(id => {

      if (callback(this._connectors[id])) {

        results[id] = this._connectors[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      connectors: this.count(),

      connected: Object.keys(this.getConnected()).length,

      disconnected: Object.keys(this.getDisconnected()).length,

      verified: Object.keys(this.getVerified()).length,

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

      connectors: this.getAll(),

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
  "APIConnectorManager",
  new IntegrationAPIConnectorManager()
);