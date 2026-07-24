/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 202_UI_Config.gs
 * Layer       : Presentation
 * Component   : UI Configuration
 * Version     : 1.0.0
 * Description : Central configuration for the Presentation Layer.
 * =============================================================================
 */

'use strict';

WEF.UI.Config = {

  /*===========================================================================
    Application
  ===========================================================================*/

  APPLICATION: {

    NAME: "Workspace ERP",

    SHORT_NAME: "WEF ERP",

    VERSION: "1.0.0",

    UI_VERSION: "1.0.0",

    COMPANY: "Al Aziz Hosiery Industries",

    COPYRIGHT: "© Workspace ERP Framework",

    DEFAULT_PAGE: "dashboard",

    DEFAULT_LANGUAGE: "en",

    DEFAULT_TIMEZONE: Session.getScriptTimeZone()

  },

  /*===========================================================================
    Branding
  ===========================================================================*/

  BRANDING: {

    LOGO: "assets/images/logo.svg",

    FAVICON: "assets/images/favicon.ico",

    LOGIN_BACKGROUND: "assets/images/login.jpg",

    COMPANY_COLOR: "#2563EB"

  },

  /*===========================================================================
    Theme
  ===========================================================================*/

  THEME: {

    DEFAULT: "light",

    AVAILABLE: [

      "light",

      "dark"

    ],

    PRIMARY: "#2563EB",

    SECONDARY: "#1E293B",

    SUCCESS: "#16A34A",

    WARNING: "#F59E0B",

    DANGER: "#DC2626",

    INFO: "#0891B2",

    BACKGROUND: "#F8FAFC",

    SURFACE: "#FFFFFF",

    BORDER: "#E5E7EB",

    TEXT: "#111827"

  },

  /*===========================================================================
    Typography
  ===========================================================================*/

  TYPOGRAPHY: {

    FONT_FAMILY: "Roboto, Arial, sans-serif",

    FONT_SIZE: 14,

    HEADER_SIZE: 22,

    TITLE_SIZE: 18,

    SMALL_SIZE: 12

  },

  /*===========================================================================
    Layout
  ===========================================================================*/

  LAYOUT: {

    SIDEBAR_WIDTH: 260,

    SIDEBAR_COLLAPSED_WIDTH: 72,

    HEADER_HEIGHT: 64,

    FOOTER_HEIGHT: 32,

    CONTENT_PADDING: 20,

    MAX_CONTENT_WIDTH: 1600

  },

/*===========================================================================
  Navigation
===========================================================================*/

  NAVIGATION: {

    SHOW_ICONS: true,

    SHOW_TOOLTIPS: true,

    COLLAPSIBLE_SIDEBAR: true,

    REMEMBER_STATE: true,

    EXPAND_ON_HOVER: false

  },

/*===========================================================================
  Dashboard
===========================================================================*/

  DASHBOARD: {

    AUTO_REFRESH: true,

    REFRESH_INTERVAL: 300,

    SHOW_KPI_CARDS: true,

    SHOW_RECENT_ACTIVITY: true,

    SHOW_NOTIFICATIONS: true,

    DEFAULT_CHART: "line"

  },

/*===========================================================================
  Animation
===========================================================================*/

  ANIMATION: {

    ENABLED: true,

    PAGE_TRANSITION: 300,

    MENU_TRANSITION: 250,

    DIALOG_TRANSITION: 200,

    RIPPLE_EFFECT: true

  },

/*===========================================================================
  Responsive
===========================================================================*/

  RESPONSIVE: {

    MOBILE: 576,

    TABLET: 768,

    LAPTOP: 1024,

    DESKTOP: 1280,

    WIDESCREEN: 1600

  },

/*===========================================================================
  Localization
===========================================================================*/

  LOCALIZATION: {

    DATE_FORMAT: "dd/MM/yyyy",

    TIME_FORMAT: "HH:mm:ss",

    DATETIME_FORMAT: "dd/MM/yyyy HH:mm:ss",

    FIRST_DAY_OF_WEEK: 1,

    CURRENCY: "PKR"

  },

/*===========================================================================
  Features
===========================================================================*/

  FEATURES: {

    DARK_MODE: true,

    NOTIFICATIONS: true,

    SEARCH: true,

    GLOBAL_FILTER: true,

    BREADCRUMBS: true,

    FULLSCREEN: true,

    EXPORT: true

  },

/*===========================================================================
  Initialization
===========================================================================*/

  initialize() {

    Logger.info("UI Configuration Loaded");

    return this;

  },

/*===========================================================================
  Get
===========================================================================*/

  get(section) {

    return this[section] || null;

  },

/*===========================================================================
  Has
===========================================================================*/

  has(section) {

    return this.hasOwnProperty(section);

  },

/*===========================================================================
  Keys
===========================================================================*/

  keys() {

    return Object.keys(this);

  },

  /*===========================================================================
    Count
  ===========================================================================*/

  count() {

    return this.keys().length;

  },

  /*===========================================================================
    All
  ===========================================================================*/

  all() {

    return {

      APPLICATION: this.APPLICATION,

      BRANDING: this.BRANDING,

      THEME: this.THEME,

      TYPOGRAPHY: this.TYPOGRAPHY,

      LAYOUT: this.LAYOUT,

      NAVIGATION: this.NAVIGATION,

      DASHBOARD: this.DASHBOARD,

      ANIMATION: this.ANIMATION,

      RESPONSIVE: this.RESPONSIVE,

      LOCALIZATION: this.LOCALIZATION,

      FEATURES: this.FEATURES

    };

  },

  /*===========================================================================
    Information
  ===========================================================================*/

  info() {

    return {

      component: "UI Configuration",

      version: this.APPLICATION.UI_VERSION,

      application: this.APPLICATION.NAME,

      company: this.APPLICATION.COMPANY,

      theme: this.THEME.DEFAULT,

      language: this.APPLICATION.DEFAULT_LANGUAGE,

      sections: this.count()

    };

  }

};
