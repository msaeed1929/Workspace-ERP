/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 101_Accounting_JournalManager.gs
 * Module      : Accounting
 * Class       : AccountingJournalManager
 * Version     : 1.0.0
 * Description : Journal Entry Management Service
 * =============================================================================
 */

'use strict';

class AccountingJournalManager extends BaseService {

  constructor() {

    super("AccountingJournalManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._journals = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(journalNo, data) {

    if (this.exists(journalNo)) {

      return false;

    }

    this._journals[journalNo] = Object.assign({

      date: "",

      reference: "",

      description: "",

      lines: [],

      totalDebit: 0,

      totalCredit: 0,

      status: "Draft"

    }, data || {});

    return true;

  }

  update(journalNo, data) {

    if (!this.exists(journalNo)) {

      return false;

    }

    Object.assign(

      this._journals[journalNo],

      data || {}

    );

    return true;

  }

  get(journalNo) {

    return this._journals[journalNo] || null;

  }

  getAll() {

    return this._journals;

  }

  exists(journalNo) {

    return this._journals.hasOwnProperty(journalNo);

  }

  remove(journalNo) {

    if (!this.exists(journalNo)) {

      return false;

    }

    delete this._journals[journalNo];

    return true;

  }

  clear() {

    this._journals = {};

    return true;

  }

  count() {

    return Object.keys(this._journals).length;

  }

  keys() {

    return Object.keys(this._journals);

  }

  //=========================================================================
  // Workflow
  //=========================================================================

  approve(journalNo) {

    if (!this.exists(journalNo)) {

      return false;

    }

    this._journals[journalNo].status = "Approved";

    return true;

  }

  post(journalNo) {

    if (!this.exists(journalNo)) {

      return false;

    }

    this._journals[journalNo].status = "Posted";

    return true;

  }

  reverse(journalNo) {

    if (!this.exists(journalNo)) {

      return false;

    }

    this._journals[journalNo].status = "Reversed";

    return true;

  }

  cancel(journalNo) {

    if (!this.exists(journalNo)) {

      return false;

    }

    this._journals[journalNo].status = "Cancelled";

    return true;

  }

  reopen(journalNo) {

    if (!this.exists(journalNo)) {

      return false;

    }

    this._journals[journalNo].status = "Draft";

    return true;

  }

  //=========================================================================
  // Filters
  //=========================================================================

  getDraft() {

    return Object.fromEntries(

      Object.entries(this._journals).filter(

        ([, journal]) => journal.status === "Draft"

      )

    );

  }

  getApproved() {

    return Object.fromEntries(

      Object.entries(this._journals).filter(

        ([, journal]) => journal.status === "Approved"

      )

    );

  }

  getPosted() {

    return Object.fromEntries(

      Object.entries(this._journals).filter(

        ([, journal]) => journal.status === "Posted"

      )

    );

  }

  getReversed() {

    return Object.fromEntries(

      Object.entries(this._journals).filter(

        ([, journal]) => journal.status === "Reversed"

      )

    );

  }

  getCancelled() {

    return Object.fromEntries(

      Object.entries(this._journals).filter(

        ([, journal]) => journal.status === "Cancelled"

      )

    );

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      journals: this.count(),

      draft: Object.keys(this.getDraft()).length,

      approved: Object.keys(this.getApproved()).length,

      posted: Object.keys(this.getPosted()).length,

      reversed: Object.keys(this.getReversed()).length,

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

      journals: this.getAll(),

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

function registerAccountingChartOfAccountsManager() {
function bootAccountingJournalManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "Accounting",
      "JournalManager",
      new AccountingJournalManager()
    );
  }
}
}