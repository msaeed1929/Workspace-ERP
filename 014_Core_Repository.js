/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 014_Core_Repository.js
 * Version     : 3.2.0
 * Description : Repository Layer Engine & Base Entity Repository
 * Author      : OpenAI + Muhammad Saeed Anser
 * =============================================================================
 */

'use strict';

/**
 * =============================================================================
 * Repository Service
 * =============================================================================
 */

class RepositoryService extends BaseService {

  constructor() {
    super("Repository");
    this.initialize();
  }

  //=========================================================================
  // Initialize
  //=========================================================================

  initialize() {
    super.initialize();
    this._repositories = {};
    return this;
  }

  //=========================================================================
  // Registration Engine
  //=========================================================================

  register(entityName, repository) {
    if (!entityName) {
      throw new Error("Entity name is required.");
    }

    if (!(repository instanceof BaseRepository)) {
      throw new Error("Repository must inherit BaseRepository.");
    }

    this._repositories[entityName] = repository;
    return repository;
  }

  has(entityName) {
    return Object.prototype.hasOwnProperty.call(this._repositories, entityName);
  }

  get(entityName) {
    if (!this.has(entityName)) {
      throw new Error("Repository '" + entityName + "' is not registered.");
    }

    return this._repositories[entityName];
  }

  remove(entityName) {
    delete this._repositories[entityName];
    return this;
  }

  clear() {
    this._repositories = {};
    return this;
  }

  //=========================================================================
  // Information & Diagnostics
  //=========================================================================

  count() {
    return Object.keys(this._repositories).length;
  }

  list() {
    return Object.keys(this._repositories);
  }

  statistics() {
    const isDbConnected = (typeof WEF !== "undefined" && WEF.Database && typeof WEF.Database.isConnected === "function") 
      ? WEF.Database.isConnected() 
      : false;

    return {
      repositories: this.count(),
      registered: this.list(),
      initialized: this.isInitialized(),
      databaseConnected: isDbConnected,
      timestamp: new Date()
    };
  }

  health() {
    const dbHealth = (typeof WEF !== "undefined" && WEF.Database && typeof WEF.Database.health === "function")
      ? WEF.Database.health()
      : null;

    return {
      initialized: this.isInitialized(),
      repositories: this.count(),
      registered: this.list(),
      database: dbHealth
    };
  }

  info() {
    const fwVersion = (typeof WEF !== "undefined" && WEF.Config && typeof WEF.Config.version === "function")
      ? WEF.Config.version()
      : "1.0.0";

    const env = (typeof WEF !== "undefined" && WEF.Config && typeof WEF.Config.environment === "function")
      ? WEF.Config.environment()
      : "production";

    return {
      service: this.getName(),
      version: this.getVersion(),
      initialized: this.isInitialized(),
      created: this.getCreatedTime(),
      statistics: this.statistics(),
      health: this.health(),
      frameworkVersion: fwVersion,
      environment: env
    };
  }
}

/**
 * =============================================================================
 * Base Repository
 * =============================================================================
 */

class BaseRepository extends BaseService {

  constructor(entityName) {
    if (!entityName) {
      throw new Error("Entity name is required.");
    }

    super(entityName + "Repository");
    this._entityName = entityName;
    this.initialize();
  }

  //=========================================================================
  // Initialize
  //=========================================================================

  initialize() {
    super.initialize();

    this._hooks = {
      beforeCreate: [],
      afterCreate: [],
      beforeUpdate: [],
      afterUpdate: [],
      beforeDelete: [],
      afterDelete: []
    };

    this._statistics = {
      creates: 0,
      updates: 0,
      deletes: 0,
      queries: 0,
      lastOperation: null
    };

    return this;
  }

  //=========================================================================
  // Entity Information
  //=========================================================================

  entity() {
    return this._entityName;
  }

  schema() {
    if (typeof WEF !== "undefined" && WEF.Schema && typeof WEF.Schema.get === "function") {
      return WEF.Schema.get(this._entityName);
    }
    return null;
  }

  key() {
    const schema = this.schema();
    return schema ? schema.key : "id";
  }

  sheet() {
    return this.database().sheet(this._entityName);
  }

