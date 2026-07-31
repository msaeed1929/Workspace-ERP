/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 86_Purchase_CreditNoteManager.gs
 * Version     : 1.0.0
 * Description : Purchase Credit Note Manager
 * =============================================================================
 */

'use strict';

class PurchaseCreditNoteManager extends BaseService {

  constructor() {

    super("PurchaseCreditNoteManager");

    this.initialize();

  }

  //==========================================================================
  // Initialization
  //==========================================================================

  initialize() {

    super.initialize();

    this._creditNotes = {};

    return this;

  }

  //==========================================================================
  // CRUD
  //==========================================================================

  create(number, data) {

    this._creditNotes[number] = Object.assign({}, data);

    return this;

  }

  update(number, data) {

    if (!this.exists(number)) {

      return false;

    }

    Object.assign(this._creditNotes[number], data);

    return true;

  }

  remove(number) {

    if (!this.exists(number)) {

      return false;

    }

    delete this._creditNotes[number];

    return true;

  }

  clear() {

    this._creditNotes = {};

    return true;

  }

  get(number) {

    return this._creditNotes[number] || null;

  }

  getAll() {

    return Object.assign({}, this._creditNotes);

  }

  all() {

    return this.getAll();

  }

  exists(number) {

    return this._creditNotes.hasOwnProperty(number);

  }

  count() {

    return Object.keys(this._creditNotes).length;

  }

  keys() {

    return Object.keys(this._creditNotes);

  }

  //==========================================================================
  // Status Management
  //==========================================================================

  approve(number) {

    if (!this.exists(number)) {

      return false;

    }

    this._creditNotes[number].status = "Approved";

    return true;

  }

  cancel(number) {

    if (!this.exists(number)) {

      return false;

    }

    this._creditNotes[number].status = "Cancelled";

    return true;

  }

  issue(number) {

    if (!this.exists(number)) {

      return false;

    }

    this._creditNotes[number].status = "Issued";

    return true;

  }

  reopen(number) {

    if (!this.exists(number)) {

      return false;

    }

    this._creditNotes[number].status = "Draft";

    return true;

  }

  //==========================================================================
  // Filters
  //==========================================================================

  getApproved() {

    return this.filterByStatus("Approved");

  }

  getCancelled() {

    return this.filterByStatus("Cancelled");

  }

  getIssued() {

    return this.filterByStatus("Issued");

  }

  getDrafts() {

    return this.filterByStatus("Draft");

  }

  filterByStatus(status) {

    const result = {};

    Object.keys(this._creditNotes).forEach(number => {

      if (this._creditNotes[number].status === status) {

        result[number] = this._creditNotes[number];

      }

    });

    return result;

  }
  
  //==========================================================================
  // Statistics
  //==========================================================================

  statistics() {

    return {

      creditNotes: this.count(),

      approved: Object.keys(this.getApproved()).length,

      cancelled: Object.keys(this.getCancelled()).length,

      issued: Object.keys(this.getIssued()).length,

      drafts: Object.keys(this.getDrafts()).length

    };

  }

  //==========================================================================
  // Health
  //==========================================================================

  health() {

    return {

      healthy: true,

      initialized: this.isInitialized(),

      creditNotes: this.count(),

      approved: Object.keys(this.getApproved()).length,

      cancelled: Object.keys(this.getCancelled()).length,

      issued: Object.keys(this.getIssued()).length,

      drafts: Object.keys(this.getDrafts()).length

    };

  }

  //==========================================================================
  // Report
  //==========================================================================

  report() {

    return {

      statistics: this.statistics(),

      health: this.health(),

      creditNotes: this.getAll()

    };

  }

  //==========================================================================
  // About
  //==========================================================================

  about() {

    return {

      service: this.getName(),

      version: this.getVersion(),

      initialized: this.isInitialized(),

      created: this.getCreatedTime(),

      statistics: this.statistics()

    };

  }

}

//==============================================================================
// Registration
//==============================================================================function bootPurchaseCreditNoteManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "Purchase",
      "CreditNoteManager",
      new PurchaseCreditNoteManager()
    );
  }
}