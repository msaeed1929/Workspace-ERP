/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 148_Workflow_NotificationWorkflowManager.gs
 * Module      : Workflow
 * Class       : WorkflowNotificationWorkflowManager
 * Version     : 1.0.0
 * Description : Workflow Notification Management Service
 * =============================================================================
 */

'use strict';

class WorkflowNotificationWorkflowManager extends BaseService {

  constructor() {

    super("WorkflowNotificationWorkflowManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._notifications = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(notificationId, data) {

    if (this.exists(notificationId)) {

      return false;

    }

    this._notifications[notificationId] = Object.assign({

      workflowId: "",

      recipient: "",

      channel: "Email",

      subject: "",

      message: "",

      sentDate: "",

      readDate: "",

      priority: "Normal",

      status: "Pending"

    }, data || {});

    return true;

  }

  update(notificationId, data) {

    if (!this.exists(notificationId)) {

      return false;

    }

    Object.assign(

      this._notifications[notificationId],

      data || {}

    );

    return true;

  }

  get(notificationId) {

    return this._notifications[notificationId] || null;

  }

  getAll() {

    return this._notifications;

  }

  exists(notificationId) {

    return this._notifications.hasOwnProperty(notificationId);

  }

  remove(notificationId) {

    if (!this.exists(notificationId)) {

      return false;

    }

    delete this._notifications[notificationId];

    return true;

  }

  clear() {

    this._notifications = {};

    return true;

  }

  count() {

    return Object.keys(this._notifications).length;

  }

  keys() {

    return Object.keys(this._notifications);

  }

  //=========================================================================
  // Notification Workflow
  //=========================================================================

  send(notificationId) {

    if (!this.exists(notificationId)) {

      return false;

    }

    this._notifications[notificationId].status = "Sent";

    return true;

  }

  markRead(notificationId) {

    if (!this.exists(notificationId)) {

      return false;

    }

    this._notifications[notificationId].status = "Read";

    return true;

  }

  cancel(notificationId) {

    if (!this.exists(notificationId)) {

      return false;

    }

    this._notifications[notificationId].status = "Cancelled";

    return true;

  }

  reopen(notificationId) {

    if (!this.exists(notificationId)) {

      return false;

    }

    this._notifications[notificationId].status = "Pending";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getPending() {

    return this.filter(notification =>
      notification.status === "Pending"
    );

  }

  getSent() {

    return this.filter(notification =>
      notification.status === "Sent"
    );

  }

  getRead() {

    return this.filter(notification =>
      notification.status === "Read"
    );

  }

  getCancelled() {

    return this.filter(notification =>
      notification.status === "Cancelled"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._notifications).forEach(id => {

      if (callback(this._notifications[id])) {

        results[id] = this._notifications[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      notifications: this.count(),

      pending: Object.keys(this.getPending()).length,

      sent: Object.keys(this.getSent()).length,

      read: Object.keys(this.getRead()).length,

      cancelled: Object.keys(this.getCancelled()).length

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

      notifications: this.getAll(),

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
  "Workflow",
  "NotificationWorkflowManager",
  new WorkflowNotificationWorkflowManager()
);