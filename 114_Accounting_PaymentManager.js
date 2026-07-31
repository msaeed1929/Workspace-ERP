/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 114_Accounting_PaymentManager.gs
 * Module      : Accounting
 * Class       : AccountingPaymentManager
 * Version     : 1.0.0
 * Description : Payment Management Service
 * =============================================================================
 */

'use strict';

class AccountingPaymentManager extends BaseService {

  constructor() {

    super("AccountingPaymentManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._payments = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(paymentId, data) {

    if (this.exists(paymentId)) {

      return false;

    }

    this._payments[paymentId] = Object.assign({

      payee: "",

      reference: "",

      amount: 0,

      paymentDate: "",

      status: "Draft"

    }, data || {});

    return true;

  }

  update(paymentId, data) {

    if (!this.exists(paymentId)) {

      return false;

    }

    Object.assign(

      this._payments[paymentId],

      data || {}

    );

    return true;

  }

  get(paymentId) {

    return this._payments[paymentId] || null;

  }

  getAll() {

    return this._payments;

  }

  exists(paymentId) {

    return this._payments.hasOwnProperty(paymentId);

  }

  remove(paymentId) {

    if (!this.exists(paymentId)) {

      return false;

    }

    delete this._payments[paymentId];

    return true;

  }

  clear() {

    this._payments = {};

    return true;

  }

  count() {

    return Object.keys(this._payments).length;

  }

  keys() {

    return Object.keys(this._payments);

  }

  //=========================================================================
  // Workflow
  //=========================================================================

  approve(paymentId) {

    if (!this.exists(paymentId)) {

      return false;

    }

    this._payments[paymentId].status = "Approved";

    return true;

  }

  process(paymentId) {

    if (!this.exists(paymentId)) {

      return false;

    }

    this._payments[paymentId].status = "Processed";

    return true;

  }

  cancel(paymentId) {

    if (!this.exists(paymentId)) {

      return false;

    }

    this._payments[paymentId].status = "Cancelled";

    return true;

  }

  reopen(paymentId) {

    if (!this.exists(paymentId)) {

      return false;

    }

    this._payments[paymentId].status = "Draft";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getDraft() {

    return this.filter(payment =>
      payment.status === "Draft"
    );

  }

  getApproved() {

    return this.filter(payment =>
      payment.status === "Approved"
    );

  }

  getProcessed() {

    return this.filter(payment =>
      payment.status === "Processed"
    );

  }

  getCancelled() {

    return this.filter(payment =>
      payment.status === "Cancelled"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._payments).forEach(id => {

      if (callback(this._payments[id])) {

        results[id] = this._payments[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      payments: this.count(),

      draft: Object.keys(this.getDraft()).length,

      approved: Object.keys(this.getApproved()).length,

      processed: Object.keys(this.getProcessed()).length,

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

      payments: this.getAll(),

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

function registerAccountingPaymentManager() {
function bootAccountingPaymentManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "Accounting",
      "PaymentManager",
      new AccountingPaymentManager()
    );
  }
}
}