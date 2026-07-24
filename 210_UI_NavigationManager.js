/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 210_UI_NavigationManager.gs
 * Layer       : Presentation
 * Component   : UI Navigation Manager
 * Version     : 1.0.0
 * Description : Manages application navigation, history and breadcrumbs.
 * =============================================================================
 */

'use strict';

class UINavigationManager {

  constructor() {

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    this._currentPage = null;

    this._previousPage = null;

    this._history = [];

    this._breadcrumbs = [];

    this._initialized = true;

    return this;

  }

  //=========================================================================
  // Navigation
  //=========================================================================

  navigate(page) {

    if (!page) {

      return false;

    }

    this._previousPage = this._currentPage;

    this._currentPage = page;

    this._history.push({

      page: page,

      timestamp: new Date()

    });

    Logger.info("Navigated to: " + page);

    return true;

  }

  back() {

    if (this._history.length < 2) {

      return false;

    }

    this._history.pop();

    const previous = this._history[this._history.length - 1];

    this._currentPage = previous.page;

    this._previousPage = this._history.length > 1
      ? this._history[this._history.length - 2].page
      : null;

    Logger.info("Returned to: " + this._currentPage);

    return true;

  }

  //=========================================================================
  // Current Page
  //=========================================================================

  current() {

    return this._currentPage;

  }

  previous() {

    return this._previousPage;

  }

  history() {

    return this._history;

  }

  historyCount() {

    return this._history.length;

  }

  clearHistory() {

    this._history = [];

    this._previousPage = null;

    return this;

  }

  //=========================================================================
  // Breadcrumbs
  //=========================================================================

  addBreadcrumb(title, route) {

    this._breadcrumbs.push({

      title: title,

      route: route

    });

    return this;

  }

  breadcrumbs() {

    return this._breadcrumbs;

  }

  clearBreadcrumbs() {

    this._breadcrumbs = [];

    return this;

  }

  //=========================================================================
  // Navigation State
  //=========================================================================

  isInitialized() {

    return this._initialized;

  }

  hasHistory() {

    return this._history.length > 0;

  }

  hasBreadcrumbs() {

    return this._breadcrumbs.length > 0;

  }

  //=========================================================================
  // Reset
  //=========================================================================

  reset() {

    this._currentPage = null;

    this._previousPage = null;

    this._history = [];

    this._breadcrumbs = [];

    return this;

  }

  //=========================================================================
  // Information
  //=========================================================================

  info() {

    return {

      component: "UI Navigation Manager",

      version: "1.0.0",

      initialized: this.isInitialized(),

      currentPage: this.current(),

      previousPage: this.previous(),

      historyEntries: this.historyCount(),

      breadcrumbEntries: this._breadcrumbs.length

    };

  }

}

/*==============================================================================
  Module Registration
==============================================================================*/

WEF.UI.Core.NavigationManager = new UINavigationManager();