/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 129_Manufacturing_MaterialReceiptManager.gs
 * Module      : Manufacturing
 * Class       : ManufacturingMaterialReceiptManager
 * Version     : 1.0.0
 * Description : Manufacturing Material Receipt Management Service
 * =============================================================================
 */

'use strict';

class ManufacturingMaterialReceiptManager extends BaseService {

  constructor() {

    super("ManufacturingMaterialReceiptManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._materialReceipts = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(receiptId, data) {

    if (this.exists(receiptId)) {

      return false;

    }

    this._materialReceipts[receiptId] = Object.assign({

      workOrderId: "",

      materialCode: "",

      materialName: "",

      warehouse: "",

      receiptDate: "",

      quantity: 0,

      unit: "",

      receivedBy: "",

      status: "Draft"

    }, data || {});

    return true;

  }

  update(receiptId, data) {

    if (!this.exists(receiptId)) {

      return false;

    }

    Object.assign(

      this._materialReceipts[receiptId],

      data || {}

    );

    return true;

  }

  get(receiptId) {

    return this._materialReceipts[receiptId] || null;

  }

  getAll() {

    return this._materialReceipts;

  }

  exists(receiptId) {

    return this._materialReceipts.hasOwnProperty(receiptId);

  }

  remove(receiptId) {

    if (!this.exists(receiptId)) {

      return false;

    }

    delete this._materialReceipts[receiptId];

    return true;

  }

  clear() {

    this._materialReceipts = {};

    return true;

  }

  count() {

    return Object.keys(this._materialReceipts).length;

  }

  keys() {

    return Object.keys(this._materialReceipts);

  }

  //=========================================================================
  // Workflow
  //=========================================================================

  approve(receiptId) {

    if (!this.exists(receiptId)) {

      return false;

    }

    this._materialReceipts[receiptId].status = "Approved";

    return true;

  }

  receive(receiptId) {

    if (!this.exists(receiptId)) {

      return false;

    }

    this._materialReceipts[receiptId].status = "Received";

    return true;

  }

  reverse(receiptId) {

    if (!this.exists(receiptId)) {

      return false;

    }

    this._materialReceipts[receiptId].status = "Reversed";

    return true;

  }

  reopen(receiptId) {

    if (!this.exists(receiptId)) {

      return false;

    }

    this._materialReceipts[receiptId].status = "Draft";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getDraft() {

    return this.filter(receipt =>
      receipt.status === "Draft"
    );

  }

  getApproved() {

    return this.filter(receipt =>
      receipt.status === "Approved"
    );

  }

  getReceived() {

    return this.filter(receipt =>
      receipt.status === "Received"
    );

  }

  getReversed() {

    return this.filter(receipt =>
      receipt.status === "Reversed"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._materialReceipts).forEach(id => {

      if (callback(this._materialReceipts[id])) {

        results[id] = this._materialReceipts[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      materialReceipts: this.count(),

      draft: Object.keys(this.getDraft()).length,

      approved: Object.keys(this.getApproved()).length,

      received: Object.keys(this.getReceived()).length,

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

      materialReceipts: this.getAll(),

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

WEF.ServiceContainer.registerModuleService(
  "Manufacturing",
  "MaterialReceiptManager",
  new ManufacturingMaterialReceiptManager()
);