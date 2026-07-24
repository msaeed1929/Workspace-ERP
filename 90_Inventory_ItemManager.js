/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 90_Inventory_ItemManager.gs
 * Version     : 1.0.0
 * Description : Inventory Item Manager
 * =============================================================================
 */

'use strict';

class InventoryItemManager extends BaseService {

  constructor() {

    super("InventoryItemManager");

    this.initialize();

  }

  //==========================================================================
  // Initialization
  //==========================================================================

  initialize() {

    super.initialize();

    this._items = {};

    return this;

  }

  //==========================================================================
  // CRUD
  //==========================================================================

  create(code, data) {

    this._items[code] = Object.assign({}, data);

    return this;

  }

  update(code, data) {

    if (!this.exists(code)) {

      return false;

    }

    Object.assign(this._items[code], data);

    return true;

  }

  remove(code) {

    if (!this.exists(code)) {

      return false;

    }

    delete this._items[code];

    return true;

  }

  clear() {

    this._items = {};

    return true;

  }

  get(code) {

    return this._items[code] || null;

  }

  getAll() {

    return Object.assign({}, this._items);

  }

  all() {

    return this.getAll();

  }

  exists(code) {

    return this._items.hasOwnProperty(code);

  }

  count() {

    return Object.keys(this._items).length;

  }

  keys() {

    return Object.keys(this._items);

  }

  //==========================================================================
  // Status Management
  //==========================================================================

  activate(code) {

    if (!this.exists(code)) {

      return false;

    }

    this._items[code].status = "Active";

    return true;

  }

  deactivate(code) {

    if (!this.exists(code)) {

      return false;

    }

    this._items[code].status = "Inactive";

    return true;

  }

  discontinue(code) {

    if (!this.exists(code)) {

      return false;

    }

    this._items[code].status = "Discontinued";

    return true;

  }

  reactivate(code) {

    if (!this.exists(code)) {

      return false;

    }

    this._items[code].status = "Active";

    return true;

  }

  //==========================================================================
  // Filters
  //==========================================================================

  getActive() {

    return this.filterByStatus("Active");

  }

  getInactive() {

    return this.filterByStatus("Inactive");

  }

  getDiscontinued() {

    return this.filterByStatus("Discontinued");

  }

  filterByStatus(status) {

    const result = {};

    Object.keys(this._items).forEach(code => {

      if (this._items[code].status === status) {

        result[code] = this._items[code];

      }

    });

    return result;

  }

  //==========================================================================
  // Statistics
  //==========================================================================

  statistics() {

    return {

      items: this.count(),

      active: Object.keys(this.getActive()).length,

      inactive: Object.keys(this.getInactive()).length,

      discontinued: Object.keys(this.getDiscontinued()).length

    };

  }

  //==========================================================================
  // Health
  //==========================================================================

  health() {

    return {

      healthy: true,

      initialized: this.isInitialized(),

      items: this.count(),

      active: Object.keys(this.getActive()).length,

      inactive: Object.keys(this.getInactive()).length,

      discontinued: Object.keys(this.getDiscontinued()).length

    };

  }

  //==========================================================================
  // Report
  //==========================================================================

  report() {

    return {

      statistics: this.statistics(),

      health: this.health(),

      items: this.getAll()

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

}

//==============================================================================
// Registration
//==============================================================================

WEF.ServiceContainer.registerModuleService(
  "Inventory",
  "ItemManager",
  new InventoryItemManager()
);