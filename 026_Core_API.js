/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 26_Core_API.gs
 * Version     : 1.0.0
 * Description : API Gateway
 * =============================================================================
 */

'use strict';

class APIService extends BaseService {

  constructor() {

    super("API");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this.reset();

    return this;

  }

  reset() {

    this._routes = {};

    this._middlewares = [];

    this._statistics = {

      routes : 0,

      requests : 0,

      successes : 0,

      failures : 0,

      middlewares : 0

    };

    return this;

  }

  //=========================================================================
  // Route Registration
  //=========================================================================

  register(method, path, callback) {

    method = String(method).toUpperCase();

    if (typeof callback !== "function")
      throw new Error(
        "API callback must be a function."
      );

    if (!this._routes[method])
      this._routes[method] = {};

    this._routes[method][path] = callback;

    this._statistics.routes++;

    return this;

  }

  get(path, callback) {

    return this.register(
      "GET",
      path,
      callback
    );

  }

  post(path, callback) {

    return this.register(
      "POST",
      path,
      callback
    );

  }

  put(path, callback) {

    return this.register(
      "PUT",
      path,
      callback
    );

  }

  remove(path, callback) {

    return this.register(
      "DELETE",
      path,
      callback
    );

  }

  //=========================================================================
  // Lookup
  //=========================================================================

  exists(method, path) {

    method = String(method).toUpperCase();

    return !!(

      this._routes[method] &&
      this._routes[method][path]

    );

  }

  resolve(method, path) {

    method = String(method).toUpperCase();

    if (!this.exists(method, path))
      return null;

    return this._routes[method][path];

  }

  routes(method) {

    if (!method)
      return this._routes;

    method = String(method).toUpperCase();

    return Object.keys(

      this._routes[method] || {}

    );

  }

  routeCount() {

    let count = 0;

    Object.keys(this._routes).forEach(

      method => {

        count += Object.keys(

          this._routes[method]

        ).length;

      }

    );

    return count;

  }

  //=========================================================================
  // Middleware
  //=========================================================================

  middleware(callback) {

    if (typeof callback !== "function")
      throw new Error(
        "Middleware must be a function."
      );

    this._middlewares.push(callback);

    this._statistics.middlewares++;

    return this;

  }

  middlewares() {

    return this._middlewares.slice();

  }

  middlewareCount() {

    return this._middlewares.length;

  }

    //=========================================================================
  // Execute
  //=========================================================================

  execute(method, path, request) {

    method = String(method).toUpperCase();

    request = request || {};

    this._statistics.requests++;

    try {

      this._middlewares.forEach(function(middleware){

        middleware(request);

      });

      const callback =
        this.resolve(method, path);

      if (!callback)
        throw new Error(
          "Route not found."
        );

      const result =
        callback(request);

      this._statistics.successes++;

      return {

        success : true,

        method : method,

        path : path,

        data : result

      };

    }

    catch(error){

      this._statistics.failures++;

      return {

        success : false,

        method : method,

        path : path,

        error : error.message

      };

    }

  }

  //=========================================================================
  // Handle Apps Script Event
  //=========================================================================

  handle(e) {

    e = e || {};

    const method =
      e.method ||
      "GET";

    const path =
      e.path ||
      "/";

    return this.execute(

      method,

      path,

      e

    );

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      routes : this.routeCount(),

      requests : this._statistics.requests,

      successes : this._statistics.successes,

      failures : this._statistics.failures,

      middlewares : this.middlewareCount()

    };

  }

  health() {

    return {

      initialized : this.isInitialized(),

      healthy : true,

      routes : this.routeCount(),

      middlewares : this.middlewareCount()

    };

  }

  report() {

    return {

      routes : this.routes(),

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

WEF.API = new APIService();