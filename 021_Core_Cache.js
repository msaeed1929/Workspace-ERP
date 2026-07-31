/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 21_Core_Cache.gs
 * Version     : 1.0.0
 * Description : Enterprise Cache Service
 * =============================================================================
 */

'use strict';

class CacheService extends BaseService {

  constructor() {

    super("Cache");

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

    this._items = {};

    this._tags = {};

    this._statistics = {

      hits: 0,

      misses: 0,

      puts: 0,

      removes: 0,

      expired: 0,

      flushes: 0

    };

    return this;

  }

  //=========================================================================
  // Put
  //=========================================================================

  put(key, value, ttl) {

    ttl = ttl || 0;

    this._items[key] = {

      value: value,

      created: Date.now(),

      expires:
        ttl > 0
          ? Date.now() + (ttl * 1000)
          : null

    };

    this._statistics.puts++;

    return this;

  }

  set(key, value, ttl) {

    return this.put(key, value, ttl);

  }

  remember(key, value, ttl) {

    if (!this.has(key)) {

      this.put(key, value, ttl);

    }

    return this.get(key);

  }

  //=========================================================================
  // Get
  //=========================================================================

  get(key, defaultValue) {

    if (!this.has(key)) {

      this._statistics.misses++;

      return defaultValue;

    }

    const item = this._items[key];

    if (

      item.expires !== null &&

      Date.now() > item.expires

    ) {

      delete this._items[key];

      this._statistics.expired++;

      this._statistics.misses++;

      return defaultValue;

    }

    this._statistics.hits++;

    return item.value;

  }

  //=========================================================================
  // Exists
  //=========================================================================

  has(key) {

    return this._items.hasOwnProperty(key);

  }

  exists(key) {

    return this.has(key);

  }

  missing(key) {

    return !this.has(key);

  }

  //=========================================================================
  // Remove
  //=========================================================================

  forget(key) {

    if (this.has(key)) {

      delete this._items[key];

      this._statistics.removes++;

    }

    return this;

  }

  remove(key) {

    return this.forget(key);

  }

  delete(key) {

    return this.forget(key);

  }

  //=========================================================================
  // Cache Keys
  //=========================================================================

  keys() {

    return Object.keys(this._items);

  }

  values() {

    return this.keys().map(key =>

      this.get(key)

    );

  }

  entries() {

    return this.keys().map(key => ({

      key: key,

      value: this.get(key)

    }));

  }

  count() {

    return this.keys().length;

  }

  isEmpty() {

    return this.count() === 0;

  }

    //=========================================================================
  // Flush
  //=========================================================================

  flush() {

    this._items = {};

    this._tags = {};

    this._statistics.flushes++;

    return this;

  }

  clear() {

    return this.flush();

  }

  //=========================================================================
  // Increment / Decrement
  //=========================================================================

  increment(key, amount) {

    amount = amount || 1;

    let value = this.get(key, 0);

    value += amount;

    this.put(key, value);

    return value;

  }

  decrement(key, amount) {

    amount = amount || 1;

    let value = this.get(key, 0);

    value -= amount;

    this.put(key, value);

    return value;

  }

  //=========================================================================
  // Replace
  //=========================================================================

  replace(key, value, ttl) {

    if (!this.has(key))
      return false;

    this.put(key, value, ttl);

    return true;

  }

  //=========================================================================
  // Pull
  //=========================================================================

  pull(key, defaultValue) {

    const value = this.get(key, defaultValue);

    this.forget(key);

    return value;

  }

  //=========================================================================
  // Forever
  //=========================================================================

  forever(key, value) {

    return this.put(key, value, 0);

  }

  rememberForever(key, value) {

    return this.remember(key, value, 0);

  }

  //=========================================================================
  // Touch
  //=========================================================================

  touch(key, ttl) {

    if (!this.has(key))
      return false;

    ttl = ttl || 0;

    this._items[key].expires =

      ttl > 0
        ? Date.now() + (ttl * 1000)
        : null;

    return true;

  }

  //=========================================================================
  // Bulk Operations
  //=========================================================================

  putMany(object, ttl) {

    Object.keys(object).forEach(key => {

      this.put(

        key,

        object[key],

        ttl

      );

    });

    return this;

  }

  getMany(keys) {

    const result = {};

    keys.forEach(key => {

      result[key] = this.get(key);

    });

    return result;

  }

  forgetMany(keys) {

    keys.forEach(key => {

      this.forget(key);

    });

    return this;

  }

  //=========================================================================
  // Tags
  //=========================================================================

  tag(key, tag) {

    if (!this._tags[tag])

      this._tags[tag] = [];

    if (

      this._tags[tag].indexOf(key) === -1

    ) {

      this._tags[tag].push(key);

    }

    return this;

  }

  tagged(tag) {

    if (!this._tags[tag])

      return {};

    const result = {};

    this._tags[tag].forEach(key => {

      result[key] = this.get(key);

    });

    return result;

  }

  flushTag(tag) {

    if (!this._tags[tag])

      return this;

    this._tags[tag].forEach(key => {

      this.forget(key);

    });

    delete this._tags[tag];

    return this;

  }

  tags() {

    return Object.keys(this._tags);

  }

  //=========================================================================
  // Cleanup
  //=========================================================================

  cleanup() {

    const now = Date.now();

    Object.keys(this._items).forEach(key => {

      const item = this._items[key];

      if (

        item.expires !== null &&

        now > item.expires

      ) {

        delete this._items[key];

        this._statistics.expired++;

      }

    });

    return this;

  }

    //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      hits: this._statistics.hits,

      misses: this._statistics.misses,

      puts: this._statistics.puts,

      removes: this._statistics.removes,

      expired: this._statistics.expired,

      flushes: this._statistics.flushes,

      items: this.count()

    };

  }

  //=========================================================================
  // Health
  //=========================================================================

  health() {

    return {

      initialized: this.isInitialized(),

      items: this.count(),

      tags: this.tags().length,

      empty: this.isEmpty()

    };

  }

  //=========================================================================
  // Report
  //=========================================================================

  report() {

    return {

      statistics: this.statistics(),

      health: this.health(),

      keys: this.keys(),

      tags: this.tags()

    };

  }

  //=========================================================================
  // Information
  //=========================================================================

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

WEF.Cache = new CacheService();