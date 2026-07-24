/**
 * ===========================================================================
 * WEF ERP Framework
 * 84_Purchase_ReturnManager.gs
 * Version: 1.0.0
 * ===========================================================================
 */

'use strict';

class PurchaseReturnManager extends BaseService {

  //===========================================================================
  // Constructor
  //===========================================================================

  constructor() {

    super("PurchaseReturnManager");

    this._returns = {};

    this.initialize();

  }

  //===========================================================================
  // Initialization
  //===========================================================================

  initialize() {

    super.initialize();

    this._returns = {};

    return this;

  }

  //===========================================================================
  // CRUD
  //===========================================================================

  create(returnNo, data) {

    this._returns[returnNo] = Object.assign({}, data);

    return true;

  }

  exists(returnNo) {

    return returnNo in this._returns;

  }

  get(returnNo) {

    return this._returns[returnNo] || null;

  }

  update(returnNo, data) {

    if (!this.exists(returnNo)) {

      return false;

    }

    this._returns[returnNo] = Object.assign({}, data);

    return true;

  }

  remove(returnNo) {

    if (!this.exists(returnNo)) {

      return false;

    }

    delete this._returns[returnNo];

    return true;

  }

  clear() {

    this._returns = {};

    return true;

  }

  all() {

    return this._returns;

  }

  numbers() {

    return Object.keys(this._returns);

  }

  count() {

    return this.numbers().length;

  }

  //===========================================================================
  // Status Operations
  //===========================================================================

  approve(returnNo) {

    if (!this.exists(returnNo)) {

      return false;

    }

    this._returns[returnNo].status = "Approved";

    return true;

  }

  reject(returnNo) {

    if (!this.exists(returnNo)) {

      return false;

    }

    this._returns[returnNo].status = "Rejected";

    return true;

  }

  receive(returnNo) {

    if (!this.exists(returnNo)) {

      return false;

    }

    this._returns[returnNo].status = "Received";

    return true;

  }

  close(returnNo) {

    if (!this.exists(returnNo)) {

      return false;

    }

    this._returns[returnNo].status = "Closed";

    return true;

  }

  reopen(returnNo) {

    if (!this.exists(returnNo)) {

      return false;

    }

    this._returns[returnNo].status = "Open";

    return true;

  }

  //===========================================================================
  // Status Filters
  //===========================================================================

  approved() {

    return Object.fromEntries(

      Object.entries(this._returns)

        .filter(([k, v]) => v.status === "Approved")

    );

  }

  rejected() {

    return Object.fromEntries(

      Object.entries(this._returns)

        .filter(([k, v]) => v.status === "Rejected")

    );

  }

  received() {

    return Object.fromEntries(

      Object.entries(this._returns)

        .filter(([k, v]) => v.status === "Received")

    );

  }

  closed() {

    return Object.fromEntries(

      Object.entries(this._returns)

        .filter(([k, v]) => v.status === "Closed")

    );

  }

  openReturns() {

    return Object.fromEntries(

      Object.entries(this._returns)

        .filter(([k, v]) => v.status === "Open")

    );

  }

  //===========================================================================
  // Statistics
  //===========================================================================

  statistics() {

    return {

      returns: this.count(),

      approved: Object.keys(this.approved()).length,

      rejected: Object.keys(this.rejected()).length,

      received: Object.keys(this.received()).length,

      closed: Object.keys(this.closed()).length,

      open: Object.keys(this.openReturns()).length

    };

  }

  //===========================================================================
  // Health
  //===========================================================================

  health() {

    const s = this.statistics();

    s.initialized = this.isInitialized();

    s.healthy = true;

    return s;

  }

  //===========================================================================
  // Export
  //===========================================================================

  report() {

    return this.statistics();

  }

  export() {

    return {

      returns: this.all(),

      statistics: this.statistics(),

      health: this.health()

    };

  }

  //===========================================================================
  // About
  //===========================================================================

  about() {

    return {

      service: "PurchaseReturnManager",

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
  "ReturnManager",
  new PurchaseReturnManager()
);