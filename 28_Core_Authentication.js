/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 28_Core_Authentication.gs
 * Version     : 1.0.0
 * Description : Authentication Service
 * =============================================================================
 */

'use strict';

class AuthenticationService extends BaseService {

  constructor() {

    super("Authentication");

    this.initialize();

  }

  initialize() {

    super.initialize();

    this.reset();

    return this;

  }

  reset() {

    this._users = {};

    this._sessions = {};

    this._currentUser = null;

    this._statistics = {

      logins: 0,
      logouts: 0,
      failed: 0,
      sessions: 0,
      expired: 0,
      locked: 0

    };

    return this;

  }

  //=========================================================================
  // User Registration
  //=========================================================================

  register(username, password, profile) {

    this._users[username] = {

      username: username,

      password: WEF.Security.hash(password),

      profile: profile || {},

      enabled: true,

      locked: false,

      attempts: 0,

      created: new Date()

    };

    return this;

  }

  hasUser(username) {

    return !!this._users[username];

  }

  user(username) {

    return this._users[username] || null;

  }

  users() {

    return Object.keys(this._users);

  }

  removeUser(username) {

    delete this._users[username];

    return this;

  }

  //=========================================================================
  // Login
  //=========================================================================

  login(username, password) {

    const user = this.user(username);

    if (!user) {

      this._statistics.failed++;

      return false;

    }

    if (!user.enabled || user.locked) {

      this._statistics.failed++;

      return false;

    }

    if (

      !WEF.Security.verifyHash(

        password,

        user.password

      )

    ) {

      user.attempts++;

      this._statistics.failed++;

      return false;

    }

    user.attempts = 0;

    const sessionId = Utilities.getUuid();

    this._sessions[sessionId] = {

      id: sessionId,

      username: username,

      loginTime: new Date(),

      expires: new Date(

        Date.now() + 3600000

      ) // 1 hour

    };

    this._currentUser = username;

    this._statistics.logins++;

    this._statistics.sessions++;

    return sessionId;

  }

  logout(sessionId) {

    if (!this._sessions[sessionId])
      return false;

    delete this._sessions[sessionId];

    this._currentUser = null;

    this._statistics.logouts++;

    return true;

  }

  //=========================================================================
  // Sessions
  //=========================================================================

  session(sessionId) {

    return this._sessions[sessionId] || null;

  }

  sessions() {

    return Object.keys(this._sessions);

  }

  currentUser() {

    return this._currentUser;

  }

  isAuthenticated(sessionId) {

    return !!this._sessions[sessionId];

  }

  sessionCount() {

    return Object.keys(this._sessions).length;

  }

  clearSessions() {

    this._sessions = {};

    this._currentUser = null;

    return this;

  }

  //=========================================================================
  // User State
  //=========================================================================

  enable(username) {

    const user = this.user(username);

    if (user)
      user.enabled = true;

    return this;

  }

  disable(username) {

    const user = this.user(username);

    if (user)
      user.enabled = false;

    return this;

  }

  lock(username) {

    const user = this.user(username);

    if (user && !user.locked) {

      user.locked = true;

      this._statistics.locked++;

    }

    return this;

  }

  unlock(username) {

    const user = this.user(username);

    if (user) {

      user.locked = false;

      user.attempts = 0;

    }

    return this;

  }

  isLocked(username) {

    const user = this.user(username);

    return user ? user.locked : false;

  }

  isEnabled(username) {

    const user = this.user(username);

    return user ? user.enabled : false;

  }

  //=========================================================================
  // Session Management
  //=========================================================================

  expire(sessionId) {

    if (!this._sessions[sessionId])
      return false;

    delete this._sessions[sessionId];

    this._statistics.expired++;

    return true;

  }

  cleanup() {

    const now = Date.now();

    for (const id in this._sessions) {

      if (this._sessions[id].expires.getTime() <= now) {

        delete this._sessions[id];

        this._statistics.expired++;

      }

    }

    return this;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      users : this.users().length,

      sessions : this.sessionCount(),

      logins : this._statistics.logins,

      logouts : this._statistics.logouts,

      failed : this._statistics.failed,

      expired : this._statistics.expired,

      locked : this._statistics.locked

    };

  }

  health() {

    return {

      initialized : this.isInitialized(),

      healthy : true,

      users : this.users().length,

      sessions : this.sessionCount()

    };

  }

  report() {

    return {

      users : this.users(),

      sessions : this.sessions(),

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

WEF.Authentication = new AuthenticationService();