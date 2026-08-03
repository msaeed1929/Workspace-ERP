/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 012_Core_Database.gs
 * Version     : 3.2.0
 * Description : Database Service
 * Author      : OpenAI + Muhammad Saeed Anser
 * =============================================================================
 */

'use strict';

class DatabaseService extends BaseService {

  constructor() {
    super("Database");
    this.initialize();
  }

  initialize() {
    super.initialize();

    this._spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    this._cache = {};
    this._batch = [];
    this._connected = true;
    this._transaction = false;
    this._lastOperation = null;

    this._statistics = {
      reads: 0,
      inserts: 0,
      updates: 0,
      deletes: 0,
      batches: 0
    };

    return this;
  }

  //=========================================================================
  // Connection
  //=========================================================================

  connect() {
    this._spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    this._connected = true;
    this._lastOperation = new Date();
    return this;
  }

  disconnect() {
    this._connected = false;
    return this;
  }

  isConnected() {
    return this._connected;
  }

  spreadsheet() {
    if (!this._connected) {
      throw new Error("Database is not connected.");
    }
    if (!this._spreadsheet) {
      this.connect();
    }
    return this._spreadsheet;
  }

  sheet(entityName) {
    if (!WEF.EntityManager.has(entityName)) {
      throw new Error(`Entity '${entityName}' is not registered.`);
    }

    const schema = WEF.Schema.get(entityName);
    if (!schema) {
      throw new Error(`Schema '${entityName}' not found.`);
    }

    const sheet = this.spreadsheet().getSheetByName(schema.sheet);
    if (!sheet) {
      throw new Error(`Sheet '${schema.sheet}' not found.`);
    }

    return sheet;
  }

  schema(entityName) {
    const schema = WEF.Schema.get(entityName);
    if (!schema) {
      throw new Error(`Schema '${entityName}' not found.`);
    }
    return schema;
  }

  entity(entityName) {
    const entity = WEF.EntityManager.get(entityName);
    if (!entity) {
      throw new Error(`Entity '${entityName}' not found.`);
    }
    return entity;
  }

  //=========================================================================
  // Headers
  //=========================================================================

  headers(entityName) {
    return this.schema(entityName).fields.map(field => field.name);
  }

  headerIndex(entityName) {
    const map = {};
    this.headers(entityName).forEach((header, index) => {
      map[header] = index;
    });
    return map;
  }

  columnNumber(entityName, field) {
    const index = this.headerIndex(entityName);
    if (index[field] === undefined) {
      return null;
    }
    return index[field] + 1;
  }

  //=========================================================================
  // Sheet Information
  //=========================================================================

  lastRow(entityName) {
    return this.sheet(entityName).getLastRow();
  }

  lastColumn(entityName) {
    return this.sheet(entityName).getLastColumn();
  }

  dataRange(entityName) {
    return this.sheet(entityName).getDataRange();
  }

  hasData(entityName) {
    return this.lastRow(entityName) > 1;
  }

  //=========================================================================
  // Reading Engine
  //=========================================================================

  rows(entityName) {
    const sheet = this.sheet(entityName);
    const lastRow = sheet.getLastRow();
    const lastColumn = sheet.getLastColumn();

    if (lastRow <= 1) return [];

    const values = sheet
      .getRange(2, 1, lastRow - 1, lastColumn)
      .getValues();

    this._statistics.reads++;
    return values;
  }

