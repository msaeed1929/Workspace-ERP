/**
 * ===========================================================================
 * WEF ERP Framework
 * 83_Purchase_PaymentManager.gs
 * Purchase Payment Manager
 * Version: 1.0.0
 * ===========================================================================
 */

'use strict';

class PurchasePaymentManager extends BaseService {

  //===========================================================================
  // Constructor
  //===========================================================================

  constructor() {

    super("PurchasePaymentManager");

    this.initialize();

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

    if (!this.exists(paymentNo)) return false;

    this._payments[paymentNo] = payment;

    return true;

  }

  remove(paymentNo) {

    if (!this.exists(paymentNo)) return false;

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
  // Status Management
  //===========================================================================

  pay(paymentNo) {

    if (!this.exists(paymentNo)) return false;

    this._payments[paymentNo].status = "Paid";

    return true;

  }

  cancel(paymentNo) {

    if (!this.exists(paymentNo)) return false;

    this._payments[paymentNo].status = "Cancelled";

    return true;

  }

  refund(paymentNo) {

    if (!this.exists(paymentNo)) return false;

    this._payments[paymentNo].status = "Refunded";

    return true;

  }

  reopen(paymentNo) {

    if (!this.exists(paymentNo)) return false;

    this._payments[paymentNo].status = "Pending";

    return true;

  }

  //===========================================================================
  // Filters
  //===========================================================================

  paid() {

    return Object.fromEntries(

      Object.entries(this._payments)

        .filter(([k, v]) => v.status === "Paid")

    );

  }

  cancelled() {

    return Object.fromEntries(

      Object.entries(this._payments)

        .filter(([k, v]) => v.status === "Cancelled")

    );

  }

  refunded() {

    return Object.fromEntries(

      Object.entries(this._payments)

        .filter(([k, v]) => v.status === "Refunded")

    );

  }

  pending() {

    return Object.fromEntries(

      Object.entries(this._payments)

        .filter(([k, v]) => v.status === "Pending")

    );

  }

  //===========================================================================
  // Statistics
  //===========================================================================

  statistics() {

    return {

      payments: this.count(),

      paid: Object.keys(this.paid()).length,

      pending: Object.keys(this.pending()).length,

      cancelled: Object.keys(this.cancelled()).length,

      refunded: Object.keys(this.refunded()).length

    };

  }

  //===========================================================================
  // Health
  //===========================================================================

  health() {

    const stats = this.statistics();

    stats.initialized = this.isInitialized();

    stats.healthy = true;

    return stats;

  }

  //===========================================================================
  // Export
  //===========================================================================

  export() {

    return {

      payments: this.all(),

      statistics: this.statistics(),

      health: this.health()

    };

  }

  //===========================================================================
  // Information
  //===========================================================================

  about() {

    return {

      service: "PurchasePaymentManager",

      version: "1.0.0",

      initialized: this.isInitialized(),

      created: this.getCreatedTime(),

      statistics: this.statistics()

    };

  }

}

//==============================================================================
// Registration
//==============================================================================function bootPurchasePaymentManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "Purchase",
      "PaymentManager",
      new PurchasePaymentManager()
    );
  }
}