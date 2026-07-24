/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * -----------------------------------------------------------------------------
 * File        : 72_Sales_DeliveryManager.gs
 * Module      : Sales
 * Class       : SalesDeliveryManager
 * Version     : 1.0.0
 * Description : Delivery Note & Shipment Manager
 * =============================================================================
 */

'use strict';

class SalesDeliveryManager extends BaseService {

  //===========================================================================
  // Constructor
  //===========================================================================

  constructor() {

    super("SalesDeliveryManager");

    this._deliveries = {};

  }

  //===========================================================================
  // Initialization
  //===========================================================================

  initialize() {

    super.initialize();

    this._deliveries = {};

    return this;

  }

  //===========================================================================
  // CRUD
  //===========================================================================

  create(deliveryNo, delivery) {

    this._deliveries[deliveryNo] = delivery;

    return true;

  }

  exists(deliveryNo) {

    return deliveryNo in this._deliveries;

  }

  get(deliveryNo) {

    return this._deliveries[deliveryNo] || null;

  }

  update(deliveryNo, delivery) {

    if (!this.exists(deliveryNo))
      return false;

    this._deliveries[deliveryNo] = delivery;

    return true;

  }

  remove(deliveryNo) {

    if (!this.exists(deliveryNo))
      return false;

    delete this._deliveries[deliveryNo];

    return true;

  }

  all() {

    return this._deliveries;

  }

  numbers() {

    return Object.keys(this._deliveries);

  }

  count() {

    return this.numbers().length;

  }

  //===========================================================================
  // Business Operations
  //===========================================================================

  dispatch(deliveryNo) {

    if (!this.exists(deliveryNo))
      return false;

    this._deliveries[deliveryNo].status = "Dispatched";

    return true;

  }

  deliver(deliveryNo) {

    if (!this.exists(deliveryNo))
      return false;

    this._deliveries[deliveryNo].status = "Delivered";

    return true;

  }

  returnDelivery(deliveryNo) {

    if (!this.exists(deliveryNo))
      return false;

    this._deliveries[deliveryNo].status = "Returned";

    return true;

  }

  cancel(deliveryNo) {

    if (!this.exists(deliveryNo))
      return false;

    this._deliveries[deliveryNo].status = "Cancelled";

    return true;

  }

  reopen(deliveryNo) {

    if (!this.exists(deliveryNo))
      return false;

    this._deliveries[deliveryNo].status = "Open";

    return true;

  }

  //===========================================================================
  // Queries
  //===========================================================================

  getDispatched() {

    var result = {};

    for (var deliveryNo in this._deliveries) {

      if (this._deliveries[deliveryNo].status === "Dispatched") {

        result[deliveryNo] = this._deliveries[deliveryNo];

      }

    }

    return result;

  }

  getDelivered() {

    var result = {};

    for (var deliveryNo in this._deliveries) {

      if (this._deliveries[deliveryNo].status === "Delivered") {

        result[deliveryNo] = this._deliveries[deliveryNo];

      }

    }

    return result;

  }

  getReturned() {

    var result = {};

    for (var deliveryNo in this._deliveries) {

      if (this._deliveries[deliveryNo].status === "Returned") {

        result[deliveryNo] = this._deliveries[deliveryNo];

      }

    }

    return result;

  }

  getCancelled() {

    var result = {};

    for (var deliveryNo in this._deliveries) {

      if (this._deliveries[deliveryNo].status === "Cancelled") {

        result[deliveryNo] = this._deliveries[deliveryNo];

      }

    }

    return result;

  }

  getOpenDeliveries() {

    var result = {};

    for (var deliveryNo in this._deliveries) {

      if (this._deliveries[deliveryNo].status === "Open") {

        result[deliveryNo] = this._deliveries[deliveryNo];

      }

    }

    return result;

  }

  //===========================================================================
  // Maintenance
  //===========================================================================

  clear() {

    this._deliveries = {};

    return true;

  }

  //===========================================================================
  // Reporting
  //===========================================================================

  report() {

    return {

      deliveries : this.count(),

      open : Object.keys(
        this.getOpenDeliveries()
      ).length,

      dispatched : Object.keys(
        this.getDispatched()
      ).length,

      delivered : Object.keys(
        this.getDelivered()
      ).length,

      returned : Object.keys(
        this.getReturned()
      ).length,

      cancelled : Object.keys(
        this.getCancelled()
      ).length

    };

  }

  health() {

    return {

      initialized : this.isInitialized(),

      healthy : true,

      ...this.report()

    };

  }

  snapshot() {

    return {

      deliveries : this.all(),

      statistics : this.report(),

      health : this.health()

    };

  }

  about() {

    return {

      service : this.getName(),

      version : this.getVersion(),

      initialized : this.isInitialized(),

      created : this.getCreatedTime(),

      statistics : this.report()

    };

  }

}

//==============================================================================
// Sales Registration
//==============================================================================

WEF.ServiceContainer.registerModuleService(
  "Sales",
  "DeliveryManager",
  new SalesDeliveryManager()
);