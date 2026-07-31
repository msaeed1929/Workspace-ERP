/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * -----------------------------------------------------------------------------
 * File        : 70_Sales_OrderManager.gs
 * Version     : 1.0.0
 * Description : Sales Order Manager
 * =============================================================================
 */

'use strict';

class SalesOrderManager extends BaseService {

  //===========================================================================
  // Constructor
  //===========================================================================

  constructor() {

    super("SalesOrderManager");


  }

  //===========================================================================
  // Initialization
  //===========================================================================

  initialize() {

    super.initialize();

    this._orders = {};

    return this;

  }

  //===========================================================================
  // CRUD
  //===========================================================================

  create(orderNo, order) {

    this._orders[orderNo] = order;

    return true;

  }

  exists(orderNo) {

    return orderNo in this._orders;

  }

  get(orderNo) {

    return this._orders[orderNo] || null;

  }

  update(orderNo, order) {

    if (!this.exists(orderNo)) return false;

    this._orders[orderNo] = order;

    return true;

  }

  remove(orderNo) {

    if (!this.exists(orderNo)) return false;

    delete this._orders[orderNo];

    return true;

  }

  all() {

    return this._orders;

  }

  numbers() {

    return Object.keys(this._orders);

  }

  count() {

    return this.numbers().length;

  }

  //===========================================================================
  // Order Status
  //===========================================================================

  confirm(orderNo) {

    if (!this.exists(orderNo)) return false;

    this._orders[orderNo].status = "Confirmed";

    return true;

  }

  cancel(orderNo) {

    if (!this.exists(orderNo)) return false;

    this._orders[orderNo].status = "Cancelled";

    return true;

  }

  close(orderNo) {

    if (!this.exists(orderNo)) return false;

    this._orders[orderNo].status = "Closed";

    return true;

  }

  reopen(orderNo) {

    if (!this.exists(orderNo)) return false;

    this._orders[orderNo].status = "Open";

    return true;

  }

  //===========================================================================
  // Filters
  //===========================================================================

  confirmed() {

    return Object.fromEntries(

      Object.entries(this._orders)

        .filter(([number, order]) => order.status === "Confirmed")

    );

  }

  cancelled() {

    return Object.fromEntries(

      Object.entries(this._orders)

        .filter(([number, order]) => order.status === "Cancelled")

    );

  }

  closed() {

    return Object.fromEntries(

      Object.entries(this._orders)

        .filter(([number, order]) => order.status === "Closed")

    );

  }

  openOrders() {

    return Object.fromEntries(

      Object.entries(this._orders)

        .filter(([number, order]) => order.status === "Open")

    );

  }

  //=========================================================================
  // Maintenance
  //=========================================================================

  clear() {

    this._orders = {};

    return true;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      orders: this.count(),
      confirmed: Object.keys(this.confirmed()).length,
      cancelled: Object.keys(this.cancelled()).length,
      closed: Object.keys(this.closed()).length,
      open: Object.keys(this.openOrders()).length

    };

  }

  health() {

    return {

      initialized: this.isInitialized(),
      healthy: true,
      orders: this.count(),
      confirmed: Object.keys(this.confirmed()).length,
      cancelled: Object.keys(this.cancelled()).length,
      closed: Object.keys(this.closed()).length,
      open: Object.keys(this.openOrders()).length

    };

  }

  report() {

    return {

      orders: this.all(),
      statistics: this.statistics(),
      health: this.health()

    };

  }

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

//==============================================================================
// Sales Registration
//==============================================================================function bootSalesOrderManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "Sales",
      "OrderManager",
      new SalesOrderManager()
    );
  }
}
