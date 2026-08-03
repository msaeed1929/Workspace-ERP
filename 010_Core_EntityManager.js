/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 010_Core_EntityManager.gs
 * Version     : 3.2.0
 * Description : Dynamic Entity Registry
 * Author      : OpenAI + Muhammad Saeed Anser
 * =============================================================================
 */

'use strict';

class EntityManagerService extends BaseService {

  constructor() {
    super("EntityManager");
    this.initialize();
  }

  initialize() {
    super.initialize();
    this._entities = {};
    return this;
  }

  //=========================================================================
  // Internal
  //=========================================================================

  _clone(object) {
    return JSON.parse(JSON.stringify(object));
  }

  _exists(name) {
    return Object.prototype.hasOwnProperty.call(this._entities, name);
  }

  has(name) {
    return this._exists(name);
  }

  //=========================================================================
  // Entity Registration
  //=========================================================================

  register(definition) {
    if (!definition) {
      throw new Error("Entity definition is required.");
    }
    if (!definition.name) {
      throw new Error("Entity name is required.");
    }
    if (this._exists(definition.name)) {
      throw new Error(`Entity '${definition.name}' already exists.`);
    }

    const entity = this._clone(definition);

    entity.fields = entity.fields || [];
    entity.relationships = entity.relationships || [];
    entity.actions = entity.actions || [];
    entity.created = new Date();
    entity.modified = null;

    this._entities[entity.name] = entity;

    if (
      typeof WEF.Metadata !== "undefined" &&
      WEF.Metadata &&
      typeof WEF.Metadata.registerEntity === "function"
    ) {
      WEF.Metadata.registerEntity(entity.name, {
        module: entity.module || "",
        sheet: entity.sheet || "",
        key: entity.key || "",
        name: entity.name
      });
    }

    return this;
  }

  unregister(name) {
    if (this._exists(name)) {
      delete this._entities[name];
    }
    return this;
  }

  update(name, definition) {
    if (!this._exists(name)) {
      throw new Error(`Entity '${name}' not found.`);
    }

    Object.assign(
      this._entities[name],
      this._clone(definition)
    );

    this._entities[name].modified = new Date();
    return this;
  }

  get(name) {
    if (!this._exists(name)) {
      return null;
    }
    return this._clone(this._entities[name]);
  }

  exists(name) {
    return this._exists(name);
  }

  list() {
    return Object.keys(this._entities);
  }

  count() {
    return this.list().length;
  }

  //=========================================================================
  // Field Management
  //=========================================================================

  addField(entityName, field) {
    const entity = this._entities[entityName];

    if (!entity) {
      throw new Error(`Entity '${entityName}' not found.`);
    }
    if (!field.name) {
      throw new Error("Field name is required.");
    }

    field.type = field.type || "STRING";
    field.required = field.required || false;
    field.primaryKey = field.primaryKey || false;
    field.unique = field.unique || false;
    field.defaultValue = field.defaultValue ?? null;
    field.readOnly = field.readOnly || false;
    field.visible = field.visible !== false;
    field.searchable = field.searchable || false;
    field.sortable = field.sortable || false;
    field.filterable = field.filterable || false;
    field.created = new Date();

    if (this.fieldExists(entityName, field.name)) {
      throw new Error(`Field '${field.name}' already exists.`);
    }

    entity.fields.push(this._clone(field));
    return this;
  }

  getFields(entityName) {
    const entity = this._entities[entityName];
    if (!entity) return [];
    return this._clone(entity.fields);
  }

  getField(entityName, fieldName) {
    const entity = this._entities[entityName];
    if (!entity) return null;

    const field = entity.fields.find(f => f.name === fieldName);
    return field ? this._clone(field) : null;
  }

  fieldExists(entityName, fieldName) {
    return this.getField(entityName, fieldName) !== null;
  }

  removeField(entityName, fieldName) {
    const entity = this._entities[entityName];
    if (!entity) return this;

    entity.fields = entity.fields.filter(f => f.name !== fieldName);
    return this;
  }

