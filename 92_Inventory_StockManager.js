/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 92_Inventory_StockManager.gs
 * Version     : 1.0.0
 * Description : Inventory Stock Manager
 * =============================================================================
 */

'use strict';

class InventoryStockManager extends BaseService {

  constructor() {

    super("InventoryStockManager");

    this.initialize();

  }

  //==========================================================================
  // Initialization
  //==========================================================================

  initialize() {

    super.initialize();

    this._stocks = {};

    return this;

  }

  reset() {

    this._stocks = {};

    return true;

  }

  //==========================================================================
  // CRUD
  //==========================================================================

  create(stockId, data) {

    this._stocks[stockId] = Object.assign({

      status: "Available"

    }, data || {});

    return stockId;

  }

  update(stockId, data) {

    if (!this.exists(stockId))
      return false;

    Object.assign(this._stocks[stockId], data);

    return true;

  }

  get(stockId) {

    return this._stocks[stockId] || null;

  }

  getAll() {

    return Object.assign({}, this._stocks);

  }

  remove(stockId) {

    if (!this.exists(stockId))
      return false;

    delete this._stocks[stockId];

    return true;

  }

  clear() {

    this._stocks = {};

    return true;

  }

  exists(stockId) {

    return this._stocks.hasOwnProperty(stockId);

  }

  keys() {

    return Object.keys(this._stocks);

  }

  count() {

    return this.keys().length;

  }

  //==========================================================================
  // Status
  //==========================================================================

  reserve(stockId) {

    if (!this.exists(stockId))
      return false;

    this._stocks[stockId].status = "Reserved";

    return true;

  }

  release(stockId) {

    if (!this.exists(stockId))
      return false;

    this._stocks[stockId].status = "Available";

    return true;

  }

  issue(stockId) {

    if (!this.exists(stockId))
      return false;

    this._stocks[stockId].status = "Issued";

    return true;

  }

  receive(stockId) {

    if (!this.exists(stockId))
      return false;

    this._stocks[stockId].status = "Available";

    return true;

  }

  adjust(stockId) {

    if (!this.exists(stockId))
      return false;

    this._stocks[stockId].status = "Adjusted";

    return true;

  }

  //==========================================================================
  // Filters
  //==========================================================================

  getAvailable() {

    const result = {};

    Object.keys(this._stocks).forEach(id => {

      if (this._stocks[id].status === "Available") {

        result[id] = this._stocks[id];

      }

    });

    return result;

  }

  getReserved() {

    const result = {};

    Object.keys(this._stocks).forEach(id => {

      if (this._stocks[id].status === "Reserved") {

        result[id] = this._stocks[id];

      }

    });

    return result;

  }

  getIssued() {

    const result = {};

    Object.keys(this._stocks).forEach(id => {

      if (this._stocks[id].status === "Issued") {

        result[id] = this._stocks[id];

      }

    });

    return result;

  }

  getAdjusted() {

    const result = {};

    Object.keys(this._stocks).forEach(id => {

      if (this._stocks[id].status === "Adjusted") {

        result[id] = this._stocks[id];

      }

    });

    return result;

  }

  //==========================================================================
  // Statistics
  //==========================================================================

  statistics() {

    return {

      stocks: this.count(),

      available: Object.keys(this.getAvailable()).length,

      reserved: Object.keys(this.getReserved()).length,

      issued: Object.keys(this.getIssued()).length,

      adjusted: Object.keys(this.getAdjusted()).length

    };

  }

  //==========================================================================
  // Health
  //==========================================================================

  health() {

    return {

      service: this.getName(),

      version: this.getVersion(),

      initialized: this.isInitialized(),

      status: "READY",

      healthy: true,

      stocks: this.count(),

      available: Object.keys(this.getAvailable()).length,

      reserved: Object.keys(this.getReserved()).length,

      issued: Object.keys(this.getIssued()).length,

      adjusted: Object.keys(this.getAdjusted()).length

    };

  }

  //==========================================================================
  // Report
  //==========================================================================

  report() {

    return {

      statistics: this.statistics(),

      health: this.health(),

      stocks: this.getAll()

    };

  }

  //==========================================================================
  // Information
  //==========================================================================

  info() {

    return {

      service: this.getName(),

      version: this.getVersion(),

      created: this.getCreatedTime(),

      initialized: this.isInitialized(),

      statistics: this.statistics()

    };

  }

}

//==============================================================================
// Registration
//==============================================================================

WEF.ServiceContainer.registerModuleService(
  "Inventory",
  "StockManager",
  new InventoryStockManager()
);