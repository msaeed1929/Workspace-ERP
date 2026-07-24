/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 19_Core_Transaction.gs
 * Version     : 1.0.0
 * Description : Transaction Manager
 * =============================================================================
 */

'use strict';

class TransactionService extends BaseService {

  constructor() {

    super("Transaction");

    this.initialize();

  }

  initialize() {

    super.initialize();

    this.reset();

    return this;

  }

  //=========================================================================
  // Reset
  //=========================================================================

  reset() {

    this._active = false;

    this._rollbackOnly = false;

    this._level = 0;

    this._operations = [];

    this._rollbackStack = [];

    this._savepoints = {};

    this._context = {};

    this._statistics = {

      transactions:0,

      commits:0,

      rollbacks:0,

      operations:0,

      savepoints:0,

      failures:0

    };

    return this;

  }

  //=========================================================================
  // State
  //=========================================================================

  isActive() {

    return this._active;

  }

  isRunning() {

    return this._active;

  }

  level() {

    return this._level;

  }

  context() {

    return this._context;

  }

  isRollbackOnly() {

    return this._rollbackOnly;

  }

  rollbackOnly() {

    this._rollbackOnly = true;

    return this;

  }

  //=========================================================================
  // Transaction Lifecycle
  //=========================================================================

  begin(context) {

    if (this._active)
      throw new Error(
        "Transaction already active."
      );

    this._active = true;

    this._rollbackOnly = false;

    this._level = 1;

    this._operations = [];

    this._rollbackStack = [];

    this._savepoints = {};

    this._context = context || {};

    this._statistics.transactions++;

    return this;

  }

  commit() {

    if (!this._active)
      throw new Error(
        "No active transaction."
      );

    if (this._rollbackOnly)
      return this.rollback();

    this._statistics.commits++;

    this._active = false;

    this._rollbackOnly = false;

    this._level = 0;

    this.clearOperations();

    this._savepoints = {};

    return true;

  }

  rollback() {

    if (!this._active)
      throw new Error(
        "No active transaction."
      );

    while (this._rollbackStack.length) {

      const undo = this._rollbackStack.pop();

      if (typeof undo === "function") {

        try {

          undo();

        }

        catch (error) {

          Logger.log(error);

        }

      }

    }

    this._statistics.rollbacks++;

    this._active = false;

    this._rollbackOnly = false;

    this._level = 0;

    this.clearOperations();

    this._savepoints = {};

    return true;

  }

  //=========================================================================
  // Operation Recording
  //=========================================================================

  record(operation, rollback) {

    if (!this._active)
      throw new Error(
        "No active transaction."
      );

    this._operations.push(operation);

    if (typeof rollback === "function") {

      this._rollbackStack.push(rollback);

    }

    this._statistics.operations++;

    return this;

  }

  operations() {

    return this._operations.slice();

  }

  operationCount() {

    return this._operations.length;

  }

  clearOperations() {

    this._operations = [];

    this._rollbackStack = [];

    return this;

  }

    //=========================================================================
  // Savepoints
  //=========================================================================

  savepoint(name) {

    if (!this._active)
      throw new Error(
        "No active transaction."
      );

    this._savepoints[name] = {

      operations: this._operations.slice(),

      rollbackStack: this._rollbackStack.slice(),

      timestamp: new Date()

    };

    this._statistics.savepoints++;

    return this;

  }

  restore(name) {

    if (!this._savepoints[name])
      throw new Error(
        "Savepoint '" + name + "' not found."
      );

    this._operations =
      this._savepoints[name].operations.slice();

    this._rollbackStack =
      this._savepoints[name].rollbackStack.slice();

    return this;

  }

  rollbackTo(name) {

    return this.restore(name);

  }

  release(name) {

    delete this._savepoints[name];

    return this;

  }

  savepoints() {

    return Object.keys(this._savepoints);

  }

  hasSavepoint(name) {

    return this._savepoints.hasOwnProperty(name);

  }

  //=========================================================================
  // Execute Operations
  //=========================================================================

  execute() {

    if (!this._active)
      throw new Error(
        "No active transaction."
      );

    this._operations.forEach(function (operation) {

      if (typeof operation === "function") {

        operation();

      }

    });

    return this;

  }

