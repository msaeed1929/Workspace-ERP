/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 408_ThemeManager.gs
 * Layer       : Web Application
 * Component   : Theme Manager
 * Version     : 3.1.0
 * Description : Centralized theme management for Workspace ERP.
 *               Responsible for theme configuration and server-side defaults.
 * =============================================================================
 */

'use strict';

/*==============================================================================
    Theme Manager
==============================================================================*/

class WEFThemeManager {

  constructor() {

    this.initialize();

  }

  /*==========================================================================
      Initialize
  ==========================================================================*/

  initialize() {

    this._initialized = false;

    this._version = "3.1.0";

    this._defaultTheme = "light";

    this._supportedThemes = [

      "light",

      "dark"

    ];

    this._currentTheme = this._defaultTheme;

    return this;

  }

  /*==========================================================================
      Boot
  ==========================================================================*/

  boot() {

    if (this._initialized) {

      return this;

    }

    Logger.info(

      "========== THEME MANAGER BOOT =========="

    );

    this._initialized = true;

    Logger.info(

      "========== THEME MANAGER READY =========="

    );

    return this;

  }

  /*==========================================================================
      Set Theme
  ==========================================================================*/

  setTheme(theme) {

    this.boot();

    if (!this.isSupported(theme)) {

      Logger.warning(

        "Unsupported theme : " + theme

      );

      return this;

    }

    this._currentTheme = theme;

    Logger.info(

      "Theme Changed : " + theme

    );

    return this;

  }

  /*==========================================================================
      Current Theme
  ==========================================================================*/

  currentTheme() {

    this.boot();

    return this._currentTheme;

  }

  /*==========================================================================
      Default Theme
  ==========================================================================*/

  defaultTheme() {

    return this._defaultTheme;

  }

  /*==========================================================================
      Supported Themes
  ==========================================================================*/

  supportedThemes() {

    return this._supportedThemes.slice();

  }

  /*==========================================================================
      Validate Theme
  ==========================================================================*/

  isSupported(theme) {

    return this._supportedThemes.includes(

      theme

    );

  }

  /*==========================================================================
      Toggle Theme
  ==========================================================================*/

  toggleTheme() {

    this.boot();

    this._currentTheme =

      this._currentTheme === "light"

      ? "dark"

      : "light";

    Logger.info(

      "Theme Toggled : " +

      this._currentTheme

    );

    return this._currentTheme;

  }

  /*==========================================================================
      Status
  ==========================================================================*/

  status() {

    return {

      initialized :

        this._initialized,

      version :

        this._version,

      currentTheme :

        this._currentTheme,

      defaultTheme :

        this._defaultTheme,

      supportedThemes :

        this.supportedThemes()

    };

  }

  /*==========================================================================
      Information
  ==========================================================================*/

  info() {

    return {

      name :

        "Workspace ERP Theme Manager",

      layer :

        "Web Application",

      version :

        this._version,

      status :

        this.status()

    };

  }

  /*==========================================================================
      Reset
  ==========================================================================*/

  reset() {

    this._currentTheme =

      this._defaultTheme;

    Logger.info(

      "========== THEME MANAGER RESET =========="

    );

    return this;

  }

}

/*==============================================================================
    Framework Registration
==============================================================================*/

WEF.ThemeManager =

    new WEFThemeManager();

/*==============================================================================
    Public API
==============================================================================*/

/**
 * Returns the current theme.
 */
function currentTheme() {

  return WEF.ThemeManager.currentTheme();

}

/**
 * Sets the active theme.
 */
function setTheme(theme) {

  WEF.ThemeManager.setTheme(

    theme

  );

  return WEF.ThemeManager.currentTheme();

}

/**
 * Toggles between Light and Dark themes.
 */
function toggleTheme() {

  return WEF.ThemeManager.toggleTheme();

}

/**
 * Returns the default theme.
 */
function defaultTheme() {

  return WEF.ThemeManager.defaultTheme();

}

/**
 * Returns all supported themes.
 */
function supportedThemes() {

  return WEF.ThemeManager.supportedThemes();

}

/**
 * Returns Theme Manager status.
 */
function themeManagerStatus() {

  return WEF.ThemeManager.status();

}

/**
 * Returns Theme Manager information.
 */
function themeManagerInfo() {

  return WEF.ThemeManager.info();

}

/**
 * Resets Theme Manager.
 */
function resetThemeManager() {

  return WEF.ThemeManager.reset();

}