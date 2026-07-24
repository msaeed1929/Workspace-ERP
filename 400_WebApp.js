/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 400_WebApp.gs
 * Layer       : Web Application
 * Component   : Web Application Bootstrap
 * Version     : 3.1.0
 *
 * Description :
 * -----------------------------------------------------------------------------
 * Main entry point of the Workspace ERP Web Application.
 *
 * Responsibilities
 * ----------------
 * • Boot the Web Application
 * • Render the main HTML shell
 * • Provide client bootstrap information
 * • Manage application configuration
 * • Manage user session metadata
 * • Provide reusable HTML include helper
 *
 * This class intentionally contains NO business logic.
 * Business logic belongs to ERP modules.
 *
 * =============================================================================
 */

'use strict';


/*==============================================================================
    HTML INCLUDE HELPER
==============================================================================*/

/**
 * Includes an HTML file inside another HTML template.
 *
 * Usage:
 *
 * <?!= includeHTML("404_Sidebar"); ?>
 *
 */
function includeHTML(filename) {

  return HtmlService
    .createHtmlOutputFromFile(filename)
    .getContent();

}


/*==============================================================================
    WEB APPLICATION
==============================================================================*/

class WEFWebApp {

  constructor() {

    this.initialize();

  }


  //==========================================================================
  // Initialize
  //==========================================================================

  initialize() {

    this._initialized = false;

    this._bootTime = null;

    this._application = "Workspace ERP";

    this._title = "Workspace ERP Framework";

    this._version = "3.1.0";

    this._template = "403_MainLayout";

    this._configuration = {};

    this._session = {};

    return this;

  }


  //==========================================================================
  // Boot
  //==========================================================================

  boot() {

    if (this._initialized) {

      return this;

    }

    Logger.info("========== WEB APPLICATION BOOT ==========");

    this.loadConfiguration();

    this.loadSession();

    this._bootTime = new Date();

    this._initialized = true;

    Logger.info("========== WEB APPLICATION READY ==========");

    return this;

  }


  //==========================================================================
  // Configuration
  //==========================================================================

  configuration() {

    this.boot();

    return this._configuration;

  }

  loadConfiguration() {

    this._configuration = {

      application : this._application,

      title : this._title,

      version : this._version,

      defaultModule : "Dashboard",

      theme : "light",

      language : "en",

      notifications : true,

      sidebarCollapsed : false

    };

    return this;

  }


  //==========================================================================
  // Session
  //==========================================================================

  session() {

    this.boot();

    return this._session;

  }

  loadSession() {

    this._session = {

      user :

        this.getCurrentUser(),

      timezone :

        Session.getScriptTimeZone(),

      locale :

        Session.getActiveUserLocale()

    };

    return this;

  }

  //==========================================================================
  // Template
  //==========================================================================

  createTemplate() {

    const template = HtmlService.createTemplateFromFile(

      this._template

    );

    //==========================================================
    // Global Template Variables
    //==========================================================

    template.APP =

      this._application;

    template.TITLE =

      this._title;

    template.VERSION =

      this._version;

    template.BOOTTIME =

      this._bootTime;

    return template;

  }


  //==========================================================================
  // HTML Output
  //==========================================================================

  createOutput() {

    return this
      .createTemplate()
      .evaluate();

  }


  //==========================================================================
  // Output Configuration
  //==========================================================================

  configureOutput(output) {

    output

      .setTitle(

        this._title

      )

      .setSandboxMode(

        HtmlService.SandboxMode.IFRAME

      )

      .setXFrameOptionsMode(

        HtmlService.XFrameOptionsMode.ALLOWALL

      );

    return output;

  }


  //==========================================================================
  // Render Application
  //==========================================================================

  render() {

    this.boot();

    Logger.info(

      "Rendering Workspace ERP..."

    );

    const output =

      this.createOutput();

    return this.configureOutput(

      output

    );

  }


  //==========================================================================
  // Current User
  //==========================================================================

  getCurrentUser() {

    try {

      const email =

        Session
          .getActiveUser()
          .getEmail();

      return email || "Guest";

    }

    catch (error) {

      return "Guest";

    }

  }


  //==========================================================================
  // Current Locale
  //==========================================================================

  getCurrentLocale() {

    try {

      return Session.getActiveUserLocale();

    }

    catch (error) {

      return "en";

    }

  }


  //==========================================================================
  // Current Timezone
  //==========================================================================

  getCurrentTimezone() {

    return Session.getScriptTimeZone();

  }


  //==========================================================================
  // Metadata
  //==========================================================================

  metadata() {

    return {

      application :

        this._application,

      title :

        this._title,

      version :

        this._version,

      bootTime :

        this._bootTime,

      user :

        this.getCurrentUser(),

      timezone :

        this.getCurrentTimezone(),

      locale :

        this.getCurrentLocale()

    };

  }