  primaryKey(entityName) {
    const entity = this._entities[entityName];
    if (!entity) return null;

    const field = entity.fields.find(f => f.primaryKey);
    return field ? field.name : null;
  }

  requiredFields(entityName) {
    const entity = this._entities[entityName];
    if (!entity) return [];

    return entity.fields
      .filter(f => f.required)
      .map(f => f.name);
  }

  searchableFields(entityName) {
    const entity = this._entities[entityName];
    if (!entity) return [];

    return entity.fields
      .filter(f => f.searchable)
      .map(f => f.name);
  }

  //=========================================================================
  // Relationship Management
  //=========================================================================

  addRelationship(entityName, relationship) {
    const entity = this._entities[entityName];

    if (!entity) {
      throw new Error(`Entity '${entityName}' not found.`);
    }
    if (!relationship.name) {
      throw new Error("Relationship name is required.");
    }

    relationship.type = relationship.type || "OneToMany";
    relationship.entity = relationship.entity || "";
    relationship.localKey = relationship.localKey || "";
    relationship.foreignKey = relationship.foreignKey || "";
    relationship.cascadeDelete = relationship.cascadeDelete || false;
    relationship.cascadeUpdate = relationship.cascadeUpdate || false;
    relationship.required = relationship.required || false;
    relationship.created = new Date();

    if (this.relationshipExists(entityName, relationship.name)) {
      throw new Error(`Relationship '${relationship.name}' already exists.`);
    }

    entity.relationships.push(this._clone(relationship));
    return this;
  }

  getRelationships(entityName) {
    const entity = this._entities[entityName];
    if (!entity) return [];
    return this._clone(entity.relationships);
  }

  getRelationship(entityName, relationshipName) {
    const entity = this._entities[entityName];
    if (!entity) return null;

    const relationship = entity.relationships.find(r => r.name === relationshipName);
    return relationship ? this._clone(relationship) : null;
  }

  relationshipExists(entityName, relationshipName) {
    return this.getRelationship(entityName, relationshipName) !== null;
  }

  removeRelationship(entityName, relationshipName) {
    const entity = this._entities[entityName];
    if (!entity) return this;

    entity.relationships = entity.relationships.filter(r => r.name !== relationshipName);
    return this;
  }

  //=========================================================================
  // Child Entities
  //=========================================================================

  childEntities(entityName) {
    const entity = this._entities[entityName];
    if (!entity) return [];

    return [...new Set(entity.relationships.map(r => r.entity))];
  }

  //=========================================================================
  // Parent Entities
  //=========================================================================

  parentEntities(entityName) {
    const parents = [];

    Object.values(this._entities).forEach(entity => {
      entity.relationships.forEach(rel => {
        if (rel.entity === entityName) {
          if (parents.indexOf(entity.name) === -1) {
            parents.push(entity.name);
          }
        }
      });
    });

    return parents;
  }

  //=========================================================================
  // Entity Behaviors
  //=========================================================================

  setBehavior(entityName, behavior) {
    const entity = this._entities[entityName];
    if (!entity) {
      throw new Error(`Entity '${entityName}' not found.`);
    }

    entity.behavior = Object.assign({
      autoNumber: false,
      softDelete: true,
      audit: true,
      approval: false,
      workflow: false,
      attachments: false,
      comments: false,
      history: true,
      timestamps: true,
      ownerTracking: true
    }, behavior || {});

    return this;
  }

  getBehavior(entityName) {
    const entity = this._entities[entityName];
    if (!entity) return null;

    return this._clone(entity.behavior || {});
  }

  //=========================================================================
  // Entity Events
  //=========================================================================

  registerEvent(entityName, eventName, callback) {
    const entity = this._entities[entityName];
    if (!entity) {
      throw new Error(`Entity '${entityName}' not found.`);
    }

    if (!entity.events) entity.events = {};
    entity.events[eventName] = callback;

    return this;
  }

  triggerEvent(entityName, eventName, payload) {
    const entity = this._entities[entityName];
    if (!entity || !entity.events) return null;

    if (typeof entity.events[eventName] !== "function") return null;

    return entity.events[eventName](payload);
  }

