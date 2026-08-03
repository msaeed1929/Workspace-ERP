/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 011_Core_SchemaEngine.gs
 * Version     : 3.2.0
 * Description : Schema Registry Engine
 * Author      : OpenAI + Muhammad Saeed Anser
 * =============================================================================
 */

'use strict';

class SchemaEngineService extends BaseService {

  constructor() {
    super("SchemaEngine");
    this.initialize();
  }

  initialize() {
    super.initialize();
    this._schemas = {};
    return this;
  }

  //=========================================================================
  // Internal
  //=========================================================================

  _clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  _exists(name) {
    return Object.prototype.hasOwnProperty.call(this._schemas, name);
  }

  has(entityName) {
    return this.exists(entityName);
  }

  //=========================================================================
  // Schema Registration
  //=========================================================================

  register(entityName) {
    if (!entityName) {
      throw new Error("Entity name is required.");
    }

    if (this._exists(entityName)) {
      return this;
    }

    const entity = WEF.EntityManager.get(entityName);

    if (!entity) {
      throw new Error(`Entity '${entityName}' is not registered.`);
    }

    this._schemas[entityName] = {
      entity: entity.name,
      sheet: entity.sheet,
      key: entity.key,
      fields: this._clone(entity.fields),
      relationships: this._clone(entity.relationships),
      version: WEF_FRAMEWORK.VERSION,
      created: new Date(),
      lastSync: null
    };

    return this;
  }

  unregister(entityName) {
    delete this._schemas[entityName];
    return this;
  }

  exists(entityName) {
    return this._exists(entityName);
  }

  get(entityName) {
    if (!this.exists(entityName)) {
      return null;
    }
    return this._clone(this._schemas[entityName]);
  }

  list() {
    return Object.keys(this._schemas);
  }

  count() {
    return this.list().length;
  }

  //=========================================================================
  // Sheet Management
  //=========================================================================

  spreadsheet() {
    return WEF.Environment.getSpreadsheet();
  }

  sheetExists(sheetName) {
    return this.spreadsheet().getSheetByName(sheetName) !== null;
  }

  getSheet(sheetName) {
    return this.spreadsheet().getSheetByName(sheetName);
  }

  createSheet(sheetName) {
    if (this.sheetExists(sheetName)) {
      return this.getSheet(sheetName);
    }

    const sheet = this.spreadsheet().insertSheet(sheetName);
    sheet.setFrozenRows(1);

    return sheet;
  }

  deleteSheet(sheetName) {
    const sheet = this.getSheet(sheetName);

    if (sheet) {
      this.spreadsheet().deleteSheet(sheet);
    }

    return this;
  }

  //=========================================================================
  // Header Management
  //=========================================================================

  createHeaders(entityName) {
    const schema = this.get(entityName);

    if (!schema) {
      throw new Error(`Schema '${entityName}' not found.`);
    }

    const sheet = this.createSheet(schema.sheet);
    const headers = schema.fields.map(field => field.name);

    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    return this;
  }

  freezeHeader(entityName) {
    const schema = this.get(entityName);
    if (!schema) return this;

    const sheet = this.getSheet(schema.sheet);
    sheet.setFrozenRows(1);

    return this;
  }

  applyFilter(entityName) {
    const schema = this.get(entityName);
    if (!schema) return this;

    const sheet = this.getSheet(schema.sheet);
    const lastColumn = schema.fields.length;

    if (lastColumn > 0) {
      const range = sheet.getRange(1, 1, 1, lastColumn);

      if (sheet.getFilter()) {
        sheet.getFilter().remove();
      }

      range.createFilter();
    }

    return this;
  }

  autoResize(entityName) {
    const schema = this.get(entityName);
    if (!schema) return this;

    const sheet = this.getSheet(schema.sheet);
    const lastColumn = schema.fields.length;

    for (let c = 1; c <= lastColumn; c++) {
      sheet.autoResizeColumn(c);
    }

    return this;
  }

  applyHeaderStyle(entityName) {
    const schema = this.get(entityName);
    if (!schema) return this;

    const sheet = this.getSheet(schema.sheet);
    const lastColumn = schema.fields.length;
    const range = sheet.getRange(1, 1, 1, lastColumn);

    range
      .setBackground("#0B5394")
      .setFontColor("#FFFFFF")
      .setFontWeight("bold")
      .setHorizontalAlignment("center");

    return this;
  }

  //=========================================================================
  // Synchronize
  //=========================================================================

  sync(entityName) {
    const schema = this.get(entityName);

    if (!schema) {
      throw new Error(`Schema '${entityName}' not found.`);
    }

    this.createHeaders(entityName);
    this.format(entityName);
    this.touch(entityName);

    return this;
  }

