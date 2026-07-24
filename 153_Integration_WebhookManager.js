/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 153_Integration_WebhookManager.gs
 * Module      : Integration
 * Class       : IntegrationWebhookManager
 * Version     : 1.0.0
 * Description : Webhook Management Service
 * =============================================================================
 */

'use strict';

class IntegrationWebhookManager extends BaseService {

  constructor() {

    super("IntegrationWebhookManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._webhooks = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(webhookId, data) {

    if (this.exists(webhookId)) {

      return false;

    }

    this._webhooks[webhookId] = Object.assign({

      webhookName: "",

      endpoint: "",

      event: "",

      method: "POST",

      secret: "",

      contentType: "application/json",

      lastTriggered: "",

      retryCount: 0,

      status: "Inactive"

    }, data || {});

    return true;

  }

  update(webhookId, data) {

    if (!this.exists(webhookId)) {

      return false;

    }

    Object.assign(

      this._webhooks[webhookId],

      data || {}

    );

    return true;

  }

  get(webhookId) {

    return this._webhooks[webhookId] || null;

  }

  getAll() {

    return this._webhooks;

  }

  exists(webhookId) {

    return this._webhooks.hasOwnProperty(webhookId);

  }

  remove(webhookId) {

    if (!this.exists(webhookId)) {

      return false;

    }

    delete this._webhooks[webhookId];

    return true;

  }

  clear() {

    this._webhooks = {};

    return true;

  }

  count() {

    return Object.keys(this._webhooks).length;

  }

  keys() {

    return Object.keys(this._webhooks);

  }

  //=========================================================================
  // Webhook Lifecycle
  //=========================================================================

  activate(webhookId) {

    if (!this.exists(webhookId)) {

      return false;

    }

    this._webhooks[webhookId].status = "Active";

    return true;

  }

  deactivate(webhookId) {

    if (!this.exists(webhookId)) {

      return false;

    }

    this._webhooks[webhookId].status = "Inactive";

    return true;

  }

  trigger(webhookId) {

    if (!this.exists(webhookId)) {

      return false;

    }

    this._webhooks[webhookId].lastTriggered = new Date();

    this._webhooks[webhookId].status = "Triggered";

    return true;

  }

  error(webhookId) {

    if (!this.exists(webhookId)) {

      return false;

    }

    this._webhooks[webhookId].status = "Error";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getActive() {

    return this.filter(webhook =>
      webhook.status === "Active"
    );

  }

  getInactive() {

    return this.filter(webhook =>
      webhook.status === "Inactive"
    );

  }

  getTriggered() {

    return this.filter(webhook =>
      webhook.status === "Triggered"
    );

  }

  getErrors() {

    return this.filter(webhook =>
      webhook.status === "Error"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._webhooks).forEach(id => {

      if (callback(this._webhooks[id])) {

        results[id] = this._webhooks[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      webhooks: this.count(),

      active: Object.keys(this.getActive()).length,

      inactive: Object.keys(this.getInactive()).length,

      triggered: Object.keys(this.getTriggered()).length,

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

      webhooks: this.getAll(),

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
  "WebhookManager",
  new IntegrationWebhookManager()
);