  toObject(entityName, row) {
    const headers = this.sheet(entityName)
      .getRange(1, 1, 1, this.lastColumn(entityName))
      .getValues()[0];

    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });

    return obj;
  }

  all(entityName) {
    return this.readAll(entityName);
  }

  readAll(entityName) {
    if (this.isCached(entityName)) {
      return this.getCache(entityName);
    }

    const rows = this.rows(entityName);
    const records = rows.map(row => this.toObject(entityName, row));
    const converted = this.convertRecords(entityName, records);

    this.setCache(entityName, converted);
    return converted;
  }

  findAll(entityName) {
    return this.readAll(entityName);
  }

  count(entityName) {
    return this.rows(entityName).length;
  }

  exists(entityName, id) {
    return this.findById(entityName, id) !== null;
  }

  findById(entityName, id) {
    const schema = this.schema(entityName);
    const key = schema.key;
    const records = this.readAll(entityName);

    for (const record of records) {
      if (record[key] == id) {
        return record;
      }
    }

    return null;
  }

  findOne(entityName, predicate) {
    const records = this.readAll(entityName);

    for (const record of records) {
      if (predicate(record)) {
        return record;
      }
    }

    return null;
  }

  filter(entityName, predicate) {
    return this.readAll(entityName).filter(predicate);
  }

  //=========================================================================
  // Cache Engine
  //=========================================================================

  cacheKey(entityName) {
    return `DB_${entityName}`;
  }

  isCached(entityName) {
    return Object.prototype.hasOwnProperty.call(this._cache, this.cacheKey(entityName));
  }

  getCache(entityName) {
    return this._cache[this.cacheKey(entityName)] || null;
  }

  setCache(entityName, data) {
    this._cache[this.cacheKey(entityName)] = JSON.parse(JSON.stringify(data));
    return data;
  }

  clearCache(entityName) {
    if (entityName) {
      delete this._cache[this.cacheKey(entityName)];
    } else {
      this._cache = {};
    }
    return this;
  }

  refresh(entityName) {
    this.clearCache(entityName);
    return this.readAll(entityName);
  }

  //=========================================================================
  // Insert Engine
  //=========================================================================

  prepareRecord(entityName, data) {
    const schema = this.schema(entityName);
    const record = {};

    schema.fields.forEach(field => {
      let value = data[field.name];

      if (value === undefined || value === null || value === "") {
        if (typeof field.defaultValue === "function") {
          value = field.defaultValue();
        } else {
          value = field.defaultValue;
        }
      }

      record[field.name] = value;
    });

    return record;
  }

  toRow(entityName, record) {
    const headers = this.headers(entityName);
    return headers.map(header => record[header]);
  }

  insert(entityName, data) {
    const validator = WEF.Validator;
    validator.clear();

    const record = this.prepareRecord(entityName, data);
    record.CreatedAt = new Date();
    record.UpdatedAt = new Date();

    const schema = this.schema(entityName);

    schema.fields.forEach(field => {
      if (field.required) {
        validator.required(field.name, record[field.name]);
      }
    });

    if (validator.hasErrors()) {
      throw new Error(JSON.stringify(validator.getErrors(), null, 2));
    }

    const row = this.toRow(entityName, record);
    this.sheet(entityName).appendRow(row);

    this._statistics.inserts++;
    this._lastOperation = new Date();
    this.clearCache(entityName);

    return record;
  }

  insertMany(entityName, records) {
    const inserted = [];

    records.forEach(record => {
      inserted.push(this.insert(entityName, record));
    });

    return inserted;
  }

  //=========================================================================
  // Update Engine
  //=========================================================================

  rowIndexById(entityName, id) {
    const schema = this.schema(entityName);
    const key = schema.key;
    const records = this.readAll(entityName);

    for (let i = 0; i < records.length; i++) {
      if (records[i][key] == id) {
        return i + 2;
      }
    }

    return -1;
  }

  update(entityName, id, data) {
    const rowIndex = this.rowIndexById(entityName, id);

    if (rowIndex < 2) {
      throw new Error("Record not found.");
    }

    const existing = this.findById(entityName, id);
    const updated = Object.assign({}, existing, data);
    updated.UpdatedAt = new Date();

    const row = this.toRow(entityName, updated);

    this.sheet(entityName)
      .getRange(rowIndex, 1, 1, row.length)
      .setValues([row]);

    this._statistics.updates++;
    this._lastOperation = new Date();
    this.clearCache(entityName);

    return updated;
  }

  updateMany(entityName, records) {
    const result = [];

    records.forEach(record => {
      const schema = this.schema(entityName);
      result.push(
        this.update(entityName, record[schema.key], record)
      );
    });

    return result;
  }

  upsert(entityName, data) {
    const schema = this.schema(entityName);
    const id = data[schema.key];

    if (this.exists(entityName, id)) {
      return this.update(entityName, id, data);
    }

    return this.insert(entityName, data);
  }

  //=========================================================================
  // Delete Engine
  //=========================================================================

  delete(entityName, criteria) {
    const records = this.all(entityName);
    const sheet = this.sheet(entityName);

    const index = records.findIndex(record => {
      return Object.keys(criteria).every(key => record[key] === criteria[key]);
    });

    if (index === -1) {
      return false;
    }

    sheet.deleteRow(index + 2);
    this.clearCache(entityName);

    this._statistics.deletes++;
    this._lastOperation = new Date();

    return true;
  }

  deleteMany(entityName, criteriaList) {
    let deleted = 0;

    for (let i = criteriaList.length - 1; i >= 0; i--) {
      if (this.delete(entityName, criteriaList[i])) {
        deleted++;
      }
    }

    return deleted;
  }

  //=========================================================================
  // Truncate Engine
  //=========================================================================

  truncate(entityName) {
    const sheet = this.sheet(entityName);
    const lastRow = sheet.getLastRow();

    if (lastRow > 1) {
      sheet.getRange(
        2,
        1,
        lastRow - 1,
        sheet.getLastColumn()
      ).clear({ contentsOnly: true });
    }

    this.clearCache(entityName);
    return true;
  }

  //=========================================================================
  // Query Engine
  //=========================================================================

  where(entityName, criteria) {
    const rows = this.readAll(entityName);

    if (!criteria) return rows;

    if (typeof criteria === "function") {
      return rows.filter(criteria);
    }

    if (typeof criteria === "object") {
      return rows.filter(row => {
        return Object.keys(criteria).every(key => row[key] === criteria[key]);
      });
    }

    return [];
  }

  select(entityName, fields) {
    return this.readAll(entityName).map(record => {
      const obj = {};
      fields.forEach(field => {
        obj[field] = record[field];
      });
      return obj;
    });
  }

  orderBy(entityName, field, direction = "ASC") {
    const records = this.readAll(entityName).slice();

    records.sort((a, b) => {
      if (a[field] === b[field]) return 0;

      if (direction.toUpperCase() === "DESC") {
        return a[field] > b[field] ? -1 : 1;
      }

      return a[field] > b[field] ? 1 : -1;
    });

    return records;
  }

  limit(entityName, limit) {
    return this.readAll(entityName).slice(0, limit);
  }

  offset(entityName, offset) {
    return this.readAll(entityName).slice(offset);
  }

  paginate(entityName, page, pageSize) {
    const records = this.readAll(entityName);
    const start = (page - 1) * pageSize;

    return {
      page: page,
      pageSize: pageSize,
      totalRecords: records.length,
      totalPages: Math.ceil(records.length / pageSize),
      data: records.slice(start, start + pageSize)
    };
  }

  distinct(entityName, field) {
    return [...new Set(
      this.readAll(entityName).map(r => r[field])
    )];
  }

  sum(entityName, field) {
    return this.readAll(entityName)
      .reduce((a, b) => a + (Number(b[field]) || 0), 0);
  }

  average(entityName, field) {
    const records = this.readAll(entityName);
    if (records.length === 0) return 0;

    return this.sum(entityName, field) / records.length;
  }

  min(entityName, field) {
    const values = this.readAll(entityName)
      .map(r => Number(r[field]));

    return Math.min(...values);
  }

  max(entityName, field) {
    const values = this.readAll(entityName)
      .map(r => Number(r[field]));

    return Math.max(...values);
  }

  //=========================================================================
  // Type Conversion Engine
  //=========================================================================

  convertValue(field, value) {
    if(value===null||value===undefined||value===""){

      switch(String(field.type||"STRING").toUpperCase()){

        case "NUMBER":
        case "INTEGER":
        case "DECIMAL":
        case "CURRENCY":
        return null;

        case "BOOLEAN":
        return false;

        default:
        return "";

      }

    }

    const type = String(field.type || "STRING").toUpperCase();

    switch (type) {
      case "STRING":
      case "TEXT":
      case "PHONE":
      case "CNIC":
      case "NTN":
      case "STRN":
      case "IBAN":
      case "EMAIL":
      case "URL":
      case "SKU":
      case "BARCODE":
      case "CODE":
        return String(value);

      case "NUMBER":
      case "DECIMAL":
      case "CURRENCY":
        return Number(value);

      case "INTEGER":
        return parseInt(value, 10);

      case "BOOLEAN":
        if (typeof value === "boolean") return value;
        if (typeof value === "number") return value !== 0;

        const text = String(value).trim().toLowerCase();
        return ["true", "yes", "1", "y"].includes(text);

      case "DATE":
      case "DATETIME":
        if (value instanceof Date) return value;
        return new Date(value);

      default:
        return value;
    }
  }

  convertRecord(entityName, record) {
    const schema = this.schema(entityName);
    const converted = {};

    schema.fields.forEach(field => {
      converted[field.name] = this.convertValue(
        field,
        record[field.name]
      );
    });

    return converted;
  }

  convertRecords(entityName, records) {
    return records.map(record => this.convertRecord(entityName, record));
  }

  //=========================================================================
  // Batch & Transaction Engine
  //=========================================================================

  beginBatch() {
    this._batch = [];
    return this;
  }

  batchInsert(entityName, data) {
    this._batch.push({
      operation: "INSERT",
      entity: entityName,
      data: data
    });
    return this;
  }

  batchUpdate(entityName, id, data) {
    this._batch.push({
      operation: "UPDATE",
      entity: entityName,
      id: id,
      data: data
    });
    return this;
  }

  batchDelete(entityName, id) {
    this._batch.push({
      operation: "DELETE",
      entity: entityName,
      id: id
    });
    return this;
  }

  commit() {
    const lock = LockService.getDocumentLock();
    lock.waitLock(WEF.Config.get("LOCK_TIMEOUT") || 30000);

    try {
      const results = [];

      this._batch.forEach(item => {
        switch (item.operation) {
          case "INSERT":
            results.push(this.insert(item.entity, item.data));
            break;

          case "UPDATE":
            results.push(this.update(item.entity, item.id, item.data));
            break;

          case "DELETE": {
            const schema = this.schema(item.entity);
            const criteria = {};
            criteria[schema.key] = item.id;
            results.push(this.delete(item.entity, criteria));
            break;
          }
        }
      });

      this._batch = [];
      this._statistics.batches++;
      this._lastOperation = new Date();

      return results;
    } finally {
      lock.releaseLock();
    }
  }

  rollback(){

      const discarded=this._batch.length;

      this._batch=[];

    return{

      success:true,

      discarded:discarded,

      message:"Batch queue cleared."

    };

  }

  runTransaction(callback) {
    const lock = LockService.getDocumentLock();
    lock.waitLock(WEF.Config.get("LOCK_TIMEOUT") || 30000);

    try {
      this._transaction = true;
      const result = callback(this);
      this._transaction = false;
      return result;
    } finally {
      lock.releaseLock();
    }
  }

  health() {
    return {
      schemaCount:WEF.Schema.count(),
      entityCount:WEF.EntityManager.count(),
      connected: this.isConnected(),
      spreadsheet: this.spreadsheet().getName(),
      cacheEntities: Object.keys(this._cache).length,
      batchOperations: this._batch.length,
      transaction: this._transaction,
      services: {
        validator: !!WEF.Validator,
        schema: !!WEF.Schema,
        entityManager: !!WEF.EntityManager,
        metadata: !!WEF.Metadata,
        migration: !!WEF.Migration
      }
    };
  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics(){

    return{

      connected: this.isConnected(),

      cacheEntities: Object.keys(this._cache).length,

      cachedRecords: Object.values(this._cache).reduce(
        (total, records) => total + (Array.isArray(records) ? records.length : 0),
        0
      ),

      batchOperations: this._batch.length,

      reads: this._reads,

      inserts: this._inserts,

      updates: this._updates,

      deletes: this._deletes,

      batches: this._batches,

      lastOperation: this._lastOperation,

      timestamp: new Date()

    };

  }

  info() {
    return {
      service: this.getName(),
      version: this.getVersion(),
      initialized: this.isInitialized(),
      created: this.getCreatedTime(),
      frameworkVersion: WEF_FRAMEWORK.VERSION,
      frameworkBuild: WEF_FRAMEWORK.BUILD,
      environment: ERPConfig.ENVIRONMENT,
      statistics: this.statistics(),
      connected: this._connected,
      spreadsheet: this.spreadsheet().getName(),
      entityManager: !!WEF.EntityManager,
      schemaEngine: !!WEF.Schema,
      validator: !!WEF.Validator,
      metadata: !!WEF.Metadata,
      migration: !!WEF.Migration
    };
  }
}

