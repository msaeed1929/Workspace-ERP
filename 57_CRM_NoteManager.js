/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 57_CRM_NoteManager.gs
 * Version     : 1.0.0
 * Description : CRM Note Manager
 * =============================================================================
 */

'use strict';

class CRMNoteManager extends BaseService {

  constructor() {

    super("CRMNoteManager");

    this.initialize();

  }

  initialize() {

    super.initialize();

    this._notes = {};

    return this;

  }

  //=========================================================================
  // Notes
  //=========================================================================

  create(id, note) {

    if (this.exists(id))
      return null;

    this._notes[id] = note;

    return note;

  }

  exists(id) {

    return !!this._notes[id];

  }

  get(id) {

    return this._notes[id] || null;

  }

  update(id, note) {

    if (!this.exists(id))
      return null;

    this._notes[id] = note;

    return note;

  }

  remove(id) {

    if (!this.exists(id))
      return false;

    delete this._notes[id];

    return true;

  }

  all() {

    return this._notes;

  }

  ids() {

    return Object.keys(this._notes);

  }

  count() {

    return this.ids().length;

  }

  //=========================================================================
  // Status
  //=========================================================================

  archive(id) {

    if (!this.exists(id))
      return false;

    this._notes[id].archived = true;

    return true;

  }

  unarchive(id) {

    if (!this.exists(id))
      return false;

    this._notes[id].archived = false;

    return true;

  }

  active() {

    var notes = {};

    Object.keys(this._notes).forEach(function(id){

      if (!this._notes[id].archived)
        notes[id] = this._notes[id];

    }, this);

    return notes;

  }

  archived() {

    var notes = {};

    Object.keys(this._notes).forEach(function(id){

      if (this._notes[id].archived)
        notes[id] = this._notes[id];

    }, this);

    return notes;

  }

  //=========================================================================
  // Entity Lookup
  //=========================================================================

  byEntity(entityType, entityId) {

    var notes = {};

    Object.keys(this._notes).forEach(function(id){

      var note = this._notes[id];

      if (
        note.entityType === entityType &&
        note.entityId === entityId
      ) {

        notes[id] = note;

      }

    }, this);

    return notes;

  }

  //=========================================================================
  // Maintenance
  //=========================================================================

  clear() {

    this._notes = {};

    return true;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      notes: this.count(),
      active: Object.keys(this.active()).length,
      archived: Object.keys(this.archived()).length

    };

  }

  health() {

    return {

      initialized: this.isInitialized(),
      healthy: true,
      notes: this.count(),
      active: Object.keys(this.active()).length,
      archived: Object.keys(this.archived()).length

    };

  }

  report() {

    return {

      notes: this.ids(),
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
// CRM Registration
//==============================================================================

WEF.ServiceContainer.registerModuleService(
  "CRM",
  "NoteManager",
  new CRMNoteManager()
);