  database() {
    if (typeof WEF !== "undefined" && WEF.Database) {
      return WEF.Database;
    }
    throw new Error("WEF.Database context is unavailable.");
  }

  validator() {
    if (typeof WEF !== "undefined" && WEF.Validator) {
      return WEF.Validator;
    }
    return null;
  }

  //=========================================================================
  // Statistics & Diagnostics
  //=========================================================================

  statistics() {
    return {
      entity: this._entityName,
      records: this.database().count(this.entity()),
      creates: this._statistics.creates,
      updates: this._statistics.updates,
      deletes: this._statistics.deletes,
      queries: this._statistics.queries,
      lastOperation: this._statistics.lastOperation || null,
      timestamp: new Date()
    };
  }

  resetStatistics() {
    this._statistics = {
      creates: 0,
      updates: 0,
      deletes: 0,
      queries: 0,
      lastOperation: null
    };
    return this;
  }

  health() {
    const dbConnected = (typeof WEF !== "undefined" && WEF.Database && typeof WEF.Database.isConnected === "function")
      ? WEF.Database.isConnected()
      : false;

    return {
      entity: this._entityName,
      initialized: this.isInitialized(),
      database: dbConnected,
      schema: this.schema() !== null,
      records: this.count(),
      hooks:{
        beforeCreate:this._hooks.beforeCreate.length,
        afterCreate:this._hooks.afterCreate.length,
        beforeUpdate:this._hooks.beforeUpdate.length,
        afterUpdate:this._hooks.afterUpdate.length,
        beforeDelete:this._hooks.beforeDelete.length,
        afterDelete:this._hooks.afterDelete.length
      },
      statistics: this.statistics()
    };
  }

  info() {
    const fwVersion = (typeof WEF !== "undefined" && WEF.Config && typeof WEF.Config.version === "function")
      ? WEF.Config.version()
      : "1.0.0";

    const env = (typeof WEF !== "undefined" && WEF.Config && typeof WEF.Config.environment === "function")
      ? WEF.Config.environment()
      : "production";

    return {
      service: this.getName(),
      entity: this._entityName,
      version: this.getVersion(),
      frameworkVersion: fwVersion,
      environment: env,
      initialized: this.isInitialized(),
      created: this.getCreatedTime(),
      statistics: this.statistics(),
      health: this.health()
    };
  }

  //=========================================================================
  // Create Engine
  //=========================================================================

  create(data) {
    this.trigger("beforeCreate", data);

    const result = this.database().insert(this._entityName, data);

    this._statistics.creates++;
    this._statistics.lastOperation = new Date();

    this.trigger("afterCreate", result);
    return result;
  }

  //=========================================================================
  // Read Engine
  //=========================================================================

  all() {
    this._statistics.queries++;
    this._statistics.lastOperation = new Date();

    return this.database().readAll(this._entityName);
  }

  find(id) {
    this._statistics.queries++;
    this._statistics.lastOperation = new Date();

    return this.database().findById(this._entityName, id);
  }

  exists(id) {
    return this.database().exists(this._entityName, id);
  }

  count() {
    return this.all().length;
  }

  first() {
    const records = this.all();
    return records.length ? records[0] : null;
  }

  last() {
    const records = this.all();
    return records.length ? records[records.length - 1] : null;
  }

  //=========================================================================
  // Update Engine
  //=========================================================================

  update(id, data) {
    this.trigger("beforeUpdate", data);

    const result = this.database().update(this._entityName, id, data);

    this._statistics.updates++;
    this._statistics.lastOperation = new Date();

    this.trigger("afterUpdate", result);
    return result;
  }

  //=========================================================================
  // Delete Engine
  //=========================================================================

  delete(id) {
    this.trigger("beforeDelete", id);

    const criteria = {};
    criteria[this.key()] = id;

    const result = this.database().delete(this._entityName, criteria);

    if (result) {
      this._statistics.deletes++;
    }

    this._statistics.lastOperation = new Date();

    this.trigger("afterDelete", id);
    return result;
  }

  truncate() {
    return this.database().truncate(this._entityName);
  }

  refresh() {
    return this.database().refresh(this._entityName);
  }

