/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 304_Purchase.gs
 * Layer       : ERP Application
 * Component   : Purchase Workspace
 * Version     : 1.0.0
 * Description : Purchase application workspace responsible for suppliers,
 *               RFQs, purchase orders, goods receipts, vendor bills,
 *               payments and purchase analytics.
 * =============================================================================
 */

'use strict';

class ERPPurchase {

  constructor() {

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    this._initialized = false;

    this._running = false;

    this._workspaceName = "Purchase Workspace";

    this._version = "1.0.0";

    this._dashboard = {};

    this._suppliers = [];

    this._rfqs = [];

    this._purchaseOrders = [];

    this._goodsReceipts = [];

    this._vendorBills = [];

    this._payments = [];

    this._reports = [];

    this._bootTime = null;

    return this;

  }

  //=========================================================================
  // Workspace Boot
  //=========================================================================

  boot() {

    Logger.info("========== Purchase Workspace Boot Started ==========");

    this.loadDashboard();

    this.loadSuppliers();

    this.loadRFQs();

    this.loadPurchaseOrders();

    this.loadGoodsReceipts();

    this.loadVendorBills();

    this.loadPayments();

    this.loadReports();

    this._bootTime = new Date();

    this._initialized = true;

    Logger.info("========== Purchase Workspace Ready ==========");

    return this;

  }

  //=========================================================================
  // Loaders
  //=========================================================================

  loadDashboard() {

    Logger.info("Loading Purchase Dashboard");

    this._dashboard = {

      suppliers: 0,

      rfqs: 0,

      purchaseOrders: 0,

      receipts: 0,

      vendorBills: 0,

      payments: 0

    };

    return this;

  }

  loadSuppliers() {

    Logger.info("Loading Suppliers");

    this._suppliers = [];

    return this;

  }

  loadRFQs() {

    Logger.info("Loading RFQs");

    this._rfqs = [];

    return this;

  }

  loadPurchaseOrders() {

    Logger.info("Loading Purchase Orders");

    this._purchaseOrders = [];

    return this;

  }

  loadGoodsReceipts() {

    Logger.info("Loading Goods Receipts");

    this._goodsReceipts = [];

    return this;

  }

  loadVendorBills() {

    Logger.info("Loading Vendor Bills");

    this._vendorBills = [];

    return this;

  }

  loadPayments() {

    Logger.info("Loading Vendor Payments");

    this._payments = [];

    return this;

  }

  loadReports() {

    Logger.info("Loading Purchase Reports");

    this._reports = [];

    return this;

  }

  //=========================================================================
  // Runtime
  //=========================================================================

  start() {

    if (!this._initialized) {

      this.boot();

    }

    this._running = true;

    Logger.info("========== Purchase Workspace Started ==========");

    return this;

  }

  stop() {

    this._running = false;

    Logger.info("========== Purchase Workspace Stopped ==========");

    return this;

  }

  restart() {

    this.stop();

    this.start();

    Logger.info("========== Purchase Workspace Restarted ==========");

    return this;

  }

  //=========================================================================
  // Workspace Data
  //=========================================================================

  dashboard() {

    return this._dashboard;

  }

  suppliers() {

    return this._suppliers;

  }

  rfqs() {

    return this._rfqs;

  }

  purchaseOrders() {

    return this._purchaseOrders;

  }

  goodsReceipts() {

    return this._goodsReceipts;

  }

  vendorBills() {

    return this._vendorBills;

  }

  payments() {

    return this._payments;

  }

  reports() {

    return this._reports;

  }

  //=========================================================================
  // Navigation
  //=========================================================================

  openSuppliers() {

    Logger.info("Opening Suppliers");

    return true;

  }

  openRFQs() {

    Logger.info("Opening RFQs");

    return true;

  }

  openPurchaseOrders() {

    Logger.info("Opening Purchase Orders");

    return true;

  }

  openGoodsReceipts() {

    Logger.info("Opening Goods Receipts");

    return true;

  }

  openVendorBills() {

    Logger.info("Opening Vendor Bills");

    return true;

  }

  openPayments() {

    Logger.info("Opening Vendor Payments");

    return true;

  }

  openReports() {

    Logger.info("Opening Purchase Reports");

    return true;

  }

  //=========================================================================
  // Workspace Operations
  //=========================================================================

  refresh() {

    Logger.info("Refreshing Purchase Workspace");

    this.boot();

    return this;

  }

  //=========================================================================
  // Runtime Information
  //=========================================================================

  runtime() {

    return {

      initialized: this._initialized,

      running: this._running,

      workspace: this._workspaceName,

      version: this._version,

      suppliers: this._suppliers.length,

      rfqs: this._rfqs.length,

      purchaseOrders: this._purchaseOrders.length,

      goodsReceipts: this._goodsReceipts.length,

      vendorBills: this._vendorBills.length,

      payments: this._payments.length,

      bootTime: this._bootTime

    };

  }

  info() {

    return {

      name: this._workspaceName,

      layer: "ERP Application",

      version: this._version,

      runtime: this.runtime()

    };

  }

  //=========================================================================
  // Reset
  //=========================================================================

  reset() {

    this.stop();

    this.initialize();

    Logger.info("========== Purchase Workspace Reset ==========");

    return this;

  }

}

/*==============================================================================
  Module Registration
==============================================================================*/

WEF.App = WEF.App || {};

WEF.App.Purchase = new ERPPurchase();
