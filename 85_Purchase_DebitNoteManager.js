/**
 * ==============================================================================
 * WEF ERP Framework
 * 85_Purchase_DebitNoteManager.gs
 * ------------------------------------------------------------------------------
 * Purchase Debit Note Manager
 * Version : 1.0.0
 * ==============================================================================
 */

class PurchaseDebitNoteManager extends BaseService {

  //==========================================================================
  // Constructor
  //==========================================================================

  constructor() {

    super("PurchaseDebitNoteManager");

    this._debitNotes = {};

  }

  //==========================================================================
  // Create
  //==========================================================================

  create(id, data) {

    if (!id) return false;

    this._debitNotes[id] = Object.assign({

      status: "Draft"

    }, data || {});

    return true;

  }

  //==========================================================================
  // Exists
  //==========================================================================

  exists(id) {

    return id in this._debitNotes;

  }

  //==========================================================================
  // Get
  //==========================================================================

  get(id) {

    return this._debitNotes[id] || null;

  }

  //==========================================================================
  // Update
  //==========================================================================

  update(id, data) {

    if (!this.exists(id)) return false;

    Object.assign(this._debitNotes[id], data);

    return true;

  }

  //==========================================================================
  // Remove
  //==========================================================================

  remove(id) {

    if (!this.exists(id)) return false;

    delete this._debitNotes[id];

    return true;

  }

  //==========================================================================
  // Clear
  //==========================================================================

  clear() {

    this._debitNotes = {};

    return true;

  }

  //==========================================================================
  // All
  //==========================================================================

  all() {

    return this._debitNotes;

  }

  //==========================================================================
  // Count
  //==========================================================================

  count() {

    return Object.keys(this._debitNotes).length;

  }

  //==========================================================================
  // Keys
  //==========================================================================

  keys() {

    return Object.keys(this._debitNotes);

  }

  //==========================================================================
  // Approve
  //==========================================================================

  approve(id) {

    if (!this.exists(id)) return false;

    this._debitNotes[id].status = "Approved";

    return true;

  }

  //==========================================================================
  // Cancel
  //==========================================================================

  cancel(id) {

    if (!this.exists(id)) return false;

    this._debitNotes[id].status = "Cancelled";

    return true;

  }

  //==========================================================================
  // Issue
  //==========================================================================

  issue(id) {

    if (!this.exists(id)) return false;

    this._debitNotes[id].status = "Issued";

    return true;

  }

  //==========================================================================
  // Reopen
  //==========================================================================

  reopen(id) {

    if (!this.exists(id)) return false;

    this._debitNotes[id].status = "Draft";

    return true;

  }

  //==========================================================================
  // Approved
  //==========================================================================

  approved() {

    return Object.fromEntries(

      Object.entries(this._debitNotes).filter(

        ([, debitNote]) => debitNote.status === "Approved"

      )

    );

  }

  //==========================================================================
  // Cancelled
  //==========================================================================

  cancelled() {

    return Object.fromEntries(

      Object.entries(this._debitNotes).filter(

        ([, debitNote]) => debitNote.status === "Cancelled"

      )

    );

  }

  //==========================================================================
  // Issued
  //==========================================================================

  issued() {

    return Object.fromEntries(

      Object.entries(this._debitNotes).filter(

        ([, debitNote]) => debitNote.status === "Issued"

      )

    );

  }

  //==========================================================================
  // Drafts
  //==========================================================================

  drafts() {

    return Object.fromEntries(

      Object.entries(this._debitNotes).filter(

        ([, debitNote]) => debitNote.status === "Draft"

      )

    );

  }

  //==========================================================================
  // Statistics
  //==========================================================================

  statistics() {

    return {

      debitNotes: this.count(),

      approved: Object.keys(this.approved()).length,

      cancelled: Object.keys(this.cancelled()).length,

      issued: Object.keys(this.issued()).length,

      drafts: Object.keys(this.drafts()).length

    };

  }

  //==========================================================================
  // Report
  //==========================================================================

  report() {

    return this.statistics();

  }

  //==========================================================================
  // Health
  //==========================================================================

  health() {

    const stats = this.statistics();

    stats.initialized = this.isInitialized();

    stats.healthy = true;

    return stats;

  }

  //==========================================================================
  // Export
  //==========================================================================

  export() {

    return {

      debitNotes: this.all(),

      statistics: this.statistics(),

      health: this.health()

    };

  }

  //==========================================================================
  // About
  //==========================================================================

  about() {

    return {

      service: "PurchaseDebitNoteManager",

      version: "1.0.0",

      initialized: this.isInitialized(),

      created: this.getCreatedTime(),

      statistics: this.statistics()

    };

  }

}

//==============================================================================
// Registration
//==============================================================================

WEF.ServiceContainer.registerModuleService(
  "Purchase",
  "DebitNoteManager",
  new PurchaseDebitNoteManager()
);