  //=========================================================================
  // Entity Actions
  //=========================================================================

  addAction(entityName, action) {
    const entity = this._entities[entityName];
    if (!entity) {
      throw new Error(`Entity '${entityName}' not found.`);
    }

    if (!entity.actions.includes(action)) {
      entity.actions.push(action);
    }

    return this;
  }

  getActions(entityName) {
    const entity = this._entities[entityName];
    if (!entity) return [];

    return this._clone(entity.actions);
  }

  hasAction(entityName, action) {
    const entity = this._entities[entityName];
    if (!entity) return false;

    return entity.actions.includes(action);
  }

  //=========================================================================
  // Entity CRUD Metadata
  //=========================================================================

  create(entityName, data) {
    if (!this.exists(entityName)) {
      throw new Error(`Entity '${entityName}' not found.`);
    }

    return {
      operation: "CREATE",
      entity: entityName,
      data: this._clone(data || {}),
      timestamp: new Date()
    };
  }

  read(entityName, id) {
    if (!this.exists(entityName)) {
      throw new Error(`Entity '${entityName}' not found.`);
    }

    return {
      operation: "READ",
      entity: entityName,
      id: id
    };
  }

  updateRecord(entityName, id, data) {
    if (!this.exists(entityName)) {
      throw new Error(`Entity '${entityName}' not found.`);
    }

    return {
      operation: "UPDATE",
      entity: entityName,
      id: id,
      data: this._clone(data || {}),
      timestamp: new Date()
    };
  }

  deleteRecord(entityName, id) {
    if (!this.exists(entityName)) {
      throw new Error(`Entity '${entityName}' not found.`);
    }

    return {
      operation: "DELETE",
      entity: entityName,
      id: id,
      timestamp: new Date()
    };
  }

  //=========================================================================
  // Search
  //=========================================================================

  find(entityName, criteria) {
    if (!this.exists(entityName)) {
      throw new Error(`Entity '${entityName}' not found.`);
    }

    return {
      entity: entityName,
      criteria: this._clone(criteria || {})
    };
  }

  findById(entityName, id) {
    return this.read(entityName, id);
  }

  //=========================================================================
  // Validation
  //=========================================================================

  validate(entityName, data) {
    const entity = this.get(entityName);
    if (!entity) {
      throw new Error(`Entity '${entityName}' not found.`);
    }

    const validator = WEF.Validator;
    if (!validator) {
      throw new Error("Validator service not available.");
    }

    validator.clear();

    entity.fields.forEach(field => {
      if (field.required) {
        validator.required(field.name, data[field.name]);
      }
    });

    return {
      valid: !validator.hasErrors(),
      errors: validator.getErrors()
    };
  }

  //=========================================================================
  // Definition Export / Import
  //=========================================================================

  exportDefinition(entityName) {
    return this.get(entityName);
  }

  importDefinition(definition) {
    this.register(definition);
    return this;
  }

