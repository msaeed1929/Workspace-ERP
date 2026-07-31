/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 43_ERP_DocumentManager.gs
 * Version     : 1.0.0
 * Description : ERP Document Manager
 * =============================================================================
 */

'use strict';

class ERPDocumentManager extends BaseService {

  constructor() {

    super("ERPDocumentManager");

    this.initialize();

  }

  initialize() {

    super.initialize();

    this._documents = {};

    return this;

  }

  //=========================================================================
  // Document Types
  //=========================================================================

  register(type) {

    if (!this._documents[type]) {

      this._documents[type] = {};

    }

    return this._documents[type];

  }

  exists(type) {

    return !!this._documents[type];

  }

  document(type) {

    return this._documents[type] || null;

  }

  types() {

    return Object.keys(this._documents);

  }

  count() {

    return this.types().length;

  }

  //=========================================================================
  // Documents
  //=========================================================================

  create(type, number, data) {

    this.register(type);

    this._documents[type][number] = data;

    return data;

  }

  get(type, number) {

    if (!this.exists(type))
      return null;

    return this._documents[type][number] || null;

  }

  update(type, number, data) {

    if (!this.get(type, number))
      return null;

    this._documents[type][number] = data;

    return data;

  }

  remove(type, number) {

    if (!this.get(type, number))
      return false;

    delete this._documents[type][number];

    return true;

  }

  all(type) {

    if (!this.exists(type))
      return {};

    return this._documents[type];

  }

  documentCount(type) {

    if (!this.exists(type))
      return 0;

    return Object.keys(this._documents[type]).length;

  }

  //=========================================================================
  // Maintenance
  //=========================================================================

  clear(type) {

    if (!this.exists(type))
      return false;

    this._documents[type] = {};

    return true;

  }

  clearAll() {

    this._documents = {};

    return true;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    var documents = 0;

    this.types().forEach(function(type){

      documents += this.documentCount(type);

    }, this);

    return {

      types : this.count(),
      documents : documents

    };

  }

  health() {

    return {

      initialized : this.isInitialized(),
      healthy : true,
      types : this.count(),
      documents : this.statistics().documents

    };

  }

  report() {

    return {

      types : this.types(),
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
