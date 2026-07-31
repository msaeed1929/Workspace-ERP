/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 45_ERP_TransactionManager.gs
 * Version     : 1.0.0
 * Description : ERP Transaction Manager
 * =============================================================================
 */

'use strict';

class ERPTransactionManager extends BaseService {

  constructor() {

    super("ERPTransactionManager");

    this.initialize();

  }

  initialize() {

    super.initialize();

    this._transactions = {};
    this._history = [];

    return this;

  }

  //=========================================================================
  // Transactions
  //=========================================================================

  begin(id, data) {

    this._transactions[id] = {

      id : id,
      status : "Active",
      started : new Date(),
      data : data || {}

    };

    return this._transactions[id];

  }

  exists(id) {

    return !!this._transactions[id];

  }

  get(id) {

    return this._transactions[id] || null;

  }

  active() {

    return Object.keys(this._transactions);

  }

  count() {

    return this.active().length;

  }

  //=========================================================================
  // Processing
  //=========================================================================

  commit(id) {

    var transaction = this.get(id);

    if (!transaction)
      return false;

    transaction.status = "Committed";
    transaction.completed = new Date();

    this._history.push(transaction);

    delete this._transactions[id];

    return true;

  }

  rollback(id) {

    var transaction = this.get(id);

    if (!transaction)
      return false;

    transaction.status = "Rolled Back";
    transaction.completed = new Date();

    this._history.push(transaction);

    delete this._transactions[id];

    return true;

  }

  history() {

    return this._history;

  }

  historyCount() {

    return this._history.length;

  }

  //=========================================================================
  // Maintenance
  //=========================================================================

  clear() {

    this._transactions = {};

    return true;

  }

  clearHistory() {

    this._history = [];

    return true;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      active : this.count(),
      history : this.historyCount()

    };

  }

  health() {

    return {

      initialized : this.isInitialized(),
      healthy : true,
      active : this.count(),
      history : this.historyCount()

    };

  }

  report() {

    return {

      active : this.active(),
      history : this.history(),
      statistics : this.statistics(),
      health : this.health()

    };

  }

  info() {

    return {

      service : this.getName(),
      version : this.getVersion(),
      initialized : this.isInitialized(),
      created : this.getCreatedTime(),
      statistics : this.statistics()

    };

  }

}
