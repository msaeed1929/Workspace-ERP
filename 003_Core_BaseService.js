/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * -----------------------------------------------------------------------------
 * File        : 003_Core_BaseService.gs
 * Version     : 1.0.0
 * Description : Base Service Class
 * =============================================================================
 */

'use strict';

class BaseService {

  /**
   * ---------------------------------------------------------------------------
   * Constructor
   * ---------------------------------------------------------------------------
   */
  constructor(serviceName) {

    if (!serviceName) {
      throw new Error("Service name is required.");
    }

    this._name = serviceName;
    this._module = "Core";
    this._initialized = false;
    this._createdAt = new Date();
    this._version = WEF_FRAMEWORK.VERSION;

  }

  /**
   * Module Name
   */
  getModule() {
    return this._module;
  }

  /**
   * Set Module
   */
  setModule(module) {
    this._module = module;
    return this;
  }

  /**
   * ---------------------------------------------------------------------------
   * Initialize Service
   * ---------------------------------------------------------------------------
   */
  initialize() {

    this._initialized = true;

    return this;

  }

  /**
   * ---------------------------------------------------------------------------
   * Dispose Service
   * ---------------------------------------------------------------------------
   */
  dispose() {

    this._initialized = false;

    return this;

  }

  /**
   * ---------------------------------------------------------------------------
   * Validate
   * ---------------------------------------------------------------------------
   */
  validate() {

    return true;

  }

  /**
   * ---------------------------------------------------------------------------
   * Before Save Hook
   * ---------------------------------------------------------------------------
   */
  beforeSave(data) {

    return data;

  }

  /**
   * ---------------------------------------------------------------------------
   * After Save Hook
   * ---------------------------------------------------------------------------
   */
  afterSave(data) {

    return data;

  }

  /**
   * ---------------------------------------------------------------------------
   * Before Delete Hook
   * ---------------------------------------------------------------------------
   */
  beforeDelete(id) {

    return id;

  }

  /**
   * ---------------------------------------------------------------------------
   * After Delete Hook
   * ---------------------------------------------------------------------------
   */
  afterDelete(id) {

    return id;

  }

  /**
   * ---------------------------------------------------------------------------
   * Log
   * ---------------------------------------------------------------------------
   */
  log(message) {

    if (!WEF.Config.get("ENABLE_LOGGING")) {
      return;
    }

    if (WEF.Logger && typeof WEF.Logger.info === "function") {

      WEF.Logger.info(
        "[" + this._module + "] " +
        this._name +
        " : " +
        message
      );

    } else {

      Logger.log(
        "[" + this._module + "] " +
        this._name +
        " : " +
        message
      );

    }

  }

  /**
   * ---------------------------------------------------------------------------
   * Error
   * ---------------------------------------------------------------------------
   */
  error(message) {

    throw new Error(
      "[" +
      this._module +
      "." +
      this._name +
      "] " +
      message
    );

  }

  /**
   * ---------------------------------------------------------------------------
   * Service Name
   * ---------------------------------------------------------------------------
   */
  getName() {

    return this._name;

  }

  /**
   * ---------------------------------------------------------------------------
   * Version
   * ---------------------------------------------------------------------------
   */
  getVersion() {

    return this._version;

  }

  /**
   * ---------------------------------------------------------------------------
   * Created Time
   * ---------------------------------------------------------------------------
   */
  getCreatedTime() {

    return this._createdAt;

  }

  /**
   * ---------------------------------------------------------------------------
   * Initialized
   * ---------------------------------------------------------------------------
   */
  isInitialized() {

    return this._initialized;

  }

  /**
   * ---------------------------------------------------------------------------
   * Runtime
   * ---------------------------------------------------------------------------
   */
  runtime() {

    return Object.assign({}, WEF.Runtime);

  }

  /**
   * ---------------------------------------------------------------------------
   * Spreadsheet
   * ---------------------------------------------------------------------------
   */
  spreadsheet() {

    return WEF.Runtime.Spreadsheet;

  }

  /**
   * ---------------------------------------------------------------------------
   * Spreadsheet Id
   * ---------------------------------------------------------------------------
   */
  spreadsheetId() {

    return WEF.Runtime.SpreadsheetId;

  }

  /**
   * ---------------------------------------------------------------------------
   * Active User
   * ---------------------------------------------------------------------------
   */
  user() {

    return WEF.Runtime.User;

  }

  /**
   * ---------------------------------------------------------------------------
   * Timezone
   * ---------------------------------------------------------------------------
   */
  timezone() {

    return WEF.Runtime.TimeZone;

  }

  /**
   * ---------------------------------------------------------------------------
   * Health Check
   * ---------------------------------------------------------------------------
   */
  health() {

    return {

      module: this.getModule(),

      service: this.getName(),

      initialized: this.isInitialized(),

      version: this.getVersion(),

      created: this.getCreatedTime(),

      status: this.isInitialized()
          ? "READY"
          : "NOT_READY"

    };

  }

    /**
   * ---------------------------------------------------------------------------
   * Service Information
   * ---------------------------------------------------------------------------
   */
  info() {

    return {

      module: this.getModule(),

      service: this.getName(),

      version: this.getVersion(),

      initialized: this.isInitialized(),

      created: this.getCreatedTime(),

      runtime: this.runtime()

    };

  }

}

/**
 * =============================================================================
 * Example Service
 * =============================================================================
 */

class ExampleService extends BaseService {

  constructor() {

    super("ExampleService");

    this.setModule("Core");

  }

  hello() {

    this.log("Hello Workspace ERP");

    return "Hello Workspace ERP";

  }

}



/**
 * =============================================================================
 * TEST
 * =============================================================================
 */

function test_BaseService() {

  initializeWEF();

  const service = new ExampleService();

  service.initialize();

  Logger.log(service.getName());

  Logger.log(service.getVersion());

  Logger.log(service.isInitialized());

  Logger.log(service.hello());

  Logger.log(service.runtime());

}