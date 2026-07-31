/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * -----------------------------------------------------------------------------
 * File        : 82_Purchase_InvoiceManager.gs
 * Version     : 1.0.0
 * Description : Purchase Invoice Manager
 * =============================================================================
 */

'use strict';

class PurchaseInvoiceManager extends BaseService {

  //===========================================================================
  // Constructor
  //===========================================================================

  constructor() {

    super("PurchaseInvoiceManager");

    this._invoices = {};

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
  // CRUD
  //===========================================================================

  create(invoiceNo, invoice) {

    this._invoices[invoiceNo] = invoice;

    return true;

  }

  exists(invoiceNo) {

    return invoiceNo in this._invoices;

  }

  get(invoiceNo) {

    return this._invoices[invoiceNo] || null;

  }

  update(invoiceNo, invoice) {

    if (!this.exists(invoiceNo)) {

      return false;

    }

    this._invoices[invoiceNo] = invoice;

    return true;

  }

  remove(invoiceNo) {

    if (!this.exists(invoiceNo)) {

      return false;

    }

    delete this._invoices[invoiceNo];

    return true;

  }

  all() {

    return this._invoices;

  }

  numbers() {

    return Object.keys(this._invoices);

  }

  count() {

    return this.numbers().length;

  }

  clear() {

    this._invoices = {};

    return true;

  }

  //===========================================================================
  // Workflow
  //===========================================================================

  approve(invoiceNo) {

    if (!this.exists(invoiceNo)) {

      return false;

    }

    this._invoices[invoiceNo].status = "Approved";

    return true;

  }

  cancel(invoiceNo) {

    if (!this.exists(invoiceNo)) {

      return false;

    }

    this._invoices[invoiceNo].status = "Cancelled";

    return true;

  }

  post(invoiceNo) {

    if (!this.exists(invoiceNo)) {

      return false;

    }

    this._invoices[invoiceNo].status = "Posted";

    return true;

  }

  reopen(invoiceNo) {

    if (!this.exists(invoiceNo)) {

      return false;

    }

    this._invoices[invoiceNo].status = "Draft";

    return true;

  }

  //===========================================================================
  // Status Lists
  //===========================================================================

  approved() {

    return Object.fromEntries(

      Object.entries(this._invoices).filter(

        ([, invoice]) => invoice.status === "Approved"

      )

    );

  }

  cancelled() {

    return Object.fromEntries(

      Object.entries(this._invoices).filter(

        ([, invoice]) => invoice.status === "Cancelled"

      )

    );

  }

  posted() {

    return Object.fromEntries(

      Object.entries(this._invoices).filter(

        ([, invoice]) => invoice.status === "Posted"

      )

    );

  }

  drafts() {

    return Object.fromEntries(

      Object.entries(this._invoices).filter(

        ([, invoice]) => invoice.status === "Draft"

      )

    );

  }

  //===========================================================================
  // Statistics
  //===========================================================================

  statistics() {

    return {

      invoices: this.count(),

      approved: Object.keys(this.approved()).length,

      cancelled: Object.keys(this.cancelled()).length,

      posted: Object.keys(this.posted()).length,

      drafts: Object.keys(this.drafts()).length

    };

  }

  //===========================================================================
  // Health
  //===========================================================================

  health() {

    return {

      initialized: this.isInitialized(),

      healthy: true,

      ...this.statistics()

    };

  }

  //===========================================================================
  // Report
  //===========================================================================

  report() {

    return {

      invoices: this.all(),

      statistics: this.statistics(),

      health: this.health()

    };

  }

  //===========================================================================
  // About
  //===========================================================================

  about() {

    return {

      service: "PurchaseInvoiceManager",

      version: "1.0.0",

      initialized: this.isInitialized(),

      created: this.getCreatedTime(),

      statistics: this.statistics()

    };

  }

}

//==============================================================================
// Registration
//==============================================================================function bootPurchaseInvoiceManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "Purchase",
      "InvoiceManager",
      new PurchaseInvoiceManager()
    );
  }
}