  //=========================================================================
  // Execute Callback
  //=========================================================================

  run(callback) {

    this.begin();

    try {

      const result = callback(this);

      this.commit();

      return result;

    }

    catch (error) {

      this._statistics.failures++;

      this.rollback();

      throw error;

    }

  }

  //=========================================================================
  // Retry
  //=========================================================================

  retry(callback, attempts) {

    attempts = attempts || 3;

    let current = 0;

    while (current < attempts) {

      try {

        return this.run(callback);

      }

      catch (error) {

        current++;

        if (current >= attempts)
          throw error;

      }

    }

  }

  //=========================================================================
  // Execute Multiple Operations
  //=========================================================================

  batch(callbacks) {

    this.begin();

    try {

      callbacks.forEach(function (callback) {

        callback();

      });

      this.commit();

    }

    catch (error) {

      this.rollback();

      throw error;

    }

    return true;

  }

  //=========================================================================
  // Convenience Helper
  //=========================================================================

  transaction(callback) {

    return this.run(callback);

  }

    //=========================================================================
  // Commit / Rollback
  //=========================================================================

  commit() {

    if (!this._active)
      throw new Error("No active transaction.");

    if (this._rollbackOnly)
      return this.rollback();

    this._statistics.commits++;

    this._active = false;
    this._rollbackOnly = false;
    this._level = 0;

    this.clearOperations();

    return true;

  }

  rollback() {

    if (!this._active)
      throw new Error("No active transaction.");

    for (let i = this._rollbackStack.length - 1; i >= 0; i--) {

      let undo = this._rollbackStack[i];

      if (typeof undo === "function")
        undo();

    }

    this._statistics.rollbacks++;

    this._active = false;
    this._rollbackOnly = false;
    this._level = 0;

    this.clearOperations();

    return true;

  }

  rollbackOnly() {

    this._rollbackOnly = true;

    return this;

  }

  isRollbackOnly() {

    return this._rollbackOnly;

  }

  //=========================================================================
  // Savepoints
  //=========================================================================

  savepoint(name) {

    this._savepoints[name] = {

      operations: this._operations.slice(),

      rollbackStack: this._rollbackStack.slice()

    };

    this._statistics.savepoints++;

    return this;

  }

  rollbackTo(name) {

    if (!this._savepoints[name])
      throw new Error("Savepoint '" + name + "' not found.");

    this._operations =
      this._savepoints[name].operations.slice();

    this._rollbackStack =
      this._savepoints[name].rollbackStack.slice();

    return this;

  }

  restore(name) {

    return this.rollbackTo(name);

  }

  release(name) {

    delete this._savepoints[name];

    return this;

  }

  savepoints() {

    return Object.keys(this._savepoints);

  }

  //=========================================================================
  // Retry
  //=========================================================================

  retry(callback, attempts) {

    attempts = attempts || 3;

    let lastError;

    while (attempts--) {

      try {

        this.begin();

        let result = callback(this);

        this.commit();

        return result;

      }

      catch (error) {

        lastError = error;

        if (this.isActive())
          this.rollback();

      }

    }

    throw lastError;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics(){

    return {

      active:this._active,

      level:this._level,

      transactions:this._statistics.transactions,

      commits:this._statistics.commits,

      rollbacks:this._statistics.rollbacks,

      operations:this._statistics.operations,

      savepoints:this._statistics.savepoints,

      failures:this._statistics.failures

    };

  }

  health() {

    return {

      initialized: this.isInitialized(),

      active: this._active,

      level: this._level,

      operations: this._operations.length,

      savepoints: Object.keys(this._savepoints).length

    };

  }

  report() {

    return {

      statistics: this.statistics(),

      health: this.health(),

      operations: this.operations(),

      savepoints: this.savepoints()

    };

  }

  info() {

    return {

      service: this.getName(),

      version: this.getVersion(),

      initialized: this.isInitialized(),

      created: this.getCreatedTime(),

      statistics: this.statistics()

    };

  }

}

WEF.Transaction = new TransactionService();