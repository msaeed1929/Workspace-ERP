/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * -----------------------------------------------------------------------------
 * File        : 71_Sales_InvoiceManager.gs
 * Module      : Sales
 * Class       : SalesInvoiceManager
 * Version     : 1.0.0
 * -----------------------------------------------------------------------------
 * Description :
 * Sales Invoice Management Service
 * =============================================================================
 */

'use strict';

/**
 * =============================================================================
 * Sales Invoice Manager
 * =============================================================================
 */
class SalesInvoiceManager extends BaseService {

  //===========================================================================
  // Constructor
  //===========================================================================

  constructor() {

    super("SalesInvoiceManager");


  }

  //===========================================================================
  // Initialization
  //===========================================================================

  initialize() {

    super.initialize();

    this._invoices = {};

    return this;

  }

  //===========================================================================
  // Create Invoice
  //===========================================================================

  create(invoiceNo, invoice) {

    this._invoices[invoiceNo] = invoice;

    return true;

  }

  //===========================================================================
  // Update Invoice
  //===========================================================================

  update(invoiceNo, invoice) {

    if (!this.exists(invoiceNo)) return false;

    this._invoices[invoiceNo] = invoice;

    return true;

  }

  //===========================================================================
  // Get Invoice
  //===========================================================================

  get(invoiceId) {

    return this._invoices[invoiceId] || null;

  }

  //===========================================================================
  // Get All Invoices
  //===========================================================================

  all() {

    return this._invoices;

  }

  //===========================================================================
  // Exists
  //===========================================================================

  exists(invoiceId) {

    return Object.prototype.hasOwnProperty.call(
      this._invoices,
      invoiceId
    );

  }

  //===========================================================================
  // Remove Invoice
  //===========================================================================

  remove(invoiceNo) {

    if (!this.exists(invoiceNo)) return false;

    delete this._invoices[invoiceNo];

    return true;

  }

  //===========================================================================
  // Clear
  //===========================================================================

  clear() {

    this._invoices = {};

    return true;

  }

  //===========================================================================
  // Count
  //===========================================================================

  numbers() {

    return Object.keys(this._invoices);

  }

  count() {

    return this.numbers().length;

  }

  //===========================================================================
  // Approve Invoice
  //===========================================================================

  approve(invoiceId) {

    if (!this.exists(invoiceId)) {

      return false;

    }

    this._invoices[invoiceId].status = "Approved";

    return true;

  }

  //===========================================================================
  // Cancel Invoice
  //===========================================================================

  cancel(invoiceId) {

    if (!this.exists(invoiceId)) {

      return false;

    }

    this._invoices[invoiceId].status = "Cancelled";

    return true;

  }

  //===========================================================================
  // Post Invoice
  //===========================================================================

  post(invoiceId) {

    if (!this.exists(invoiceId)) {

      return false;

    }

    this._invoices[invoiceId].status = "Posted";

    return true;

  }

  //===========================================================================
  // Reopen Invoice
  //===========================================================================

  reopen(invoiceId) {

    if (!this.exists(invoiceId)) {

      return false;

    }

    this._invoices[invoiceId].status = "Draft";

    return true;

  }

  //===========================================================================
  // Draft Invoices
  //===========================================================================

  getDraftInvoices() {

    const invoices = {};

    Object.keys(this._invoices).forEach(function(id) {

      if (this._invoices[id].status === "Draft") {

        invoices[id] = this._invoices[id];

      }

    }, this);

    return invoices;

  }

  //===========================================================================
  // Approved Invoices
  //===========================================================================

  getApprovedInvoices() {

    const invoices = {};

    Object.keys(this._invoices).forEach(function(id) {

      if (this._invoices[id].status === "Approved") {

        invoices[id] = this._invoices[id];

      }

    }, this);

    return invoices;

  }

  //===========================================================================
  // Posted Invoices
  //===========================================================================

  getPostedInvoices() {

    const invoices = {};

    Object.keys(this._invoices).forEach(function(id) {

      if (this._invoices[id].status === "Posted") {

        invoices[id] = this._invoices[id];

      }

    }, this);

    return invoices;

  }

  //===========================================================================
  // Cancelled Invoices
  //===========================================================================

  getCancelledInvoices() {

    const invoices = {};

    Object.keys(this._invoices).forEach(function(id) {

      if (this._invoices[id].status === "Cancelled") {

        invoices[id] = this._invoices[id];

      }

    }, this);

    return invoices;

  }

  //===========================================================================
  // Report
  //===========================================================================

  report() {

    return {

      invoices: this.count(),

      drafts: Object.keys(
        this.getDraftInvoices()
      ).length,

      approved: Object.keys(
        this.getApprovedInvoices()
      ).length,

      posted: Object.keys(
        this.getPostedInvoices()
      ).length,

      cancelled: Object.keys(
        this.getCancelledInvoices()
      ).length

    };

  }

  //===========================================================================
  // Health
  //===========================================================================

  health() {

    const report = this.report();

    report.initialized = this.isInitialized();

    report.healthy = true;

    return report;

  }

  //===========================================================================
  // Diagnostics
  //===========================================================================

  diagnostics() {

    return {

      invoices: this._invoices,

      statistics: this.report(),

      health: this.health()

    };

  }

  //===========================================================================
  // About
  //===========================================================================

  about() {

    return {

      service: this._name,
      version: this._version,
      created: this._createdAt,
      initialized: this._initialized,
      statistics: this.report()

    };

  }
}

//==============================================================================
// Sales Registration
//==============================================================================

WEF.ServiceContainer.registerModuleService(
  "Sales",
  "InvoiceManager",
  new SalesInvoiceManager()
);