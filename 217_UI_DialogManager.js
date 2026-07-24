/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 217_UI_DialogManager.gs
 * Layer       : Presentation
 * Component   : UI Dialog Manager
 * Version     : 1.0.0
 * Description : Manages modal dialogs, confirmation boxes, prompts,
 *               progress dialogs and user interaction windows.
 * =============================================================================
 */

'use strict';

class UIDialogManager {

  constructor() {

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    this._dialogs = {};

    this._activeDialog = null;

    this._initialized = true;

    return this;

  }

  //=========================================================================
  // Dialog Registration
  //=========================================================================

  register(name, definition) {

    this._dialogs[name] = {

      name: name,

      title: definition.title || name,

      message: definition.message || "",

      type: definition.type || "modal",   // modal, confirm, prompt, progress

      width: definition.width || 600,

      height: definition.height || 400,

      closable: definition.closable !== false,

      enabled: true,

      created: new Date()

    };

    return this;

  }

  registerMany(dialogs) {

    Object.keys(dialogs).forEach(name => {

      this.register(name, dialogs[name]);

    });

    return this;

  }

  //=========================================================================
  // Dialog Lookup
  //=========================================================================

  exists(name) {

    return this._dialogs.hasOwnProperty(name);

  }

  get(name) {

    return this._dialogs[name] || null;

  }

  getAll() {

    return this._dialogs;

  }

  keys() {

    return Object.keys(this._dialogs);

  }

  count() {

    return this.keys().length;

  }

  //=========================================================================
  // Active Dialog
  //=========================================================================

  open(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._activeDialog = name;

    Logger.info("Dialog opened: " + name);

    return true;

  }

  close() {

    this._activeDialog = null;

    return this;

  }

  active() {

    return this._activeDialog;

  }

  getActiveDialog() {

    if (!this._activeDialog) {

      return null;

    }

    return this.get(this._activeDialog);

  }

  //=========================================================================
  // Dialog State
  //=========================================================================

  enable(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._dialogs[name].enabled = true;

    return true;

  }

  disable(name) {

    if (!this.exists(name)) {

      return false;

    }

    this._dialogs[name].enabled = false;

    return true;

  }

  //=========================================================================
  // Dialog Operations
  //=========================================================================

  confirm(title, message) {

    Logger.info(

      "[CONFIRM] " +

      title +

      " : " +

      message

    );

    return true;

  }

  prompt(title, message, defaultValue) {

    Logger.info(

      "[PROMPT] " +

      title +

      " : " +

      message

    );

    return defaultValue || "";

  }

  progress(title, percent) {

    Logger.info(

      "[PROGRESS] " +

      title +

      " : " +

      percent +

      "%"

    );

    return true;

  }

  alert(title, message) {

    Logger.info(

      "[ALERT] " +

      title +

      " : " +

      message

    );

    return true;

  }

  //=========================================================================
  // Dialog Management
  //=========================================================================

  remove(name) {

    if (!this.exists(name)) {

      return false;

    }

    if (this._activeDialog === name) {

      this._activeDialog = null;

    }

    delete this._dialogs[name];

    return true;

  }

  clear() {

    this.initialize();

    return this;

  }

  //=========================================================================
  // Information
  //=========================================================================

  isInitialized() {

    return this._initialized;

  }

  info() {

    return {

      component: "UI Dialog Manager",

      version: "1.0.0",

      initialized: this.isInitialized(),

      dialogs: this.count(),

      activeDialog: this.active()

    };

  }

}

/*==============================================================================
  Module Registration
==============================================================================*/

WEF.UI.Core.DialogManager = new UIDialogManager();