  //=========================================================================
  // Query Engine
  //=========================================================================

  where(criteria) {
    return this.all().filter(record => {
      return Object.keys(criteria).every(key => record[key] === criteria[key]);
    });
  }

  filter(predicate) {
    return this.all().filter(predicate);
  }

  findOne(criteria) {
    const records = this.where(criteria);
    return records.length ? records[0] : null;
  }

  select(fields) {
    return this.all().map(record => {
      const obj = {};
      fields.forEach(field => {
        obj[field] = record[field];
      });
      return obj;
    });
  }

  pluck(field) {
    return this.all().map(record => record[field]);
  }

  distinct(field) {
    return [...new Set(this.pluck(field))];
  }

  //=========================================================================
  // Ordering & Pagination
  //=========================================================================

  orderBy(field, ascending = true) {
    const records = this.all().slice();

    records.sort((a, b) => {
      if (a[field] === b[field]) return 0;
      if (ascending) return a[field] > b[field] ? 1 : -1;
      return a[field] < b[field] ? 1 : -1;
    });

    return records;
  }

  limit(size) {
    return this.all().slice(0, size);
  }

  skip(size) {
    return this.all().slice(size);
  }

  paginate(page, size) {
    page = Math.max(1, page);
    size = Math.max(1, size);

    const records = this.all();
    const start = (page - 1) * size;

    return {
      page: page,
      pageSize: size,
      total: records.length,
      totalPages: Math.ceil(records.length / size),
      data: records.slice(start, start + size)
    };
  }

  //=========================================================================
  // Aggregates
  //=========================================================================

  sum(field) {
    return this.all().reduce((total, row) => total + (Number(row[field]) || 0), 0);
  }

  average(field) {
    const total = this.count();
    if (total === 0) return 0;
    return this.sum(field) / total;
  }

  //=========================================================================
  // Transaction Engine
  //=========================================================================

  begin() {
    this.database().beginBatch();
    return this;
  }

  commit() {
    return this.database().commit();
  }

  rollback() {
    return this.database().rollback();
  }

  //=========================================================================
  // Bulk Engine
  //=========================================================================

  createMany(records) {
    const result = this.database().insertMany(this._entityName, records);

    this._statistics.creates += records.length;
    this._statistics.lastOperation = new Date();

    return result;
  }

  updateMany(records) {
    const result = this.database().updateMany(this._entityName, records);

    this._statistics.updates += records.length;
    this._statistics.lastOperation = new Date();

    return result;
  }

  deleteMany(ids) {
    const criteria = ids.map(id => {
      const item = {};
      item[this.key()] = id;
      return item;
    });

    const deleted = this.database().deleteMany(this._entityName, criteria);

    this._statistics.deletes += deleted;
    this._statistics.lastOperation = new Date();

    return deleted;
  }

  upsert(record) {
    if (this.exists(record[this.key()])) {
      return this.update(record[this.key()], record);
    }
    return this.create(record);
  }

  upsertMany(records) {
    return records.map(record => this.upsert(record));
  }

  //=========================================================================
  // Hook Engine
  //=========================================================================

  on(event, callback) {
    if (!this._hooks[event]) {
      this._hooks[event] = [];
    }

    this._hooks[event].push(callback);
    return this;
  }

  trigger(event, payload) {
    if (!this._hooks[event]) return payload;

    this._hooks[event].forEach(callback => {
      callback(payload);
    });

    return payload;
  }
}

/**
 * =============================================================================
 * Boot & Safe Service Registration
 * =============================================================================
 */

function bootRepositoryService() {
  if (typeof WEF === "undefined") return;

  if (!WEF.Repository) {
    WEF.Repository = new RepositoryService();
  }

  if (WEF.ServiceRegistry && typeof WEF.ServiceRegistry.has === "function") {
    if (!WEF.ServiceRegistry.has("Repository")) {
      WEF.ServiceRegistry.register("Repository", WEF.Repository);
    }
  }

  if (WEF.ServiceContainer && typeof WEF.ServiceContainer.registerModuleService === "function") {
    WEF.ServiceContainer.registerModuleService("Core", "Repository", WEF.Repository);
  }
}

bootRepositoryService();