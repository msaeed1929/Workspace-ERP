//=============================================================================
// WEF Framework
// CRM Email Manager
// Version 1.0.0
//=============================================================================

class CRMEmailManager extends BaseService {

  //===========================================================================
  // Constructor
  //===========================================================================

  constructor() {

    super("CRMEmailManager");

    this._emails = {};

  }

  //===========================================================================
  // Initialization
  //===========================================================================

  initialize() {

    super.initialize();

    this._customers = {};

    return this;

  }

  //===========================================================================
  // Create
  //===========================================================================

  create(id, email) {

    this._emails[id] = email;

    return true;

  }

  exists(id) {

    return id in this._emails;

  }

  get(id) {

    return this._emails[id] || null;

  }

  update(id, email) {

    if (!this.exists(id)) return false;

    this._emails[id] = email;

    return true;

  }

  remove(id) {

    if (!this.exists(id)) return false;

    delete this._emails[id];

    return true;

  }

  all() {

    return this._emails;

  }

  ids() {

    return Object.keys(this._emails);

  }

  count() {

    return this.ids().length;

  }

  //===========================================================================
  // Email Status
  //===========================================================================

  sent(id) {

    if (!this.exists(id)) return false;

    this._emails[id].status = "Sent";

    return true;

  }

  failed(id) {

    if (!this.exists(id)) return false;

    this._emails[id].status = "Failed";

    return true;

  }

  draft(id) {

    if (!this.exists(id)) return false;

    this._emails[id].status = "Draft";

    return true;

  }

  queued(id) {

    if (!this.exists(id)) return false;

    this._emails[id].status = "Queued";

    return true;

  }

  //===========================================================================
  // Filters
  //===========================================================================

  sentEmails() {

    return Object.fromEntries(

      Object.entries(this._emails)

        .filter(([id, email]) => email.status === "Sent")

    );

  }

  failedEmails() {

    return Object.fromEntries(

      Object.entries(this._emails)

        .filter(([id, email]) => email.status === "Failed")

    );

  }

  draftEmails() {

    return Object.fromEntries(

      Object.entries(this._emails)

        .filter(([id, email]) => email.status === "Draft")

    );

  }

  queuedEmails() {

    return Object.fromEntries(

      Object.entries(this._emails)

        .filter(([id, email]) => email.status === "Queued")

    );

  }

  //=========================================================================
  // Maintenance
  //=========================================================================

  clear() {

    this._emails = {};

    return true;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      emails: this.count(),
      sent: Object.keys(this.sentEmails()).length,
      failed: Object.keys(this.failedEmails()).length,
      drafts: Object.keys(this.draftEmails()).length,
      queued: Object.keys(this.queuedEmails()).length

    };

  }

  health() {

    return {

      initialized: this.isInitialized(),
      healthy: true,
      emails: this.count(),
      sent: Object.keys(this.sentEmails()).length,
      failed: Object.keys(this.failedEmails()).length,
      drafts: Object.keys(this.draftEmails()).length,
      queued: Object.keys(this.queuedEmails()).length

    };

  }

  report() {

    return {

      emails: this.all(),
      statistics: this.statistics(),
      health: this.health()

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

//==============================================================================
// CRM Registration
//==============================================================================

WEF.ServiceContainer.registerModuleService(
  "CRM",
  "EmailManager",
  new CRMEmailManager()
);