  //=========================================================================
  // Schema Migration
  //=========================================================================

  getHeaders(entityName) {
    const schema = this.get(entityName);

    if (!schema) {
      throw new Error(`Schema '${entityName}' not found.`);
    }

    const sheet = this.getSheet(schema.sheet);
    if (!sheet) return [];

    const lastColumn = sheet.getLastColumn();
    if (lastColumn === 0) return [];

    return sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  }

  missingFields(entityName) {
    const schema = this.get(entityName);

    if (!schema) {
      throw new Error(`Schema '${entityName}' not found.`);
    }

    const headers = this.getHeaders(entityName);
    return schema.fields.filter(field => !headers.includes(field.name));
  }

  extraColumns(entityName) {
    const schema = this.get(entityName);

    if (!schema) {
      throw new Error(`Schema '${entityName}' not found.`);
    }

    const headers = this.getHeaders(entityName);

    return headers.filter(header =>
      !schema.fields.some(field => field.name === header)
    );
  }

  addMissingColumns(entityName) {
    const schema = this.get(entityName);

    if (!schema) {
      throw new Error(`Schema '${entityName}' not found.`);
    }

    const sheet = this.getSheet(schema.sheet);
    const headers = this.getHeaders(entityName);
    const missing = this.missingFields(entityName);

    missing.forEach(field => {
      const column = headers.length + 1;
      sheet.getRange(1, column).setValue(field.name);
      headers.push(field.name);
    });

    return missing.length;
  }

  validateHeaders(entityName) {
    const missing = this.missingFields(entityName);
    const extra = this.extraColumns(entityName);

    return {
      valid: missing.length === 0,
      missing: missing.map(f => f.name),
      extra: extra
    };
  }

  migrate(entityName) {
    const schema = this.get(entityName);

    if (!schema) {
      throw new Error(`Schema '${entityName}' not found.`);
    }

    if (!this.sheetExists(schema.sheet)) {
      this.sync(entityName);

      return {
        created: true,
        added: schema.fields.length,
        missing: [],
        extra: []
      };
    }

    const added = this.addMissingColumns(entityName);
    this.format(entityName);
    this.touch(entityName);

    return {
      created: false,
      added: added,
      validation: this.validateHeaders(entityName)
    };
  }

  //=========================================================================
  // Field Formatting Engine
  //=========================================================================

  applyFieldFormats(entityName) {
    const schema = this.get(entityName);

    if (!schema) {
      throw new Error(`Schema '${entityName}' not found.`);
    }

    const sheet = this.getSheet(schema.sheet);

    schema.fields.forEach((field, index) => {
      const column = index + 1;
      const range = sheet.getRange(2, column, Math.max(sheet.getMaxRows() - 1, 1), 1);
      const type = String(field.type || WEF.Constants.DataType.STRING).toUpperCase();

      switch (type) {
        case "NUMBER":
          range.setNumberFormat("#,##0.00");
          break;

        case "INTEGER":
          range.setNumberFormat("0");
          break;

        case "CURRENCY":
          range.setNumberFormat("#,##0.00");
          break;

        case "PERCENT":
          range.setNumberFormat("0.00%");
          break;

        case "DATE":
          range.setNumberFormat("dd/MM/yyyy");
          break;

        case "DATETIME":
          range.setNumberFormat("dd/MM/yyyy HH:mm:ss");
          break;

        case "TIME":
          range.setNumberFormat("HH:mm:ss");
          break;

        case "BOOLEAN":
          range.insertCheckboxes();
          break;

        default:
          range.setNumberFormat("@");
      }
    });

    return this;
  }

  //=========================================================================
  // Required Field Highlight
  //=========================================================================

  highlightRequiredFields(entityName) {
    const schema = this.get(entityName);
    if (!schema) return this;

    const sheet = this.getSheet(schema.sheet);

    schema.fields.forEach((field, index) => {
      if (field.required) {
        sheet.getRange(1, index + 1)
          .setBackground("#C00000")
          .setFontColor("#FFFFFF")
          .setFontWeight("bold");
      }
    });

    return this;
  }

  //=========================================================================
  // Auto Column Width
  //=========================================================================

  setDefaultWidths(entityName) {
    const schema = this.get(entityName);
    if (!schema) return this;

    const sheet = this.getSheet(schema.sheet);

    schema.fields.forEach((field, index) => {
      const column = index + 1;
      const type = String(field.type || WEF.Constants.DataType.STRING).toUpperCase();

      switch (type) {
        case "DATE":
        case "DATETIME":
          sheet.setColumnWidth(column, 140);
          break;

        case "BOOLEAN":
          sheet.setColumnWidth(column, 90);
          break;

        case "NUMBER":
        case "INTEGER":
        case "CURRENCY":
        case "PERCENT":
          sheet.setColumnWidth(column, 120);
          break;

        default:
          sheet.setColumnWidth(column, 180);
      }
    });

    return this;
  }