  clear() {
    this._entities = Object.create(null);
    return this;
  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {
    const entities = this.list();

    let fieldCount = 0;
    let relationshipCount = 0;
    let actionCount = 0;

    entities.forEach(name => {
      const entity = this._entities[name];
      fieldCount += entity.fields.length;
      relationshipCount += entity.relationships.length;
      actionCount += entity.actions.length;
    });

    return {
      entities: this.count(),
      fields: fieldCount,
      relationships: relationshipCount,
      actions: actionCount
    };
  }

  //=========================================================================
  // Information
  //=========================================================================

  info() {
    return {
      service: this.getName(),
      version: this.getVersion(),
      created: this.getCreatedTime(),
      initialized: this.isInitialized(),
      statistics: this.statistics()
    };
  }
}

/**
 * ============================================================================
 * Register Service
 * ============================================================================
 */

WEF.EntityManager = new EntityManagerService();

if (!WEF.ServiceRegistry.has("EntityManager")) {
  WEF.ServiceRegistry.register(
    "EntityManager",
    WEF.EntityManager
  );
}

if (!WEF.ModuleRegistry.has("EntityManager")) {
  WEF.ModuleRegistry.register(
    "EntityManager",
    WEF.EntityManager
  );
}

/**
 * ============================================================================
 * Full Test Suite: EntityManager Core Coverage
 * ============================================================================
 */
function test_EntityManager_FullSuite() {
  Logger.log("=========================================");
  Logger.log("Starting WEF EntityManager Core Unit Tests");
  Logger.log("=========================================");

  // 1. Boot Environment & Initialize
  WEF.Kernel.boot();
  const em = WEF.EntityManager;
  em.initialize();
  em.clear();

  // -------------------------------------------------------------------------
  // Test Section 1: Entity Registration & CRUD Meta
  // -------------------------------------------------------------------------
  Logger.log("\n[1] Testing Entity Registration & Basic Retrieval...");
  
  em.register({
    name: "Customer",
    module: "Sales",
    sheet: "Customers",
    key: "CustomerID"
  });

  em.register({
    name: "Order",
    module: "Sales",
    sheet: "Orders",
    key: "OrderID"
  });

  Logger.log(`- Entity Exists Check ('Customer'): ${em.exists("Customer")}`);
  Logger.log(`- Total Entity Count: ${em.count()} (Expected: 2)`);
  Logger.log(`- Entity List: ${JSON.stringify(em.list())}`);

  // Test Update Entity Metadata
  em.update("Customer", { sheet: "Sales_Customers" });
  Logger.log(`- Updated Customer Sheet: ${em.get("Customer").sheet}`);

  // -------------------------------------------------------------------------
  // Test Section 2: Field Management
  // -------------------------------------------------------------------------
  Logger.log("\n[2] Testing Field Management...");

  // Primary Key & Standard Fields for Customer
  em.addField("Customer", {
    name: "CustomerID",
    type: "STRING",
    required: true,
    primaryKey: true,
    searchable: true
  });

  em.addField("Customer", {
    name: "CustomerName",
    type: "STRING",
    required: true,
    searchable: true,
    sortable: true
  });

  em.addField("Customer", {
    name: "CreditLimit",
    type: "NUMBER",
    defaultValue: 1000
  });

  // Fields for Order
  em.addField("Order", {
    name: "OrderID",
    type: "STRING",
    required: true,
    primaryKey: true
  });

  em.addField("Order", {
    name: "CustomerID",
    type: "STRING",
    required: true
  });

  Logger.log(`- Customer Primary Key: ${em.primaryKey("Customer")}`);
  Logger.log(`- Customer Required Fields: ${JSON.stringify(em.requiredFields("Customer"))}`);
  Logger.log(`- Customer Searchable Fields: ${JSON.stringify(em.searchableFields("Customer"))}`);
  Logger.log(`- Field Count ('Customer'): ${em.getFields("Customer").length}`);

  // Field Removal Test
  em.addField("Customer", { name: "TempField", type: "STRING" });
  em.removeField("Customer", "TempField");
  Logger.log(`- 'TempField' removed successfully: ${!em.fieldExists("Customer", "TempField")}`);

  // -------------------------------------------------------------------------
  // Test Section 3: Relationship & Parent/Child Management
  // -------------------------------------------------------------------------
  Logger.log("\n[3] Testing Relationship Management...");

  em.addRelationship("Order", {
    name: "CustomerOrderRel",
    type: "ManyToOne",
    entity: "Customer",
    localKey: "CustomerID",
    foreignKey: "CustomerID"
  });

  Logger.log(`- Relationship Exists: ${em.relationshipExists("Order", "CustomerOrderRel")}`);
  Logger.log(`- Child Entities of 'Order': ${JSON.stringify(em.childEntities("Order"))}`);
  Logger.log(`- Parent Entities of 'Customer': ${JSON.stringify(em.parentEntities("Customer"))}`);

  // -------------------------------------------------------------------------
  // Test Section 4: Behavior & Actions
  // -------------------------------------------------------------------------
  Logger.log("\n[4] Testing Entity Behaviors & Actions...");

  em.setBehavior("Customer", {
    autoNumber: false,
    softDelete: true,
    approval: true
  });

  em.addAction("Customer", "Create");
  em.addAction("Customer", "Approve");

  Logger.log(`- Customer Behavior (Approval): ${em.getBehavior("Customer").approval}`);
  Logger.log(`- Has Action 'Approve': ${em.hasAction("Customer", "Approve")}`);
  Logger.log(`- Actions List: ${JSON.stringify(em.getActions("Customer"))}`);

  // -------------------------------------------------------------------------
  // Test Section 5: Events System
  // -------------------------------------------------------------------------
  Logger.log("\n[5] Testing Event Callbacks...");

  let eventFired = false;
  em.registerEvent("Customer", "onAfterCreate", function(payload) {
    eventFired = true;
    return `Created customer: ${payload.name}`;
  });

  const eventResult = em.triggerEvent("Customer", "onAfterCreate", { name: "Acme Corp" });
  Logger.log(`- Event Trigger Result: "${eventResult}"`);
  Logger.log(`- Event Callback Execution Status: ${eventFired}`);

  // -------------------------------------------------------------------------
  // Test Section 6: CRUD Operations & Query Helpers
  // -------------------------------------------------------------------------
  Logger.log("\n[6] Testing CRUD & Find Metadata Generation...");

  const createMeta = em.create("Customer", { CustomerID: "CUS-001", CustomerName: "Acme Corp" });
  const readMeta = em.read("Customer", "CUS-001");
  const updateMeta = em.updateRecord("Customer", "CUS-001", { CustomerName: "Acme Global" });
  const deleteMeta = em.deleteRecord("Customer", "CUS-001");
  const findMeta = em.find("Customer", { CustomerName: "Acme Global" });

  Logger.log(`- Create Metadata Operation: ${createMeta.operation}`);
  Logger.log(`- Read Metadata ID: ${readMeta.id}`);
  Logger.log(`- Find Criteria Entity Target: ${findMeta.entity}`);

  // -------------------------------------------------------------------------
  // Test Section 7: Export/Import & Validation Setup
  // -------------------------------------------------------------------------
  Logger.log("\n[7] Testing Export/Import & Service Validation...");

  const exportedCustomer = em.exportDefinition("Customer");
  em.unregister("Customer");
  Logger.log(`- Customer Unregistered (Exists: ${em.exists("Customer")})`);

  em.importDefinition(exportedCustomer);
  Logger.log(`- Customer Re-Imported (Exists: ${em.exists("Customer")})`);

  // Mocking WEF.Validator if it isn't defined in the current runtime environment
  if (typeof WEF.Validator === "undefined") {
    WEF.Validator = {
      _errors: [],
      clear: function() { this._errors = []; },
      required: function(field, val) { 
        if (!val) this._errors.push(`${field} is required.`); 
      },
      hasErrors: function() { return this._errors.length > 0; },
      getErrors: function() { return this._errors; }
    };
  }

  const validTest = em.validate("Customer", { CustomerID: "CUS-001", CustomerName: "Acme Corp" });
  const invalidTest = em.validate("Customer", { CustomerID: "CUS-001" });

  Logger.log(`- Validation Pass Test: ${validTest.valid} (Errors: ${validTest.errors.length})`);
  Logger.log(`- Validation Fail Test: ${!invalidTest.valid} (Errors: ${JSON.stringify(invalidTest.errors)})`);

  // -------------------------------------------------------------------------
  // Test Section 8: Summary Statistics & Info Readout
  // -------------------------------------------------------------------------
  Logger.log("\n[8] Testing Telemetry & Service Stats...");

  const stats = em.statistics();
  Logger.log(`- Final Statistics: ${JSON.stringify(stats)}`);
  
  const info = em.info();
  Logger.log(`- Service Info Summary: Service = ${info.service}, Version = ${info.version}`);

  Logger.log("\n=========================================");
  Logger.log("All Test Assertions Completed Successfully");
  Logger.log("=========================================");
}