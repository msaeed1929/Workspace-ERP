/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 91_Inventory_WarehouseManager.gs
 * Version     : 1.0.0
 * Description : Inventory Warehouse Manager
 * =============================================================================
 */

'use strict';

class InventoryWarehouseManager extends BaseService {

  constructor() {

    super("InventoryWarehouseManager");

    this.initialize();

  }

  //==========================================================================
  // Initialization
  //==========================================================================

  initialize() {

    super.initialize();

    this._warehouses = {};

    return this;

  }

  //==========================================================================
  // CRUD
  //==========================================================================

  create(code, data) {

    this._warehouses[code] = Object.assign({}, data);

    return this;

  }

  update(code, data) {

    if (!this.exists(code)) {

      return false;

    }

    Object.assign(this._warehouses[code], data);

    return true;

  }

  remove(code) {

    if (!this.exists(code)) {

      return false;

    }

    delete this._warehouses[code];

    return true;

  }

  clear() {

    this._warehouses = {};

    return true;

  }

  get(code) {

    return this._warehouses[code] || null;

  }

  getAll() {

    return Object.assign({}, this._warehouses);

  }

  all() {

    return this.getAll();

  }

  exists(code) {

    return this._warehouses.hasOwnProperty(code);

  }

  count() {

    return Object.keys(this._warehouses).length;

  }

  keys() {

    return Object.keys(this._warehouses);

  }

  //==========================================================================
  // Status Management
  //==========================================================================

  activate(code) {

    if (!this.exists(code)) {

      return false;

    }

    this._warehouses[code].status = "Active";

    return true;

  }

  deactivate(code) {

    if (!this.exists(code)) {

      return false;

    }

    this._warehouses[code].status = "Inactive";

    return true;

  }

  close(code) {

    if (!this.exists(code)) {

      return false;

    }

    this._warehouses[code].status = "Closed";

    return true;

  }

  reopen(code) {

    if (!this.exists(code)) {

      return false;

    }

    this._warehouses[code].status = "Active";

    return true;

  }

  //==========================================================================
  // Status Filters
  //==========================================================================

  getActive() {

    return this.filterByStatus("Active");

  }

  getInactive() {

    return this.filterByStatus("Inactive");

  }

  getClosed() {

    return this.filterByStatus("Closed");

  }

  filterByStatus(status) {

    const result = {};

    Object.keys(this._warehouses).forEach(code => {

      if (this._warehouses[code].status === status) {

        result[code] = this._warehouses[code];

      }

    });

    return result;

  }

  //==========================================================================
  // Statistics
  //==========================================================================

  statistics() {

    return {

      warehouses: this.count(),

      active: Object.keys(this.getActive()).length,

      inactive: Object.keys(this.getInactive()).length,

      closed: Object.keys(this.getClosed()).length

    };

  }

  //==========================================================================
  // Health
  //==========================================================================

  health() {

    return {

      healthy: true,

      initialized: this.isInitialized(),

      warehouses: this.count(),

      active: Object.keys(this.getActive()).length,

      inactive: Object.keys(this.getInactive()).length,

      closed: Object.keys(this.getClosed()).length

    };

  }

  //==========================================================================
  // Report
  //==========================================================================

  report() {

    return {

      statistics: this.statistics(),

      health: this.health(),

      warehouses: this.getAll()

    };

  }

  //==========================================================================
  // About
  //==========================================================================

  about() {

    return {

      service: this.getName(),

      version: this.getVersion(),

      initialized: this.isInitialized(),

      created: this.getCreatedTime(),

      statistics: this.statistics()

    };

  }

  //=========================================================================
  // Reports
  //=========================================================================

  statistics() {

    const warehouses = this.count();

    let active = 0;
    let inactive = 0;
    let closed = 0;

    Object.values(this._warehouses).forEach(warehouse => {

      switch (warehouse.status) {

        case "Active":
          active++;
          break;

        case "Inactive":
          inactive++;
          break;

        case "Closed":
          closed++;
          break;

      }

    });

    return {

      warehouses,
      active,
      inactive,
      closed

    };

  }

  health() {

    return Object.assign(
      super.health(),
      this.statistics(),
      {
        healthy: true
      }
    );

  }

  export() {

    return {

      warehouses: this.all(),
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
// Registration
//==============================================================================

WEF.ServiceContainer.registerModuleService(
  "Inventory",
  "WarehouseManager",
  new InventoryWarehouseManager()
);