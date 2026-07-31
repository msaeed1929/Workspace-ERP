/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 130_Manufacturing_MachineManager.gs
 * Module      : Manufacturing
 * Class       : ManufacturingMachineManager
 * Version     : 1.0.0
 * Description : Manufacturing Machine Management Service
 * =============================================================================
 */

'use strict';

class ManufacturingMachineManager extends BaseService {

  constructor() {

    super("ManufacturingMachineManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._machines = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(machineId, data) {

    if (this.exists(machineId)) {

      return false;

    }

    this._machines[machineId] = Object.assign({

      machineCode: "",

      machineName: "",

      department: "",

      location: "",

      capacity: 0,

      operator: "",

      lastMaintenanceDate: "",

      nextMaintenanceDate: "",

      status: "Draft"

    }, data || {});

    return true;

  }

  update(machineId, data) {

    if (!this.exists(machineId)) {

      return false;

    }

    Object.assign(

      this._machines[machineId],

      data || {}

    );

    return true;

  }

  get(machineId) {

    return this._machines[machineId] || null;

  }

  getAll() {

    return this._machines;

  }

  exists(machineId) {

    return this._machines.hasOwnProperty(machineId);

  }

  remove(machineId) {

    if (!this.exists(machineId)) {

      return false;

    }

    delete this._machines[machineId];

    return true;

  }

  clear() {

    this._machines = {};

    return true;

  }

  count() {

    return Object.keys(this._machines).length;

  }

  keys() {

    return Object.keys(this._machines);

  }

  //=========================================================================
  // Workflow
  //=========================================================================

  approve(machineId) {

    if (!this.exists(machineId)) {

      return false;

    }

    this._machines[machineId].status = "Approved";

    return true;

  }

  activate(machineId) {

    if (!this.exists(machineId)) {

      return false;

    }

    this._machines[machineId].status = "Active";

    return true;

  }

  deactivate(machineId) {

    if (!this.exists(machineId)) {

      return false;

    }

    this._machines[machineId].status = "Inactive";

    return true;

  }

  reopen(machineId) {

    if (!this.exists(machineId)) {

      return false;

    }

    this._machines[machineId].status = "Draft";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getDraft() {

    return this.filter(machine =>
      machine.status === "Draft"
    );

  }

  getApproved() {

    return this.filter(machine =>
      machine.status === "Approved"
    );

  }

  getActive() {

    return this.filter(machine =>
      machine.status === "Active"
    );

  }

  getInactive() {

    return this.filter(machine =>
      machine.status === "Inactive"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._machines).forEach(id => {

      if (callback(this._machines[id])) {

        results[id] = this._machines[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      machines: this.count(),

      draft: Object.keys(this.getDraft()).length,

      approved: Object.keys(this.getApproved()).length,

      active: Object.keys(this.getActive()).length,

      inactive: Object.keys(this.getInactive()).length

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

      machines: this.getAll(),

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
function bootManufacturingMachineManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "Manufacturing",
      "MachineManager",
      new ManufacturingMachineManager()
    );
  }
}