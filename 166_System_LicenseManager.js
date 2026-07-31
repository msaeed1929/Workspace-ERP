/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 166_System_LicenseManager.gs
 * Module      : System
 * Class       : SystemLicenseManager
 * Version     : 1.0.0
 * Description : System License Management Service
 * =============================================================================
 */

'use strict';

class SystemLicenseManager extends BaseService {

  constructor() {

    super("SystemLicenseManager");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this._licenses = {};

    return this;

  }

  //=========================================================================
  // CRUD
  //=========================================================================

  create(licenseId, data) {

    if (this.exists(licenseId)) {

      return false;

    }

    this._licenses[licenseId] = Object.assign({

      licenseKey: "",

      edition: "Community",

      customer: "",

      issuedDate: "",

      expiryDate: "",

      maxUsers: 0,

      activeUsers: 0,

      features: [],

      status: "Inactive"

    }, data || {});

    return true;

  }

  update(licenseId, data) {

    if (!this.exists(licenseId)) {

      return false;

    }

    Object.assign(

      this._licenses[licenseId],

      data || {}

    );

    return true;

  }

  get(licenseId) {

    return this._licenses[licenseId] || null;

  }

  getAll() {

    return this._licenses;

  }

  exists(licenseId) {

    return this._licenses.hasOwnProperty(licenseId);

  }

  remove(licenseId) {

    if (!this.exists(licenseId)) {

      return false;

    }

    delete this._licenses[licenseId];

    return true;

  }

  clear() {

    this._licenses = {};

    return true;

  }

  count() {

    return Object.keys(this._licenses).length;

  }

  keys() {

    return Object.keys(this._licenses);

  }

  //=========================================================================
  // License Lifecycle
  //=========================================================================

  activate(licenseId) {

    if (!this.exists(licenseId)) {

      return false;

    }

    this._licenses[licenseId].status = "Active";

    return true;

  }

  deactivate(licenseId) {

    if (!this.exists(licenseId)) {

      return false;

    }

    this._licenses[licenseId].status = "Inactive";

    return true;

  }

  suspend(licenseId) {

    if (!this.exists(licenseId)) {

      return false;

    }

    this._licenses[licenseId].status = "Suspended";

    return true;

  }

  expire(licenseId) {

    if (!this.exists(licenseId)) {

      return false;

    }

    this._licenses[licenseId].status = "Expired";

    return true;

  }

  //=========================================================================
  // Status Filters
  //=========================================================================

  getActive() {

    return this.filter(license =>
      license.status === "Active"
    );

  }

  getInactive() {

    return this.filter(license =>
      license.status === "Inactive"
    );

  }

  getSuspended() {

    return this.filter(license =>
      license.status === "Suspended"
    );

  }

  getExpired() {

    return this.filter(license =>
      license.status === "Expired"
    );

  }

  filter(callback) {

    const results = {};

    Object.keys(this._licenses).forEach(id => {

      if (callback(this._licenses[id])) {

        results[id] = this._licenses[id];

      }

    });

    return results;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      licenses: this.count(),

      active: Object.keys(this.getActive()).length,

      inactive: Object.keys(this.getInactive()).length,

      suspended: Object.keys(this.getSuspended()).length,

      expired: Object.keys(this.getExpired()).length

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

      licenses: this.getAll(),

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
function bootSystemLicenseManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "System",
      "LicenseManager",
      new SystemLicenseManager()
    );
  }
}