/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * -----------------------------------------------------------------------------
 * File        : 80_Purchase_RequisitionManager.gs
 * Version     : 1.0.0
 * Description : Purchase Requisition Manager
 * =============================================================================
 */

'use strict';

class PurchaseRequisitionManager extends BaseService {

  //===========================================================================
  // Constructor
  //===========================================================================

  constructor() {

    super("PurchaseRequisitionManager");

    this._requisitions = {};

  }

  //===========================================================================
  // Initialization
  //===========================================================================

  initialize() {

    super.initialize();

    this._requisitions = {};

    return this;

  }

  //===========================================================================
  // CRUD
  //===========================================================================

  create(requisitionNo, requisition) {

    this._requisitions[requisitionNo] = requisition;

    return true;

  }

  exists(requisitionNo) {

    return requisitionNo in this._requisitions;

  }

  get(requisitionNo) {

    return this._requisitions[requisitionNo] || null;

  }

  update(requisitionNo, requisition) {

    if (!this.exists(requisitionNo)) {

      return false;

    }

    this._requisitions[requisitionNo] = requisition;

    return true;

  }

  remove(requisitionNo) {

    if (!this.exists(requisitionNo)) {

      return false;

    }

    delete this._requisitions[requisitionNo];

    return true;

  }

  clear() {

    this._requisitions = {};

    return true;

  }

  all() {

    return this._requisitions;

  }

  numbers() {

    return Object.keys(this._requisitions);

  }

  count() {

    return this.numbers().length;

  }

  //===========================================================================
  // Business Operations
  //===========================================================================

  approve(requisitionNo) {

    if (!this.exists(requisitionNo)) {

      return false;

    }

    this._requisitions[requisitionNo].status = "Approved";

    return true;

  }

  reject(requisitionNo) {

    if (!this.exists(requisitionNo)) {

      return false;

    }

    this._requisitions[requisitionNo].status = "Rejected";

    return true;

  }

  close(requisitionNo) {

    if (!this.exists(requisitionNo)) {

      return false;

    }

    this._requisitions[requisitionNo].status = "Closed";

    return true;

  }

  reopen(requisitionNo) {

    if (!this.exists(requisitionNo)) {

      return false;

    }

    this._requisitions[requisitionNo].status = "Open";

    return true;

  }

  //===========================================================================
  // Workflow
  //===========================================================================

  approve(requisitionNo) {

    if (!this.exists(requisitionNo)) {

      return false;

    }

    this._requisitions[requisitionNo].status = "Approved";

    return true;

  }

  reject(requisitionNo) {

    if (!this.exists(requisitionNo)) {

      return false;

    }

    this._requisitions[requisitionNo].status = "Rejected";

    return true;

  }

  close(requisitionNo) {

    if (!this.exists(requisitionNo)) {

      return false;

    }

    this._requisitions[requisitionNo].status = "Closed";

    return true;

  }

  reopen(requisitionNo) {

    if (!this.exists(requisitionNo)) {

      return false;

    }

    this._requisitions[requisitionNo].status = "Open";

    return true;

  }

  //===========================================================================
  // Queries
  //===========================================================================

  approved() {

    return Object.fromEntries(

      Object.entries(this._requisitions)

        .filter(function(item){

          return item[1].status === "Approved";

        })

    );

  }

  rejected() {

    return Object.fromEntries(

      Object.entries(this._requisitions)

        .filter(function(item){

          return item[1].status === "Rejected";

        })

    );

  }

  closed() {

    return Object.fromEntries(

      Object.entries(this._requisitions)

        .filter(function(item){

          return item[1].status === "Closed";

        })

    );

  }

  open() {

    return Object.fromEntries(

      Object.entries(this._requisitions)

        .filter(function(item){

          return item[1].status === "Open";

        })

    );

  }

  //===========================================================================
  // Statistics
  //===========================================================================

  statistics() {

    return {

      requisitions : this.count(),

      open : Object.keys(this.open()).length,

      approved : Object.keys(this.approved()).length,

      rejected : Object.keys(this.rejected()).length,

      closed : Object.keys(this.closed()).length

    };

  }

  health() {

    var stats = this.statistics();

    stats.initialized = this.isInitialized();

    stats.healthy = true;

    return stats;

  }

  report() {

    return {

      requisitions : this.all(),

      statistics : this.statistics(),

      health : this.health()

    };

  }

  //===========================================================================
  // About
  //===========================================================================

  about() {

    return {

      service     : this.getName(),

      version     : this.getVersion(),

      created     : this.getCreatedTime(),

      initialized : this.isInitialized(),

      statistics  : this.statistics()

    };

  }

}

//==============================================================================
// Purchase Registration
//==============================================================================function bootPurchaseRequisitionManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "Purchase",
      "RequisitionManager",
      new PurchaseRequisitionManager()
    );
  }
}