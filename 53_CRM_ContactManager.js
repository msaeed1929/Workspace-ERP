/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 53_CRM_ContactManager.gs
 * Version     : 1.0.0
 * Description : CRM Contact Manager
 * =============================================================================
 */

'use strict';

class CRMContactManager extends BaseService {

  constructor() {

    super("CRMContactManager");

    this.initialize();

  }

  initialize() {

    super.initialize();

    this._contacts = {};

    return this;

  }

  //=========================================================================
  // Contacts
  //=========================================================================

  create(code, contact) {

    if (this.exists(code))
      return null;

    this._contacts[code] = contact;

    return contact;

  }

  exists(code) {

    return !!this._contacts[code];

  }

  get(code) {

    return this._contacts[code] || null;

  }

  update(code, contact) {

    if (!this.exists(code))
      return null;

    this._contacts[code] = contact;

    return contact;

  }

  remove(code) {

    if (!this.exists(code))
      return false;

    delete this._contacts[code];

    return true;

  }

  all() {

    return this._contacts;

  }

  codes() {

    return Object.keys(this._contacts);

  }

  count() {

    return this.codes().length;

  }

  //=========================================================================
  // Status
  //=========================================================================

  activate(code) {

    if (!this.exists(code))
      return false;

    this._contacts[code].active = true;

    return true;

  }

  deactivate(code) {

    if (!this.exists(code))
      return false;

    this._contacts[code].active = false;

    return true;

  }

  activeContacts() {

    var contacts = {};

    Object.keys(this._contacts).forEach(function(code){

      if (this._contacts[code].active)
        contacts[code] = this._contacts[code];

    }, this);

    return contacts;

  }

  inactiveContacts() {

    var contacts = {};

    Object.keys(this._contacts).forEach(function(code){

      if (!this._contacts[code].active)
        contacts[code] = this._contacts[code];

    }, this);

    return contacts;

  }

  //=========================================================================
  // Maintenance
  //=========================================================================

  clear() {

    this._contacts = {};

    return true;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      contacts : this.count(),
      active : Object.keys(this.activeContacts()).length,
      inactive : Object.keys(this.inactiveContacts()).length

    };

  }

  health() {

    return {

      initialized : this.isInitialized(),
      healthy : true,
      contacts : this.count(),
      active : Object.keys(this.activeContacts()).length,
      inactive : Object.keys(this.inactiveContacts()).length

    };

  }

  report() {

    return {

      contacts : this.codes(),
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
// CRM Registration
//==============================================================================

WEF.ServiceContainer.registerModuleService(
  "CRM",
  "ContactManager",
  new CRMContactManager()
);