/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * -----------------------------------------------------------------------------
 * File        : 73_Sales_PaymentManager.gs
 * Version     : 1.0.0
 * Author      : OpenAI + Muhammad Saeed Anser
 * Description : Sales Payment Manager
 * =============================================================================
 */

'use strict';

class SalesPaymentManager extends BaseService {

  //===========================================================================
  // Constructor
  //===========================================================================

  constructor() {

    super("SalesPaymentManager");

    this._payments = {};

  }

  //===========================================================================
  // Initialization
  //===========================================================================

  initialize() {

    super.initialize();

    this._payments = {};

    return this;

  }

  //===========================================================================
  // CRUD
  //===========================================================================

  create(paymentNo, payment) {

    this._payments[paymentNo] = payment;

    return true;

  }

  exists(paymentNo) {

    return paymentNo in this._payments;

  }

  get(paymentNo) {

    return this._payments[paymentNo] || null;

  }

  update(paymentNo, payment) {

    if (!this.exists(paymentNo)) {

      return false;

    }

    this._payments[paymentNo] = payment;

    return true;

  }

  remove(paymentNo) {

    if (!this.exists(paymentNo)) {

      return false;

    }

    delete this._payments[paymentNo];

    return true;

  }

  clear() {

    this._payments = {};

    return true;

  }

  all() {

    return this._payments;

  }

  numbers() {

    return Object.keys(this._payments);

  }

  count() {

    return this.numbers().length;

  }

  //===========================================================================
  // Payment Status
  //===========================================================================

  receive(paymentNo) {

    if (!this.exists(paymentNo)) {

      return false;

    }

    this._payments[paymentNo].status = "Received";

    return true;

  }

  cancel(paymentNo) {

    if (!this.exists(paymentNo)) {

      return false;

    }

    this._payments[paymentNo].status = "Cancelled";

    return true;

  }

  refund(paymentNo) {

    if (!this.exists(paymentNo)) {

      return false;

    }

    this._payments[paymentNo].status = "Refunded";

    return true;

  }

  pending(paymentNo) {

    if (!this.exists(paymentNo)) {

      return false;

    }

    this._payments[paymentNo].status = "Pending";

    return true;

  }

  //===========================================================================
  // Filters
  //===========================================================================

  received() {

    var result = {};

    Object.keys(this._payments).forEach(function(paymentNo) {

      if (this._payments[paymentNo].status === "Received") {

        result[paymentNo] = this._payments[paymentNo];

      }

    }, this);

    return result;

  }

  cancelled() {

    var result = {};

    Object.keys(this._payments).forEach(function(paymentNo) {

      if (this._payments[paymentNo].status === "Cancelled") {

        result[paymentNo] = this._payments[paymentNo];

      }

    }, this);

    return result;

  }

  refunded() {

    var result = {};

    Object.keys(this._payments).forEach(function(paymentNo) {

      if (this._payments[paymentNo].status === "Refunded") {

        result[paymentNo] = this._payments[paymentNo];

      }

    }, this);

    return result;

  }

  pendingPayments() {

    var result = {};

    Object.keys(this._payments).forEach(function(paymentNo) {

      if (this._payments[paymentNo].status === "Pending") {

        result[paymentNo] = this._payments[paymentNo];

      }

    }, this);

    return result;

  }

  //===========================================================================
  // Reporting
  //===========================================================================

  report() {

    return {

      payments : this.count(),

      pending : Object.keys(this.pendingPayments()).length,

      received : Object.keys(this.received()).length,

      cancelled : Object.keys(this.cancelled()).length,

      refunded : Object.keys(this.refunded()).length

    };

  }

  health() {

    var report = this.report();

    report.initialized = this.isInitialized();
    report.healthy = true;

    return report;

  }

  snapshot() {

    return {

      payments : this.all(),

      statistics : this.report(),

      health : this.health()

    };

  }

  about() {

    return {

      service : this.getName(),

      version : this.getVersion(),

      created : this.getCreatedTime(),

      initialized : this.isInitialized(),

      statistics : this.report()

    };

  }

}

//==============================================================================
// Sales Registration
//==============================================================================

WEF.ServiceContainer.registerModuleService(
  "Sales",
  "PaymentManager",
  new SalesPaymentManager()
);