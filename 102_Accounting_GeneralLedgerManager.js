/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 102_Accounting_GeneralLedgerManager.gs
 * Module      : Accounting
 * Class       : AccountingGeneralLedgerManager
 * Version     : 1.0.0
 * Description : General Ledger Management Service
 * =============================================================================
 */

'use strict';

class AccountingGeneralLedgerManager extends BaseService {

  constructor() {

    super("AccountingGeneralLedgerManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._ledger = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(entryNo, data) {

    if (this.exists(entryNo)) {

      return false;

    }

    this._ledger[entryNo] = Object.assign({

      journal: "",

      account: "",

      debit: 0,

      credit: 0,

      balance: 0,

      date: "",

      description: "",

      status: "Draft"

    }, data || {});

    return true;

  }

  update(entryNo, data) {

    if (!this.exists(entryNo)) {

      return false;

    }

    Object.assign(

      this._ledger[entryNo],

      data || {}

    );

    return true;

  }

  get(entryNo) {

    return this._ledger[entryNo] || null;

  }

  getAll() {

    return this._ledger;

  }

  exists(entryNo) {

    return this._ledger.hasOwnProperty(entryNo);

  }

  remove(entryNo) {

    if (!this.exists(entryNo)) {

      return false;

    }

    delete this._ledger[entryNo];

    return true;

  }

  clear() {

    this._ledger = {};

    return true;

  }

  count() {

    return Object.keys(this._ledger).length;

  }

  keys() {

    return Object.keys(this._ledger);

  }

  //=========================================================================
  // Workflow
  //=========================================================================

  post(entryNo) {

    if (!this.exists(entryNo)) {

      return false;

    }

    this._ledger[entryNo].status = "Posted";

    return true;

  }

  lock(entryNo) {

    if (!this.exists(entryNo)) {

      return false;

    }

    this._ledger[entryNo].status = "Locked";

    return true;

  }

  unlock(entryNo) {

    if (!this.exists(entryNo)) {

      return false;

    }

    this._ledger[entryNo].status = "Posted";

    return true;

  }

  reverse(entryNo) {

    if (!this.exists(entryNo)) {

      return false;

    }

    this._ledger[entryNo].status = "Reversed";

    return true;

  }

  reopen(entryNo) {

    if (!this.exists(entryNo)) {

      return false;

    }

    this._ledger[entryNo].status = "Draft";

    return true;

  }

  //=========================================================================
  // Filters
  //=========================================================================

  getDraft() {

    return Object.fromEntries(

      Object.entries(this._ledger).filter(

        ([, entry]) => entry.status === "Draft"

      )

    );

  }

  getPosted() {

    return Object.fromEntries(

      Object.entries(this._ledger).filter(

        ([, entry]) => entry.status === "Posted"

      )

    );

  }

  getLocked() {

    return Object.fromEntries(

      Object.entries(this._ledger).filter(

        ([, entry]) => entry.status === "Locked"

      )

    );

  }

  getReversed() {

    return Object.fromEntries(

      Object.entries(this._ledger).filter(

        ([, entry]) => entry.status === "Reversed"

      )

    );

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      entries: this.count(),

      draft: Object.keys(this.getDraft()).length,

      posted: Object.keys(this.getPosted()).length,

      locked: Object.keys(this.getLocked()).length,

      reversed: Object.keys(this.getReversed()).length

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

      ledger: this.getAll(),

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

function registerAccountingGeneralLedgerManager() {
function bootAccountingGeneralLedgerManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "Accounting",
      "GeneralLedgerManager",
      new AccountingGeneralLedgerManager()
    );
  }
} 
}