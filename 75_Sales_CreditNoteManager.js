/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * -----------------------------------------------------------------------------
 * File        : 75_Sales_CreditNoteManager.gs
 * Version     : 1.0.0
 * Description : Sales Credit Note Manager
 * =============================================================================
 */

'use strict';

class SalesCreditNoteManager extends BaseService {

  //===========================================================================
  // Constructor
  //===========================================================================

  constructor() {

    super("SalesCreditNoteManager");

    this._creditNotes = {};

  }

  //===========================================================================
  // Initialization
  //===========================================================================

  initialize() {

    super.initialize();

    this._creditNotes = {};

    return this;

  }

  //===========================================================================
  // CRUD
  //===========================================================================

  create(creditNo, data) {

    this._creditNotes[creditNo] = data;

    return true;

  }

  exists(creditNo) {

    return creditNo in this._creditNotes;

  }

  get(creditNo) {

    return this._creditNotes[creditNo] || null;

  }

  update(creditNo, data) {

    if (!this.exists(creditNo)) {

      return false;

    }

    this._creditNotes[creditNo] = data;

    return true;

  }

  remove(creditNo) {

    if (!this.exists(creditNo)) {

      return false;

    }

    delete this._creditNotes[creditNo];

    return true;

  }

  clear() {

    this._creditNotes = {};

    return true;

  }

  all() {

    return this._creditNotes;

  }

  numbers() {

    return Object.keys(this._creditNotes);

  }

  count() {

    return this.numbers().length;

  }

  //===========================================================================
  // Credit Note Status
  //===========================================================================

  approve(creditNo) {

    if (!this.exists(creditNo)) {

      return false;

    }

    this._creditNotes[creditNo].status = "Approved";

    return true;

  }

  cancel(creditNo) {

    if (!this.exists(creditNo)) {

      return false;

    }

    this._creditNotes[creditNo].status = "Cancelled";

    return true;

  }

  issue(creditNo) {

    if (!this.exists(creditNo)) {

      return false;

    }

    this._creditNotes[creditNo].status = "Issued";

    return true;

  }

  reopen(creditNo) {

    if (!this.exists(creditNo)) {

      return false;

    }

    this._creditNotes[creditNo].status = "Draft";

    return true;

  }

  //===========================================================================
  // Status Filters
  //===========================================================================

  approved() {

    var result = {};

    Object.keys(this._creditNotes).forEach(function(creditNo) {

      if (this._creditNotes[creditNo].status === "Approved") {

        result[creditNo] = this._creditNotes[creditNo];

      }

    }, this);

    return result;

  }

  cancelled() {

    var result = {};

    Object.keys(this._creditNotes).forEach(function(creditNo) {

      if (this._creditNotes[creditNo].status === "Cancelled") {

        result[creditNo] = this._creditNotes[creditNo];

      }

    }, this);

    return result;

  }

  issued() {

    var result = {};

    Object.keys(this._creditNotes).forEach(function(creditNo) {

      if (this._creditNotes[creditNo].status === "Issued") {

        result[creditNo] = this._creditNotes[creditNo];

      }

    }, this);

    return result;

  }

  drafts() {

    var result = {};

    Object.keys(this._creditNotes).forEach(function(creditNo) {

      if (this._creditNotes[creditNo].status === "Draft") {

        result[creditNo] = this._creditNotes[creditNo];

      }

    }, this);

    return result;

  }

  //===========================================================================
  // Reporting
  //===========================================================================

  report() {

    return {

      creditNotes: this.count(),

      drafts: Object.keys(this.drafts()).length,

      approved: Object.keys(this.approved()).length,

      cancelled: Object.keys(this.cancelled()).length,

      issued: Object.keys(this.issued()).length

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

      creditNotes: this.all(),

      statistics: this.report(),

      health: this.health()

    };

  }

  about() {

    return {

      service: this.getName(),

      version: this.getVersion(),

      created: this.getCreatedTime(),

      initialized: this.isInitialized(),

      statistics: this.report()

    };

  }

}

//==============================================================================
// Sales Registration
//==============================================================================

WEF.ServiceContainer.registerModuleService(
  "Sales",
  "CreditNoteManager",
  new SalesCreditNoteManager()
);