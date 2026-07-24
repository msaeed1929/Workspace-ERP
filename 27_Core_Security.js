/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 27_Core_Security.gs
 * Version     : 1.0.0
 * Description : Core Security Service
 * =============================================================================
 */

'use strict';

class SecurityService extends BaseService {

  constructor() {

    super("Security");

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

    this._apiKeys = {};

    this._csrfTokens = {};

    this._statistics = {

      apiKeys : 0,

      csrf : 0,

      hashes : 0,

      signatures : 0,

      validations : 0,

      failures : 0

    };

    return this;

  }

  //=========================================================================
  // Random Token
  //=========================================================================

  token(length) {

    length = length || 32;

    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
      "abcdefghijklmnopqrstuvwxyz" +
      "0123456789";

    let token = "";

    for (let i = 0; i < length; i++) {

      token += chars.charAt(

        Math.floor(

          Math.random() * chars.length

        )

      );

    }

    return token;

  }

  nonce(length) {

    return this.token(length || 16);

  }

  //=========================================================================
  // Hash
  //=========================================================================

  hash(value) {

    const bytes = Utilities.computeDigest(

      Utilities.DigestAlgorithm.SHA_256,

      String(value)

    );

    this._statistics.hashes++;

    return bytes.map(function(b){

      const v = (b < 0 ? b + 256 : b);

      return ("0" + v.toString(16)).slice(-2);

    }).join("");

  }

  verifyHash(value, hash) {

    return this.hash(value) === hash;

  }

  //=========================================================================
  // HMAC Signature
  //=========================================================================

  sign(value, secret) {

    const bytes = Utilities.computeHmacSha256Signature(

      String(value),

      String(secret)

    );

    this._statistics.signatures++;

    return bytes.map(function(b){

      const v = (b < 0 ? b + 256 : b);

      return ("0" + v.toString(16)).slice(-2);

    }).join("");

  }

  verifySignature(value, secret, signature) {

    return this.sign(

      value,

      secret

    ) === signature;

  }

  //=========================================================================
  // API Keys
  //=========================================================================

  createApiKey(name) {

    const key = this.token(40);

    this._apiKeys[name] = key;

    this._statistics.apiKeys++;

    return key;

  }

  apiKey(name) {

    return this._apiKeys[name] || null;

  }

  hasApiKey(name) {

    return this._apiKeys.hasOwnProperty(name);

  }

  removeApiKey(name) {

    delete this._apiKeys[name];

    return this;

  }

  apiKeys() {

    return Object.keys(this._apiKeys);

  }

  //=========================================================================
  // CSRF Tokens
  //=========================================================================

  createCSRF(sessionId) {

    const token = this.token(40);

    this._csrfTokens[sessionId] = token;

    this._statistics.csrf++;

    return token;

  }

  csrf(sessionId) {

    return this._csrfTokens[sessionId] || null;

  }

  verifyCSRF(sessionId, token) {

    this._statistics.validations++;

    return this.safeEquals(

      this.csrf(sessionId),

      token

    );

  }

  removeCSRF(sessionId) {

    delete this._csrfTokens[sessionId];

    return this;

  }

  csrfSessions() {

    return Object.keys(this._csrfTokens);

  }

  //=========================================================================
  // Security Helpers
  //=========================================================================

  safeEquals(a, b) {

    a = String(a || "");
    b = String(b || "");

    if (a.length !== b.length)
      return false;

    let result = 0;

    for (let i = 0; i < a.length; i++) {

      result |= (

        a.charCodeAt(i) ^

        b.charCodeAt(i)

      );

    }

    return result === 0;

  }

  validate(request) {

    this._statistics.validations++;

    if (!request)
      return false;

    return true;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      apiKeys : Object.keys(this._apiKeys).length,

      csrf : Object.keys(this._csrfTokens).length,

      hashes : this._statistics.hashes,

      signatures : this._statistics.signatures,

      validations : this._statistics.validations,

      failures : this._statistics.failures

    };

  }

  health() {

    return {

      initialized : this.isInitialized(),

      healthy : true,

      apiKeys : Object.keys(this._apiKeys).length,

      csrf : Object.keys(this._csrfTokens).length

    };

  }

  report() {

    return {

      apiKeys : this.apiKeys(),

      csrf : this.csrfSessions(),

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

WEF.Security = new SecurityService();