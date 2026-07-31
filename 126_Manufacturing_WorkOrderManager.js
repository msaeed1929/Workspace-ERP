/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 126_Manufacturing_WorkOrderManager.gs
 * Module      : Manufacturing
 * Class       : ManufacturingWorkOrderManager
 * Version     : 1.0.0
 * Description : Manufacturing Work Order Management Service
 * =============================================================================
 */

'use strict';

class ManufacturingWorkOrderManager extends BaseService {

  constructor() {

    super("ManufacturingWorkOrderManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._workOrders = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(workOrderId, data) {

    if (this.exists(workOrderId)) {

      return false;

    }

    this._workOrders[workOrderId] = Object.assign({

      workOrderNo: "",

      productCode: "",

      productName: "",

      bomId: "",

      quantity: 0,

      plannedStartDate: "",

      plannedEndDate: "",

      status: "Draft"

    }, data || {});

    return true;

  }

  update(workOrderId, data) {

    if (!this.exists(workOrderId)) {

      return false;

    }

    Object.assign(

      this._workOrders[workOrderId],

      data || {}

    );

    return true;

  }

  get(workOrderId) {

    return this._workOrders[workOrderId] || null;

  }

  getAll() {

    return this._workOrders;

  }

  exists(workOrderId) {

    return this._workOrders.hasOwnProperty(workOrderId);

  }

  remove(workOrderId) {

    if (!this.exists(workOrderId)) {

      return false;

    }

    delete this._workOrders[workOrderId];

    return true;

  }

  clear() {

    this._workOrders = {};

    return true;

  }

  count() {

    return Object.keys(this._workOrders).length;

  }

  keys() {

    return Object.keys(this._workOrders);

  }

  //=========================================================================
  // Workflow
  //=========================================================================

  approve(workOrderId) {

    if (!this.exists(workOrderId)) {

      return false;

    }

    this._workOrders[workOrderId].status = "Approved";

    return true;

  }

  release(workOrderId) {

    if (!this.exists(workOrderId)) {

      return false;

    }

    this._workOrders[workOrderId].status = "Released";

    return true;

  }

  close(workOrderId) {

    if (!this.exists(workOrderId)) {

      return false;

    }

    this._workOrders[workOrderId].status = "Closed";

    return true;

  }

  reopen(workOrderId) {

    if (!this.exists(workOrderId)) {

      return false;

    }

    this._workOrders[workOrderId].status = "Draft";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getDraft() {

    return this.filter(workOrder =>
      workOrder.status === "Draft"
    );

  }

  getApproved() {

    return this.filter(workOrder =>
      workOrder.status === "Approved"
    );

  }

  getReleased() {

    return this.filter(workOrder =>
      workOrder.status === "Released"
    );

  }

  getClosed() {

    return this.filter(workOrder =>
      workOrder.status === "Closed"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._workOrders).forEach(id => {

      if (callback(this._workOrders[id])) {

        results[id] = this._workOrders[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      workOrders: this.count(),

      draft: Object.keys(this.getDraft()).length,

      approved: Object.keys(this.getApproved()).length,

      released: Object.keys(this.getReleased()).length,

      closed: Object.keys(this.getClosed()).length

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

      workOrders: this.getAll(),

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

function registerManufacturingWorkOrderManager() {
  WEF.ServiceContainer.registerModuleService(
    "Manufacturing",
    "WorkOrderManager",
    new ManufacturingWorkOrderManager()
  );
}