  //=========================================================================
  // Apply Complete Layout
  //=========================================================================

  format(entityName) {
    this.applyHeaderStyle(entityName);
    this.freezeHeader(entityName);
    this.applyFilter(entityName);
    this.autoResize(entityName);
    this.applyFieldFormats(entityName);
    this.highlightRequiredFields(entityName);
    this.setDefaultWidths(entityName);

    return this;
  }

  //=========================================================================
  // Schema Versioning
  //=========================================================================

  setVersion(entityName, version) {
    const schema = this._schemas[entityName];

    if (!schema) {
      throw new Error(`Schema '${entityName}' not found.`);
    }

    schema.version = version;
    return this;
  }

  getVersion(entityName) {
    const schema = this._schemas[entityName];
    return schema ? schema.version : null;
  }

  touch(entityName) {
    const schema = this._schemas[entityName];

    if (schema) {
      schema.lastSync = new Date();
    }

    return this;
  }

  //=========================================================================
  // Snapshot
  //=========================================================================

  snapshot(entityName) {
    const schema = this.get(entityName);

    if (!schema) {
      throw new Error(`Schema '${entityName}' not found.`);
    }

    return {
      entity: schema.entity,
      sheet: schema.sheet,
      version: schema.version,
      fields: this._clone(schema.fields),
      relationships: this._clone(schema.relationships),
      created: schema.created,
      lastSync: schema.lastSync,
      exported: new Date()
    };
  }

  compare(snapshot) {
    const current = this.get(snapshot.entity);

    if (!current) {
      throw new Error(`Schema '${snapshot.entity}' not found.`);
    }

    const currentFields = (current.fields || []).map(f => f.name);
    const oldFields = (snapshot.fields || []).map(f => f.name);

    return {
      added: currentFields.filter(f => !oldFields.includes(f)),
      removed: oldFields.filter(f => !currentFields.includes(f)),
      changed: this.getVersion(snapshot.entity) !== snapshot.version
    };
  }

  //=========================================================================
  // Export / Import
  //=========================================================================

  exportSchema(entityName) {
    return JSON.stringify(
      this.snapshot(entityName),
      null,
      2
    );
  }

