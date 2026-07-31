/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 51_CRM_CustomerManager.gs
 * Version     : 1.0.0
 * Description : CRM Customer Manager
 * =============================================================================
 */

'use strict';

class CRMCustomerManager extends BaseService {

  constructor() {

    super("CRMCustomerManager");

    this.initialize();

  }

  initialize() {

    super.initialize();

    this._customers = {};

    return this;

  }

  //=========================================================================
  // Customers
  //=========================================================================

  create(code, customer) {

    if (this.exists(code))
      return null;

    this._customers[code] = customer;

    return customer;

  }

  exists(code) {

    return !!this._customers[code];

  }

  get(code) {

    return this._customers[code] || null;

  }

  update(code, customer) {

    if (!this.exists(code))
      return null;

    this._customers[code] = customer;

    return customer;

  }

  remove(code) {

    if (!this.exists(code))
      return false;

    delete this._customers[code];

    return true;

  }

  all() {

    return this._customers;

  }

  codes() {

    return Object.keys(this._customers);

  }

  count() {

    return this.codes().length;

  }

  //=========================================================================
  // Customer Status
  //=========================================================================

  activate(code) {

    if (!this.exists(code))
      return false;

    this._customers[code].active = true;

    return true;

  }

  deactivate(code) {

    if (!this.exists(code))
      return false;

    this._customers[code].active = false;

    return true;

  }

  activeCustomers() {

    var customers = {};

    Object.keys(this._customers).forEach(function(code) {

      if (this._customers[code].active)
        customers[code] = this._customers[code];

    }, this);

    return customers;

  }

  inactiveCustomers() {

    var customers = {};

    Object.keys(this._customers).forEach(function(code) {

      if (!this._customers[code].active)
        customers[code] = this._customers[code];

    }, this);

    return customers;

  }

  //=========================================================================
  // Maintenance
  //=========================================================================

  clear() {

    this._customers = {};

    return true;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      customers : this.count(),
      active : Object.keys(this.activeCustomers()).length,
      inactive : Object.keys(this.inactiveCustomers()).length

    };

  }

  health() {

    return {

      initialized : this.isInitialized(),
      healthy : true,
      customers : this.count(),
      active : Object.keys(this.activeCustomers()).length,
      inactive : Object.keys(this.inactiveCustomers()).length

    };

  }

  report() {

    return {

      customers : this.codes(),
      statistics : this.statistics(),
      health : this.health()

    };

  }

  info() {

    return {

      service : this.getName(),
      version : this.getVersion(),
      initialized : this.isInitialized(),
      created : this.getCreatedTime(),
      statistics : this.statistics()

    };

  }

}

//==============================================================================
// CRM Namespace
//==============================================================================

var CRM = CRM || {};

//==============================================================================
// CRM Registration
//==============================================================================function bootCRMCustomerManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "CRM",
      "CustomerManager",
      new CRMCustomerManager()
    );
  }
}