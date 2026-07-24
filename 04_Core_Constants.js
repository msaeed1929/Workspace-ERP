/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 04_Core_Constants.gs
 * Version     : 1.0.0
 * Description : System Constants Library
 * =============================================================================
 */

'use strict';

WEF.Constants = Object.freeze({

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

    SHORT:300,

    MEDIUM:1800,

    LONG:3600

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

  LogLevel: Object.freeze({

    INFO: "INFO",

    WARNING: "WARNING",

    ERROR: "ERROR",

    DEBUG: "DEBUG"

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

}