/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * -----------------------------------------------------------------------------
 * File        : 004_Core_Constants.gs
 * Version     : 3.2.0
 * Description : Global Framework Constants
 * Author      : OpenAI + Muhammad Saeed Anser
 * =============================================================================
 */

'use strict';

WEF.Constants = Object.freeze({

  /* ============================================================================
  * Framework
  * ========================================================================== */

  Framework: Object.freeze({

    NAME: WEF_FRAMEWORK.NAME,

    VERSION: WEF_FRAMEWORK.VERSION,

    BUILD: WEF_FRAMEWORK.BUILD,

    CHANNEL: WEF_FRAMEWORK.RELEASE_CHANNEL,

    RELEASE_DATE: WEF_FRAMEWORK.RELEASE_DATE

  }),

  /* ==========================================================================
   * Data Types
   * ======================================================================= */

  DataType: Object.freeze({

    TEXT:"TEXT",

    STRING:"STRING",

    NUMBER:"NUMBER",

    INTEGER:"INTEGER",

    DECIMAL:"DECIMAL",

    CURRENCY:"CURRENCY",

    DATE:"DATE",

    TIME:"TIME",

    DATETIME:"DATETIME",

    BOOLEAN:"BOOLEAN",

    EMAIL:"EMAIL",

    PHONE:"PHONE",

    URL:"URL",

    UUID:"UUID",

    JSON:"JSON",

    ARRAY:"ARRAY",

    OBJECT:"OBJECT",

    FILE:"FILE",

    IMAGE:"IMAGE"

  }),

  FieldType:Object.freeze({

    MASTER:"MASTER",

    TRANSACTION:"TRANSACTION",

    LOOKUP:"LOOKUP",

    FORMULA:"FORMULA",

    COMPUTED:"COMPUTED",

    SYSTEM:"SYSTEM"

  }),

  Relationship:Object.freeze({

    ONE_TO_ONE:"OneToOne",

    ONE_TO_MANY:"OneToMany",

    MANY_TO_ONE:"ManyToOne",

    MANY_TO_MANY:"ManyToMany"

  }),

  Operation:Object.freeze({

    CREATE:"CREATE",

    READ:"READ",

    UPDATE:"UPDATE",

    DELETE:"DELETE",

    UPSERT:"UPSERT"

  }),

  Event:Object.freeze({

    BEFORE_CREATE:"Before Create",

    AFTER_CREATE:"After Create",

    BEFORE_UPDATE:"Before Update",

    AFTER_UPDATE:"After Update",

    BEFORE_DELETE:"Before Delete",

    AFTER_DELETE:"After Delete"

  }),

  Cache:Object.freeze({

      NONE:0,

      SHORT:300,

      MEDIUM:1800,

      LONG:3600,

      DAY:86400

  }),

  Permission:Object.freeze({

    NONE:"NONE",

    VIEW:"VIEW",

    CREATE:"CREATE",

    UPDATE:"UPDATE",

    DELETE:"DELETE",

    FULL:"FULL"

  }),

  ExportType:Object.freeze({

    PDF:"PDF",

    XLSX:"XLSX",

    CSV:"CSV",

    DOCX:"DOCX",

    JSON:"JSON"

  }),

  LogLevel:Object.freeze({

      TRACE:"TRACE",

      DEBUG:"DEBUG",

      INFO:"INFO",

      WARNING:"WARNING",

      ERROR:"ERROR",

      FATAL:"FATAL",

      OFF:"OFF"

  }),

  Environment:Object.freeze({

      DEVELOPMENT:"DEVELOPMENT",

      TESTING:"TESTING",

      STAGING:"STAGING",

      PRODUCTION:"PRODUCTION"

  }),

  ServiceLifetime:Object.freeze({

      SINGLETON:"SINGLETON",

      SCOPED:"SCOPED",

      TRANSIENT:"TRANSIENT"

  }),

  Validation:Object.freeze({

      REQUIRED:"REQUIRED",

      UNIQUE:"UNIQUE",

      MIN:"MIN",

      MAX:"MAX",

      LENGTH:"LENGTH",

      EMAIL:"EMAIL",

      URL:"URL",

      REGEX:"REGEX"

  }),

  Database:Object.freeze({

      INSERT:"INSERT",

      UPDATE:"UPDATE",

      DELETE:"DELETE",

      SELECT:"SELECT"

  }),

  Status:Object.freeze({

      READY:"READY",

      BUSY:"BUSY",

      ERROR:"ERROR",

      DISABLED:"DISABLED"

  }),

  HttpMethod:Object.freeze({

    GET:"GET",

    POST:"POST",

    PUT:"PUT",

    PATCH:"PATCH",

    DELETE:"DELETE"

  }),

  /* ==========================================================================
   * Entity State
   * ======================================================================= */

  EntityState: Object.freeze({

    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
    ARCHIVED: "ARCHIVED",
    DELETED: "DELETED"

  }),

  /* ==========================================================================
   * User Roles
   * ======================================================================= */

  Role: Object.freeze({

    ADMINISTRATOR: "Administrator",
    MANAGER: "Manager",
    ACCOUNTANT: "Accountant",
    PURCHASE: "Purchase",
    SALES: "Sales",
    STORE: "Store",
    PRODUCTION: "Production",
    HR: "HR",
    AUDITOR: "Auditor",
    USER: "User"

  }),

  /* ==========================================================================
   * Document Status
   * ======================================================================= */

  DocumentStatus: Object.freeze({

    DRAFT: "Draft",
    PENDING: "Pending",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    CANCELLED: "Cancelled",
    CLOSED: "Closed"

  }),

  /* ==========================================================================
   * Modules
   * ======================================================================= */

  Module: Object.freeze({

    COMPANY: "Company",
    USERS: "Users",
    INVENTORY: "Inventory",
    PURCHASE: "Purchase",
    SALES: "Sales",
    ACCOUNTING: "Accounting",
    MANUFACTURING: "Manufacturing",
    CRM: "CRM",
    HR: "HR",
    PAYROLL: "Payroll",
    POS: "POS",
    REPORTS: "Reports",
    SETTINGS: "Settings"

  }),

  /* ==========================================================================
   * Inventory Transactions
   * ======================================================================= */

  InventoryTransaction: Object.freeze({

    OPENING: "Opening",
    PURCHASE: "Purchase",
    PURCHASE_RETURN: "Purchase Return",
    SALE: "Sale",
    SALES_RETURN: "Sales Return",
    ADJUSTMENT: "Adjustment",
    TRANSFER: "Transfer",
    PRODUCTION_IN: "Production In",
    PRODUCTION_OUT: "Production Out"

  }),

  /* ==========================================================================
   * Voucher Types
   * ======================================================================= */

  VoucherType: Object.freeze({

    JV: "Journal Voucher",
    PV: "Payment Voucher",
    RV: "Receipt Voucher",
    CV: "Contra Voucher"

  }),

  /* ==========================================================================
   * Account Types
   * ======================================================================= */

  AccountType: Object.freeze({

    ASSET: "Asset",
    LIABILITY: "Liability",
    EQUITY: "Equity",
    INCOME: "Income",
    EXPENSE: "Expense"

  }),

  /* ==========================================================================
   * Approval Status
   * ======================================================================= */

  Approval: Object.freeze({

    PENDING: "Pending",
    APPROVED: "Approved",
    REJECTED: "Rejected"

  }),

  /* ==========================================================================
   * Boolean
   * ======================================================================= */

  YesNo: Object.freeze({

    YES: "Yes",

    NO: "No"

  })

});

/**
 * =============================================================================
 * TEST
 * =============================================================================
 */

function test_Constants(){

Logger.log(WEF.Constants.Role.ADMINISTRATOR);

Logger.log(WEF.Constants.Module.ACCOUNTING);

Logger.log(WEF.Constants.DataType.DATE);

Logger.log(WEF.Constants.Relationship.ONE_TO_MANY);

Logger.log(WEF.Constants.Operation.CREATE);

Logger.log(WEF.Constants.Permission.FULL);

Logger.log(WEF.Constants.ExportType.PDF);

Logger.log(WEF.Constants.Framework.VERSION);

Logger.log(WEF.Constants.Environment.DEVELOPMENT);

Logger.log(WEF.Constants.ServiceLifetime.SINGLETON);

Logger.log(WEF.Constants.Cache.DAY);

Logger.log(WEF.Constants.LogLevel.TRACE);

}