  //==========================================================================
  // Client Bootstrap
  //==========================================================================

  bootstrap() {

      this.boot();

      return {

          success : true,

          framework : {

              name :

                  this._application,

              version :

                  this._version,

              initialized :

                  this._initialized,

              bootTime :

                  this._bootTime

          },

          metadata :

              this.metadata(),

          configuration :

              this._configuration,

          session :

              this._session,

          /*--------------------------------------------------
              Client Startup Models
          --------------------------------------------------*/

          settings : {

          },

          theme : {

              mode :

                  this._configuration.theme,

              primaryColor :

                  "#2563eb"

          },

          profile : {

              name :

                  this.getCurrentUser()

          },

          permissions : {

          },

          shortcuts : [

          ],

          notifications : [

          ],

          workspace : {

              currentModule :

                  this._configuration.defaultModule

          },

          environment : {

              timezone :

                  this.getCurrentTimezone(),

              locale :

                  this.getCurrentLocale()

          }

      };

  }

  //==========================================================================
  // Health
  //==========================================================================

  health() {

    this.boot();

    return {

      success : true,

      application :

        this._application,

      version :

        this._version,

      initialized :

        this._initialized,

      bootTime :

        this._bootTime,

      serverTime :

        new Date(),

      status :

        "ONLINE"

    };

  }


  //==========================================================================
  // Status
  //==========================================================================

  status() {

    this.boot();

    return {

      initialized :

        this._initialized,

      application :

        this._application,

      version :

        this._version,

      template :

        this._template,

      defaultModule :

        this._configuration.defaultModule,

      currentUser :

        this._session.user,

      bootTime :

        this._bootTime

    };

  }


  //==========================================================================
  // Information
  //==========================================================================

  info() {

    this.boot();

    return {

      name :

        "Workspace ERP Web Application",

      application :

        this._application,

      version :

        this._version,

      template :

        this._template,

      initialized :

        this._initialized,

      bootTime :

        this._bootTime,

      configuration :

        this._configuration

    };

  }


  //==========================================================================
  // Reset
  //==========================================================================

  reset() {

    this.initialize();

    Logger.info(

      "========== WEB APPLICATION RESET =========="

    );

    return this;

  }

}


/*==============================================================================
    GLOBAL REGISTRATION
==============================================================================*/

WEF.WebApp = new WEFWebApp();


/*==============================================================================
    HTTP ENTRY POINTS
==============================================================================*/

/**
 * HTTP GET
 */
function doGet(e) {

  Logger.info(

    "========== HTTP GET =========="

  );

  return ensureWebApp().render();

}


/**
 * HTTP POST
 */
function doPost(e) {

  Logger.info(

    "========== HTTP POST =========="

  );

  return doGet(e);

}

/*==============================================================================
    PUBLIC API
==============================================================================*/

/**
 * Ensures the Web Application has been booted.
 */
function ensureWebApp() {

  if (!WEF.WebApp._initialized) {

    WEF.WebApp.boot();

  }

  return WEF.WebApp;

}


/**
 * Returns the complete client bootstrap model.
 *
 * This is the first server method called by the client.
 */
function webAppBootstrap() {

  Logger.log("webAppBootstrap called");

  return {

    success: true,

    metadata: {

      user: Session.getActiveUser().getEmail()

    },

    configuration: {

      defaultModule: "Dashboard",

      theme: "light"

    }

  };

}


/**
 * Returns application metadata.
 */
function webAppMetadata() {

  return ensureWebApp().metadata();

}


/**
 * Returns application configuration.
 */
function webAppConfiguration() {

  return ensureWebApp().configuration();

}


/**
 * Returns current session.
 */
function webAppSession() {

  return ensureWebApp().session();

}


/**
 * Returns application health.
 */
function webAppHealth() {

  return ensureWebApp().health();

}


/**
 * Returns framework status.
 */
function webAppStatus() {

  return ensureWebApp().status();

}


/**
 * Returns framework information.
 */
function webAppInfo() {

  return ensureWebApp().info();

}


/**
 * Simple connectivity test.
 */
function webAppPing() {

  return {

    success : true,

    message : "Workspace ERP Framework is running.",

    timestamp : new Date(),

    version : ensureWebApp().status().version

  };

}


/**
 * Returns current server time.
 */
function serverTime() {

  return new Date();

}

/*==============================================================================
    SETTINGS API
==============================================================================*/

/**
 * Returns application settings.
 */
function getApplicationSettings() {

    return ensureWebApp()

        .bootstrap()

        .settings;

}

/**
 * Saves application settings.
 */
function saveApplicationSettings(settings) {

    // Temporary implementation

    Logger.log(

        JSON.stringify(

            settings,

            null,

            2

        )

    );

    return {

        success : true,

        message : "Settings saved."

    };

}
