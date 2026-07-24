/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 216_UI_NotificationManager.gs
 * Layer       : Presentation
 * Component   : UI Notification Manager
 * Version     : 1.0.0
 * Description : Manages user notifications, alerts, toast messages and
 *               application status messages.
 * =============================================================================
 */

'use strict';

class UINotificationManager {

  constructor() {

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    this._notifications = {};

    this._activeNotification = null;

    this._initialized = true;

    return this;

  }

  //=========================================================================
  // Notification Registration
  //=========================================================================

  register(name, definition) {

    this._notifications[name] = {

      name: name,

      title: definition.title || name,

      message: definition.message || "",

      type: definition.type || "info",     // info, success, warning, error

      duration: definition.duration || 5000,

      dismissible: definition.dismissible !== false,

      enabled: true,

      created: new Date()

    };

    return this;

  }

  registerMany(notifications) {

    Object.keys(notifications).forEach(name => {

      this.register(name, notifications[name]);

    });

    return this;

  }

  //=========================================================================
  // Notification Lookup
  //=========================================================================

  exists(name) {

    return this._notifications.hasOwnProperty(name);

  }

  get(name) {

    return this._notifications[name] || null;

  }

  getAll() {

    return this._notifications;

  }

  keys() {

    return Object.keys(this._notifications);

  }

  count() {

    return this.keys().length;

  }

  //=========================================================================
  // Active Notification
  //=========================================================================

  show(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._activeNotification = name;

    Logger.info("Notification shown: " + name);

    return true;

  }

  hide() {

    this._activeNotification = null;

    return this;

  }

  active() {

    return this._activeNotification;

  }

  getActiveNotification() {

    if (!this._activeNotification) {

      return null;

    }

    return this.get(this._activeNotification);

  }

  //=========================================================================
  // Notification State
  //=========================================================================

  enable(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._notifications[name].enabled = true;

    return true;

  }

  disable(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._notifications[name].enabled = false;

    return true;

  }

  //=========================================================================
  // Notification Operations
  //=========================================================================

  notify(title, message, type) {

    Logger.info(

      "[" + (type || "INFO").toUpperCase() + "] " +

      title +

      " : " +

      message

    );

    return true;

  }

  success(message) {

    return this.notify("Success", message, "success");

  }

  warning(message) {

    return this.notify("Warning", message, "warning");

  }

  error(message) {

    return this.notify("Error", message, "error");

  }

  infoMessage(message) {

    return this.notify("Information", message, "info");

  }

  //=========================================================================
  // Notification Management
  //=========================================================================

  remove(name) {

    if (!this.exists(name)) {

      return false;

    }

    if (this._activeNotification === name) {

      this._activeNotification = null;

    }

    delete this._notifications[name];

    return true;

  }

  clear() {

    this.initialize();

    return this;

  }

  //=========================================================================
  // Information
  //=========================================================================

  isInitialized() {

    return this._initialized;

  }

  info() {

    return {

      component: "UI Notification Manager",

      version: "1.0.0",

      initialized: this.isInitialized(),

      notifications: this.count(),

      activeNotification: this.active()

    };

  }

}

/*==============================================================================
  Module Registration
==============================================================================*/

WEF.UI.Core.NotificationManager = new UINotificationManager();