  importSchema(json) {
    const schema = typeof json === "string" ? JSON.parse(json) : json;

    this._schemas[schema.entity] = this._clone(schema);
    this.touch(schema.entity);

    return this;
  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {
    let schemaCount = 0;
    let fieldCount = 0;
    let relationshipCount = 0;

    Object.keys(this._schemas).forEach(name => {
      schemaCount++;
      fieldCount += (this._schemas[name].fields || []).length;
      relationshipCount += (this._schemas[name].relationships || []).length;
    });

    return {
      schemas: schemaCount,
      fields: fieldCount,
      relationships: relationshipCount
    };
  }

  clear() {
    this._schemas = {};
    return this.initialize();
  }

  info() {
    return {
      service: this.getName(),
      version: WEF_FRAMEWORK.VERSION,
      created: this.getCreatedTime(),
      initialized: this.isInitialized(),
      frameworkVersion: WEF_FRAMEWORK.VERSION,
      frameworkBuild: WEF_FRAMEWORK.BUILD,
      environment: WEF.Config.get("ENVIRONMENT"),
      statistics: this.statistics()
    };
  }
}

WEF.Schema = new SchemaEngineService();

if (!WEF.ServiceRegistry.has("SchemaEngine")) {
  WEF.ServiceRegistry.register(
    "SchemaEngine",
    WEF.Schema
  );
}

/**
 * =============================================================================
 * TEST : Schema Engine
 * =============================================================================
 */

function test_SchemaEngine() {
  WEF.Kernel.boot();

  Logger.log("========== SCHEMA ENGINE ==========");

  //--------------------------------------------------------------------------
  // Reset
  //--------------------------------------------------------------------------
  WEF.EntityManager.clear();
  WEF.Schema.clear();

  //--------------------------------------------------------------------------
  // Register Entity
  //--------------------------------------------------------------------------
  WEF.EntityManager.register({
    name: "Customer",
    module: "Sales",
    sheet: "Customers",
    key: "CustomerID"
  });

  WEF.EntityManager.addField("Customer", {
    name: "CustomerID",
    type: "STRING",
    required: true,
    primaryKey: true
  });

  WEF.EntityManager.addField("Customer", {
    name: "CustomerName",
    type: "STRING",
    required: true
  });

  WEF.EntityManager.addField("Customer", {
    name: "Phone",
    type: "STRING"
  });

  WEF.EntityManager.addField("Customer", {
    name: "Email",
    type: "STRING"
  });

  WEF.EntityManager.addField("Customer", {
    name: "CreditLimit",
    type: "NUMBER"
  });

  //--------------------------------------------------------------------------
  // Register Schema
  //--------------------------------------------------------------------------
  WEF.Schema.register("Customer");

  Logger.log("Count:");
  Logger.log(WEF.Schema.count());

  Logger.log("List:");
  Logger.log(WEF.Schema.list());

  Logger.log("Exists:");
  Logger.log(WEF.Schema.exists("Customer"));

  Logger.log("Has:");
  Logger.log(WEF.Schema.has("Customer"));

  Logger.log("Schema:");
  Logger.log(WEF.Schema.get("Customer"));

  //--------------------------------------------------------------------------
  // Sheet Creation
  //--------------------------------------------------------------------------
  Logger.log("Create Sheet:");
  WEF.Schema.createSheet("Customers");

  Logger.log("Sheet Exists:");
  Logger.log(WEF.Schema.sheetExists("Customers"));

  Logger.log("Sheet:");
  Logger.log(WEF.Schema.getSheet("Customers").getName());

  //--------------------------------------------------------------------------
  // Header
  //--------------------------------------------------------------------------
  WEF.Schema.createHeaders("Customer");

  Logger.log("Headers:");
  Logger.log(WEF.Schema.getHeaders("Customer"));

  //--------------------------------------------------------------------------
  // Formatting
  //--------------------------------------------------------------------------
  WEF.Schema.freezeHeader("Customer");
  WEF.Schema.applyFilter("Customer");
  WEF.Schema.applyHeaderStyle("Customer");
  WEF.Schema.applyFieldFormats("Customer");
  WEF.Schema.highlightRequiredFields("Customer");
  WEF.Schema.setDefaultWidths("Customer");
  WEF.Schema.autoResize("Customer");
  WEF.Schema.format("Customer");

  //--------------------------------------------------------------------------
  // Sync
  //--------------------------------------------------------------------------
  Logger.log("Sync:");
  Logger.log(WEF.Schema.sync("Customer"));

  //--------------------------------------------------------------------------
  // Validation
  //--------------------------------------------------------------------------
  Logger.log("Missing Fields:");
  Logger.log(WEF.Schema.missingFields("Customer"));

  Logger.log("Extra Columns:");
  Logger.log(WEF.Schema.extraColumns("Customer"));

  Logger.log("Validate:");
  Logger.log(WEF.Schema.validateHeaders("Customer"));

  Logger.log("Migration:");
  Logger.log(WEF.Schema.migrate("Customer"));

  Logger.log("Headers:");

  Logger.log(WEF.Schema.getHeaders("Customer"));

  //--------------------------------------------------------------------------
  // Version
  //--------------------------------------------------------------------------
  Logger.log("Version:");
  Logger.log(WEF.Schema.getVersion("Customer"));

  WEF.Schema.setVersion("Customer", "3.2.1");

  Logger.log("Updated Version:");
  Logger.log(WEF.Schema.getVersion("Customer"));

  Logger.log("Touch:");

    WEF.Schema.touch("Customer");

    Logger.log(
    WEF.Schema.get("Customer").lastSync
    );

  //--------------------------------------------------------------------------
  // Snapshot
  //--------------------------------------------------------------------------
  const snapshot = WEF.Schema.snapshot("Customer");

  Logger.log("Snapshot:");
  Logger.log(snapshot);

  Logger.log("Compare:");
  Logger.log(WEF.Schema.compare(snapshot));

  //--------------------------------------------------------------------------
  // Export / Import
  //--------------------------------------------------------------------------
  const exported = WEF.Schema.exportSchema("Customer");

  Logger.log("Export:");
  Logger.log(exported);

  WEF.Schema.clear();

  Logger.log("After Clear:");
  Logger.log(WEF.Schema.count());

  WEF.Schema.importSchema(exported);

  Logger.log("After Import:");
  Logger.log(WEF.Schema.list());

  //--------------------------------------------------------------------------
  // Statistics
  //--------------------------------------------------------------------------
  Logger.log("Statistics:");
  Logger.log(WEF.Schema.statistics());

  Logger.log("Info:");
  Logger.log(WEF.Schema.info());

  //--------------------------------------------------------------------------
  // Cleanup
  //--------------------------------------------------------------------------
  WEF.Schema.unregister("Customer");

  Logger.log("After Unregister:");
  Logger.log(WEF.Schema.count());

  Logger.log("Delete Sheet:");

  WEF.Schema.deleteSheet("Customers");

  Logger.log(WEF.Schema.sheetExists("Customers"));
}