WEF.Database = new DatabaseService();

WEF.ServiceRegistry.register(
  "Database",
  WEF.Database
);

function test_Database() {
  Logger.log("========== DATABASE ==========");

  WEF.Kernel.boot();

  WEF.EntityManager.initialize();
  WEF.Schema.initialize();
  WEF.Database.initialize();

  WEF.EntityManager.clear();
  WEF.Schema.clear();
  WEF.Database.clearCache();

  //--------------------------------------------------
  // Register Entity
  //--------------------------------------------------
  WEF.EntityManager.register({
    name: "Customer",
    sheet: "Customers",
    key: "CustomerID"
  });

  WEF.EntityManager.addField("Customer", {
    name: "CustomerID",
    type: "STRING",
    primaryKey: true,
    required: true
  });

  WEF.EntityManager.addField("Customer", {
    name: "CustomerName",
    type: "STRING",
    required: true
  });

  WEF.EntityManager.addField("Customer", {
    name: "City",
    type: "STRING"
  });

  WEF.EntityManager.addField("Customer", {
    name: "CreditLimit",
    type: "NUMBER"
  });

  WEF.Schema.register("Customer");
  WEF.Schema.sync("Customer");

  //--------------------------------------------------
  // Prepare Sheet
  //--------------------------------------------------
  const sheet = WEF.Database.sheet("Customer");
  WEF.Database.truncate("Customer");

  //--------------------------------------------------
  // Connection
  //--------------------------------------------------
  Logger.log("Connected:");
  Logger.log(WEF.Database.isConnected());

  Logger.log("Spreadsheet:");
  Logger.log(WEF.Database.spreadsheet().getName());

  //--------------------------------------------------
  // Batch Insert
  //--------------------------------------------------
  WEF.Database.beginBatch();

  WEF.Database.batchInsert("Customer", {
    CustomerID: "CUS001",
    CustomerName: "ABC Traders",
    City: "Lahore",
    CreditLimit: 100000
  });

  WEF.Database.batchInsert("Customer", {
    CustomerID: "CUS002",
    CustomerName: "XYZ Textile",
    City: "Faisalabad",
    CreditLimit: 250000
  });

  WEF.Database.batchInsert("Customer", {
    CustomerID: "CUS003",
    CustomerName: "Royal Fabrics",
    City: "Karachi",
    CreditLimit: 175000
  });

  Logger.log("Pending Batch:");
  Logger.log(WEF.Database.statistics());

  Logger.log("Commit:");
  Logger.log(WEF.Database.commit());

  //--------------------------------------------------
  // Reading
  //--------------------------------------------------
  Logger.log("Count:");
  Logger.log(WEF.Database.count("Customer"));

  Logger.log("All:");
  Logger.log(WEF.Database.readAll("Customer"));

  Logger.log("Find By ID:");
  Logger.log(WEF.Database.findById("Customer", "CUS002"));

  Logger.log("Exists:");
  Logger.log(WEF.Database.exists("Customer", "CUS003"));

  Logger.log("Rows:");
  Logger.log(WEF.Database.rows("Customer"));

  //--------------------------------------------------
  // Query
  //--------------------------------------------------
  Logger.log("Where:");
  Logger.log(WEF.Database.where("Customer", { City: "Lahore" }));

  Logger.log("Filter:");
  Logger.log(WEF.Database.filter("Customer", r => r.CreditLimit > 150000));

  Logger.log("Select:");
  Logger.log(
    WEF.Database.select("Customer", [
      "CustomerID",
      "CustomerName"
    ])
  );

  Logger.log("Order By:");
  Logger.log(WEF.Database.orderBy("Customer", "CustomerName"));

  Logger.log("Limit:");
  Logger.log(WEF.Database.limit("Customer", 2));

  Logger.log("Offset:");
  Logger.log(WEF.Database.offset("Customer", 1));

  Logger.log("Pagination:");
  Logger.log(WEF.Database.paginate("Customer", 1, 2));

  Logger.log("Distinct Cities:");
  Logger.log(WEF.Database.distinct("Customer", "City"));

  //--------------------------------------------------
  // Aggregate
  //--------------------------------------------------
  Logger.log("Sum:");
  Logger.log(WEF.Database.sum("Customer", "CreditLimit"));

  Logger.log("Average:");
  Logger.log(WEF.Database.average("Customer", "CreditLimit"));

  Logger.log("Min:");
  Logger.log(WEF.Database.min("Customer", "CreditLimit"));

  Logger.log("Max:");
  Logger.log(WEF.Database.max("Customer", "CreditLimit"));

  //--------------------------------------------------
  // Update
  //--------------------------------------------------
  Logger.log("Update:");
  Logger.log(
    WEF.Database.update(
      "Customer",
      "CUS002",
      { CustomerName: "XYZ Textile Pvt Ltd" }
    )
  );

  //--------------------------------------------------
  // Upsert
  //--------------------------------------------------
  Logger.log("Upsert Existing:");
  Logger.log(
    WEF.Database.upsert(
      "Customer",
      {
        CustomerID: "CUS002",
        CustomerName: "XYZ Updated"
      }
    )
  );

  Logger.log("Upsert New:");
  Logger.log(
    WEF.Database.upsert(
      "Customer",
      {
        CustomerID: "CUS004",
        CustomerName: "New Customer"
      }
    )
  );

  //--------------------------------------------------
  // Delete
  //--------------------------------------------------
  Logger.log("Delete:");
  Logger.log(
    WEF.Database.delete(
      "Customer",
      { CustomerID: "CUS003" }
    )
  );

  //--------------------------------------------------
  // Batch Delete
  //--------------------------------------------------
  WEF.Database.beginBatch();
  WEF.Database.batchDelete("Customer", "CUS001");

  Logger.log("Rollback:");
  Logger.log(WEF.Database.rollback());

  //--------------------------------------------------
  // Transaction
  //--------------------------------------------------
  Logger.log("Transaction:");
  Logger.log(
    WEF.Database.runTransaction(db => {
      db.insert("Customer", {
        CustomerID: "CUS005",
        CustomerName: "Transaction Customer"
      });
      return true;
    })
  );

  //--------------------------------------------------
  // Cache
  //--------------------------------------------------
  Logger.log("Refresh:");
  Logger.log(WEF.Database.refresh("Customer"));

  Logger.log("Cache:");
  Logger.log(WEF.Database.statistics());

  //--------------------------------------------------
  // Health
  //--------------------------------------------------
  Logger.log("Health:");
  Logger.log(WEF.Database.health());

  Logger.log("Statistics:");
  Logger.log(WEF.Database.statistics());

  Logger.log("Info:");
  Logger.log(WEF.Database.info());
}