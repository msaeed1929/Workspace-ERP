/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 303_Sales.gs
 * Layer       : ERP Application
 * Component   : Sales Workspace
 * Version     : 1.0.0
 * Description : Sales application workspace responsible for quotations,
 *               sales orders, deliveries, invoices, receivables and sales
 *               analytics. Acts as the presentation layer for the Sales
 *               business module.
 * =============================================================================
 */

'use strict';

class ERPSales {

  constructor() {

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    this._initialized = false;

    this._running = false;

    this._workspaceName = "Sales Workspace";

    this._version = "1.0.0";

    this._dashboard = {};

    this._quotations = [];

    this._salesOrders = [];

    this._deliveries = [];

    this._invoices = [];

    this._customers = [];

    this._receivables = [];

    this._reports = [];

    this._bootTime = null;

    return this;

  }

  //=========================================================================
  // Workspace Boot
  //=========================================================================

  boot() {

    Logger.info("========== Sales Workspace Boot Started ==========");

    this.loadDashboard();

    this.loadQuotations();

    this.loadSalesOrders();

    this.loadDeliveries();

    this.loadInvoices();

    this.loadCustomers();

    this.loadReceivables();

    this.loadReports();

    this._bootTime = new Date();

    this._initialized = true;

    Logger.info("========== Sales Workspace Ready ==========");

    return this;

  }

  //=========================================================================
  // Loaders
  //=========================================================================

  loadDashboard() {

    Logger.info("Loading Sales Dashboard");

    this._dashboard = {

      quotations: 0,

      orders: 0,

      deliveries: 0,

      invoices: 0,

      receivables: 0

    };

    return this;

  }

  loadQuotations() {

    Logger.info("Loading Quotations");

    this._quotations = [];

    return this;

  }

  loadSalesOrders() {

    Logger.info("Loading Sales Orders");

    this._salesOrders = [];

    return this;

  }

  loadDeliveries() {

    Logger.info("Loading Deliveries");

    this._deliveries = [];

    return this;

  }

  loadInvoices() {

    Logger.info("Loading Sales Invoices");

    this._invoices = [];

    return this;

  }

  loadCustomers() {

    Logger.info("Loading Customers");

    this._customers = [];

    return this;

  }

  loadReceivables() {

    Logger.info("Loading Receivables");

    this._receivables = [];

    return this;

  }

  loadReports() {

    Logger.info("Loading Sales Reports");

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

    Logger.info("========== Sales Workspace Started ==========");

    return this;

  }

  stop() {

    this._running = false;

    Logger.info("========== Sales Workspace Stopped ==========");

    return this;

  }

  restart() {

    this.stop();

    this.start();

    Logger.info("========== Sales Workspace Restarted ==========");

    return this;

  }

  //=========================================================================
  // Workspace Data
  //=========================================================================

  dashboard() {

    return this._dashboard;

  }

  quotations() {

    return this._quotations;

  }

  salesOrders() {

    return this._salesOrders;

  }

  deliveries() {

    return this._deliveries;

  }

  invoices() {

    return this._invoices;

  }

  customers() {

    return this._customers;

  }

  receivables() {

    return this._receivables;

  }

  reports() {

    return this._reports;

  }

  //=========================================================================
  // Navigation
  //=========================================================================

  openQuotations() {

    Logger.info("Opening Quotations");

    return true;

  }

  openSalesOrders() {

    Logger.info("Opening Sales Orders");

    return true;

  }

  openDeliveries() {

    Logger.info("Opening Deliveries");

    return true;

  }

  openInvoices() {

    Logger.info("Opening Sales Invoices");

    return true;

  }

  openCustomers() {

    Logger.info("Opening Customers");

    return true;

  }

  openReceivables() {

    Logger.info("Opening Receivables");

    return true;

  }

  openReports() {

    Logger.info("Opening Sales Reports");

    return true;

  }

  //=========================================================================
  // Workspace Operations
  //=========================================================================

  refresh() {

    Logger.info("Refreshing Sales Workspace");

    this.boot();

    return this;

  }

  runtime() {

    return {

      initialized: this._initialized,

      running: this._running,

      workspace: this._workspaceName,

      version: this._version,

      bootTime: this._bootTime

    };

  }

  info() {

    return {

      name: this._workspaceName,

      layer: "ERP Application",

      runtime: this.runtime()

    };

  }

  reset() {

    this.stop();

    this.initialize();

    Logger.info("========== Sales Workspace Reset ==========");

    return this;

  }

}

/*==============================================================================
  Module Registration
==============================================================================*/

WEF.App = WEF.App || {};

WEF.App.Sales = new ERPSales();