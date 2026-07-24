/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 94_Inventory_AdjustmentManager.gs
 * Version     : 1.0.0
 * Description : Inventory Adjustment Manager
 * =============================================================================
 */

'use strict';

class InventoryAdjustmentManager extends BaseService {

  //=========================================================================
  // Constructor
  //=========================================================================

  constructor() {

    super("InventoryAdjustmentManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._adjustments = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(id, data) {

    if (!id)
      return false;

    if (this.exists(id))
      return false;

    this._adjustments[id] = Object.assign({

      item: "",

      warehouse: "",

      quantity: 0,

      reason: "",

      status: "Draft"

    }, data || {});

    return true;

  }

  update(id, data) {

    if (!this.exists(id))
      return false;

    Object.assign(

      this._adjustments[id],

      data || {}

    );

    return true;

  }

  get(id) {

    return this._adjustments[id] || null;

  }

  all() {

    return Object.assign(

      {},

      this._adjustments

    );

  }

  exists(id) {

    return this._adjustments.hasOwnProperty(id);

  }

  remove(id) {

    if (!this.exists(id))
      return false;

    delete this._adjustments[id];

    return true;

  }

  clear() {

    this._adjustments = {};

    return true;

  }

  count() {

    return Object.keys(

      this._adjustments

    ).length;

  }

  keys() {

    return Object.keys(

      this._adjustments

    );

  }

  values() {

    return Object.values(

      this._adjustments

    );

  }

  //=========================================================================
  // Workflow
  //=========================================================================

  approve(id) {

    if (!this.exists(id))
      return false;

    this._adjustments[id].status = "Approved";

    return true;

  }

  apply(id) {

    if (!this.exists(id))
      return false;

    this._adjustments[id].status = "Applied";

    return true;

  }

  cancel(id) {

    if (!this.exists(id))
      return false;

    this._adjustments[id].status = "Cancelled";

    return true;

  }

  reopen(id) {

    if (!this.exists(id))
      return false;

    this._adjustments[id].status = "Draft";

    return true;

  }

  //=========================================================================
  // Filters
  //=========================================================================

  getDraft() {

    return this.filterByStatus("Draft");

  }

  getApproved() {

    return this.filterByStatus("Approved");

  }

  getApplied() {

    return this.filterByStatus("Applied");

  }

  getCancelled() {

    return this.filterByStatus("Cancelled");

  }

  filterByStatus(status) {

    const result = {};

    Object.keys(this._adjustments)

      .forEach(id => {

        if (

          this._adjustments[id].status === status

        ) {

          result[id] =

            this._adjustments[id];

        }

      });

    return result;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      adjustments: this.count(),

      draft: Object.keys(this.getDraft()).length,

      approved: Object.keys(this.getApproved()).length,

      applied: Object.keys(this.getApplied()).length,

      cancelled: Object.keys(this.getCancelled()).length

    };

  }

  //=========================================================================
  // Health
  //=========================================================================

  health() {

    const stats = this.statistics();

    return {

      service: this.getName(),

      version: this.getVersion(),

      initialized: this.isInitialized(),

      healthy: true,

      status: "READY",

      adjustments: stats.adjustments,

      draft: stats.draft,

      approved: stats.approved,

      applied: stats.applied,

      cancelled: stats.cancelled

    };

  }

  //=========================================================================
  // Report
  //=========================================================================

  report() {

    return {

      statistics: this.statistics(),

      health: this.health(),

      adjustments: this.all()

    };

  }

  //=========================================================================
  // Information
  //=========================================================================

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
  "AdjustmentManager",
  new InventoryAdjustmentManager()
);