/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 29_Core_Authorization.gs
 * Version     : 1.0.0
 * Description : Role Based Authorization (RBAC)
 * =============================================================================
 */

'use strict';

class AuthorizationService extends BaseService {

  constructor() {

    super("Authorization");

    this.initialize();

  }

  initialize() {

    super.initialize();

    this.reset();

    return this;

  }

  reset() {

    this._roles = {};
    this._permissions = {};
    this._userRoles = {};

    this._statistics = {

      roles:0,
      permissions:0,
      assignments:0,
      checks:0,
      granted:0,
      denied:0

    };

    return this;

  }

  //=========================================================================
  // Roles
  //=========================================================================

  createRole(name, description) {

    if (this._roles[name])
      return false;

    this._roles[name] = {

      name:name,
      description:description || "",
      permissions:{}

    };

    this._statistics.roles++;

    return true;

  }

  removeRole(name) {

    if (!this._roles[name])
      return false;

    delete this._roles[name];

    Object.keys(this._userRoles).forEach(user => {

      this._userRoles[user] =
        this._userRoles[user]
          .filter(role => role !== name);

    });

    return true;

  }

  hasRole(name) {

    return !!this._roles[name];

  }

  roles() {

    return Object.keys(this._roles);

  }

  role(name) {

    return this._roles[name] || null;

  }

  roleCount() {

    return this.roles().length;

  }

  //=========================================================================
  // Permissions
  //=========================================================================

  createPermission(name, description) {

    if (this._permissions[name])
      return false;

    this._permissions[name] = {

      name:name,
      description:description || ""

    };

    this._statistics.permissions++;

    return true;

  }

  permissions() {

    return Object.keys(this._permissions);

  }

  permission(name) {

    return this._permissions[name] || null;

  }

  hasPermissionDefinition(name){

    return !!this._permissions[name];

  }

  permissionCount(){

    return this.permissions().length;

  }

  //=========================================================================
  // Role Permissions
  //=========================================================================

  allow(role, permission) {

    if (!this.hasRole(role))
      throw new Error("Role not found.");

    if (!this.hasPermissionDefinition(permission))
      throw new Error("Permission not found.");

    this._roles[role]
      .permissions[permission] = true;

    return true;

  }

  deny(role, permission) {

    if (!this.hasRole(role))
      return false;

    delete this._roles[role]
      .permissions[permission];

    return true;

  }

  rolePermissions(role){

    if(!this.hasRole(role))
      return [];

    return Object.keys(
      this._roles[role].permissions
    );

  }

  //=========================================================================
  // User Role Assignment
  //=========================================================================

  assign(username, role) {

    if (!this.hasRole(role))
      throw new Error("Role not found.");

    if (!this._userRoles[username])
      this._userRoles[username] = [];

    if (this._userRoles[username].indexOf(role) === -1) {

      this._userRoles[username].push(role);
      this._statistics.assignments++;

    }

    return true;

  }

  unassign(username, role) {

    if (!this._userRoles[username])
      return false;

    this._userRoles[username] =
      this._userRoles[username]
        .filter(r => r !== role);

    return true;

  }

  rolesOf(username) {

    return (this._userRoles[username] || []).slice();

  }

  hasUserRole(username, role) {

    return this.rolesOf(username).indexOf(role) > -1;

  }

  //=========================================================================
  // Authorization
  //=========================================================================

  can(username, permission) {

    this._statistics.checks++;

    const roles = this.rolesOf(username);

    for (let i = 0; i < roles.length; i++) {

      const role = this._roles[roles[i]];

      if (role &&
          role.permissions[permission]) {

        this._statistics.granted++;
        return true;

      }

    }

    this._statistics.denied++;

    return false;

  }

  cannot(username, permission) {

    return !this.can(username, permission);

  }

  authorize(username, permission) {

    if (!this.can(username, permission))
      throw new Error(
        "Access denied (" +
        username +
        " -> " +
        permission +
        ")."
      );

    return true;

  }

  //=========================================================================
  // Utilities
  //=========================================================================

  clearAssignments() {

    this._userRoles = {};

    return this;

  }

  clearRoles() {

    this._roles = {};

    return this;

  }

  clearPermissions() {

    this._permissions = {};

    return this;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      roles:this.roleCount(),
      permissions:this.permissionCount(),
      assignments:this._statistics.assignments,
      checks:this._statistics.checks,
      granted:this._statistics.granted,
      denied:this._statistics.denied

    };

  }

  health() {

    return {

      initialized:this.isInitialized(),
      healthy:true,
      roles:this.roleCount(),
      permissions:this.permissionCount(),
      users:Object.keys(this._userRoles).length

    };

  }

  report() {

    return {

      roles:this.roles(),

      permissions:this.permissions(),

      assignments:
        JSON.parse(
          JSON.stringify(this._userRoles)
        ),

      statistics:this.statistics(),

      health:this.health()

    };

  }

  info() {

    return {

      service:this.getName(),

      version:this.getVersion(),

      initialized:this.isInitialized(),

      created:this.getCreatedTime(),

      statistics:this.statistics()

    };

  }

}

WEF.Authorization =
  new AuthorizationService();