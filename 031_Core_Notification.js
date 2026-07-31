/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 31_Core_Notification.gs
 * Version     : 1.0.0
 * Description : Notification Service
 * =============================================================================
 */

'use strict';

class NotificationService extends BaseService {

  constructor() {

    super("Notification");

    this.initialize();

  }

  initialize() {

    super.initialize();

    this.reset();

    return this;

  }

  reset() {

    this._channels = {};
    this._notifications = [];

    this._statistics = {

      channels:0,
      notifications:0,
      sent:0,
      failed:0

    };

    return this;

  }

  //=========================================================================
  // Channels
  //=========================================================================

  registerChannel(name, handler) {

    if (typeof handler !== "function")
      throw new Error("Notification handler must be a function.");

    this._channels[name] = handler;

    this._statistics.channels =
      this.channelCount();

    return true;

  }

  unregisterChannel(name) {

    if (!this._channels[name])
      return false;

    delete this._channels[name];

    this._statistics.channels =
      this.channelCount();

    return true;

  }

  hasChannel(name) {

    return !!this._channels[name];

  }

  getChannel(name) {

    return this._channels[name] || null;

  }

  channels() {

    return Object.keys(this._channels);

  }

  channelCount() {

    return this.channels().length;

  }

  //=========================================================================
  // Queue
  //=========================================================================

  queue(notification) {

    notification = notification || {};

    notification.id = Utilities.getUuid();

    notification.created = new Date();

    notification.status = "Queued";

    this._notifications.push(notification);

    this._statistics.notifications++;

    return notification.id;

  }

  notifications() {

    return this._notifications;

  }

  notificationCount() {

    return this._notifications.length;

  }

  clearQueue() {

    this._notifications = [];

    return true;

  }

  //=========================================================================
  // Send Notification
  //=========================================================================

  send(channel, notification) {

    if (!this.hasChannel(channel)) {

      this._statistics.failed++;

      throw new Error(
        "Notification channel not found."
      );

    }

    const handler = this.getChannel(channel);

    handler(notification);

    this._statistics.sent++;

    return true;

  }

  broadcast(notification) {

    const channels = this.channels();

    channels.forEach(function(channel){

      this.send(channel, notification);

    }, this);

    return channels.length;

  }

  processQueue() {

    this._notifications.forEach(function(notification){

      try {

        this.send(
          notification.channel,
          notification
        );

        notification.status = "Sent";

      }

      catch(error){

        notification.status = "Failed";

        notification.error = error.message;

      }

    }, this);

    return true;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      channels:this.channelCount(),
      notifications:this.notificationCount(),
      sent:this._statistics.sent,
      failed:this._statistics.failed

    };

  }

  health() {

    return {

      initialized:this.isInitialized(),
      healthy:true,
      channels:this.channelCount(),
      queued:this.notificationCount()

    };

  }

  report() {

    return {

      channels:this.channels(),

      queue:this.notifications(),

      statistics:this.statistics(),

      health:this.health()

    };

  }

  info() {

    return {

      service:this.getName(),

      version:this.getVersion(),

      initialized:this.isInitialized(),

      created:this.getCreatedTime(),

      statistics:this.statistics()

    };

  }

}

WEF.Notification =
  new NotificationService();