/*==============================================================================
  Test Function
==============================================================================*/

function test_201_UIKernel() {

  Logger.info("==================================================");
  Logger.info("Workspace ERP Framework - UI Kernel");
  Logger.info("==================================================");

  const kernel = WEF.UI.Core.Kernel;

  //=========================================================================
  // Boot
  //=========================================================================

  Logger.info("---------- BOOT ----------");

  kernel.boot();

  Logger.info(kernel.status());

  //=========================================================================
  // Start
  //=========================================================================

  Logger.info("---------- START ----------");

  kernel.start();

  Logger.info(kernel.status());

  //=========================================================================
  // Runtime
  //=========================================================================

  Logger.info("---------- RUNTIME ----------");

  Logger.info(WEF.UI.Runtime);

  //=========================================================================
  // Version
  //=========================================================================

  Logger.info("---------- VERSION ----------");

  Logger.info(kernel.version());

  //=========================================================================
  // Boot Time
  //=========================================================================

  Logger.info("---------- BOOT TIME ----------");

  Logger.info(kernel.bootTime());

  //=========================================================================
  // Restart
  //=========================================================================

  Logger.info("---------- RESTART ----------");

  kernel.restart();

  Logger.info(kernel.status());

  //=========================================================================
  // Stop
  //=========================================================================

  Logger.info("---------- STOP ----------");

  kernel.stop();

  Logger.info(kernel.status());

  //=========================================================================
  // Information
  //=========================================================================

  Logger.info("---------- INFORMATION ----------");

  Logger.info(kernel.info());

  Logger.info("==================================================");
  Logger.info("UI Kernel Test Completed");
  Logger.info("==================================================");

}

/*==============================================================================
  Test Function
==============================================================================*/

function test_202_UIConfig() {

  Logger.info("==================================================");
  Logger.info("Workspace ERP Framework - UI Configuration");
  Logger.info("==================================================");

  WEF.UI.Config.initialize();

  Logger.info("---------- APPLICATION ----------");
  Logger.info(WEF.UI.Config.APPLICATION);

  Logger.info("---------- THEME ----------");
  Logger.info(WEF.UI.Config.THEME);

  Logger.info("---------- LAYOUT ----------");
  Logger.info(WEF.UI.Config.LAYOUT);

  Logger.info("---------- FEATURES ----------");
  Logger.info(WEF.UI.Config.FEATURES);

  Logger.info("---------- GET ----------");
  Logger.info(WEF.UI.Config.get("APPLICATION"));

  Logger.info("---------- HAS ----------");
  Logger.info(WEF.UI.Config.has("THEME"));

  Logger.info("---------- KEYS ----------");
  Logger.info(WEF.UI.Config.keys());

  Logger.info("---------- COUNT ----------");
  Logger.info(WEF.UI.Config.count());

  Logger.info("---------- INFO ----------");
  Logger.info(WEF.UI.Config.info());

  Logger.info("==================================================");
  Logger.info("UI Configuration Test Completed");
  Logger.info("==================================================");

}

/*==============================================================================
  Test Function
==============================================================================*/

function test_203_UIRouter() {

  Logger.info("==================================================");
  Logger.info("Workspace ERP Framework - UI Router");
  Logger.info("==================================================");

  const router = WEF.UI.Core.Router;

  router.initialize();

  //=========================================================================
  // REGISTER
  //=========================================================================

  Logger.info("---------- REGISTER ----------");

  router.register("dashboard", "Dashboard");

  router.register("crm", "CRM");

  router.register("sales", "Sales");

  router.register("purchase", "Purchase");

  router.register("inventory", "Inventory");

  router.register("accounting", "Accounting");

  Logger.info(router.keys());

  Logger.info(router.count());

  //=========================================================================
  // REGISTER MANY
  //=========================================================================

  Logger.info("---------- REGISTER MANY ----------");

  router.registerMany({

    hr: "HR",

    manufacturing: "Manufacturing",

    projects: "Projects",

    reports: "Reports",

    settings: "Settings"

  });

  Logger.info(router.keys());

  Logger.info(router.count());

  //=========================================================================
  // GET
  //=========================================================================

  Logger.info("---------- GET ----------");

  Logger.info(router.get("dashboard"));

  Logger.info(router.get("crm"));

  //=========================================================================
  // EXISTS
  //=========================================================================

  Logger.info("---------- EXISTS ----------");

  Logger.info(router.exists("sales"));

  Logger.info(router.exists("finance"));

  //=========================================================================
  // DEFAULT ROUTE
  //=========================================================================

  Logger.info("---------- DEFAULT ----------");

  router.setDefault("dashboard");

  Logger.info(router.getDefault());

  //=========================================================================
  // NAVIGATION
  //=========================================================================

  Logger.info("---------- NAVIGATION ----------");

  router.navigate("dashboard");

  router.navigate("crm");

  router.navigate("sales");

  Logger.info(router.current());

  Logger.info(router.history());

  Logger.info(router.previous());

  //=========================================================================
  // REMOVE
  //=========================================================================

  Logger.info("---------- REMOVE ----------");

  Logger.info(router.remove("settings"));

  Logger.info(router.keys());

  Logger.info(router.count());

  //=========================================================================
  // CLEAR HISTORY
  //=========================================================================

  Logger.info("---------- CLEAR HISTORY ----------");

  router.clearHistory();

  Logger.info(router.history());

  //=========================================================================
  // INFORMATION
  //=========================================================================

  Logger.info("---------- INFORMATION ----------");

  Logger.info(router.info());

  //=========================================================================
  // CLEAR
  //=========================================================================

  Logger.info("---------- CLEAR ----------");

  router.clear();

  Logger.info(router.keys());

  Logger.info(router.count());

  Logger.info("==================================================");
  Logger.info("UI Router Test Completed");
  Logger.info("==================================================");

}

/*==============================================================================
  Test Function
==============================================================================*/

function test_204_UITemplateEngine() {

  Logger.info("==================================================");
  Logger.info("Workspace ERP Framework - UI Template Engine");
  Logger.info("==================================================");

  const engine = WEF.UI.Core.TemplateEngine;

  engine.initialize();

  //=========================================================================
  // REGISTER
  //=========================================================================

  Logger.info("---------- REGISTER ----------");

  engine.register(
    "dashboard",
    "<h1>Dashboard</h1>"
  );

  engine.register(
    "crm",
    "<h1>CRM</h1>"
  );

  engine.register(
    "sales",
    "<h1>Sales</h1>"
  );

  Logger.info(engine.keys());

  Logger.info(engine.count());

  //=========================================================================
  // REGISTER MANY
  //=========================================================================

  Logger.info("---------- REGISTER MANY ----------");

  engine.registerMany({

    purchase: "<h1>Purchase</h1>",

    inventory: "<h1>Inventory</h1>",

    accounting: "<h1>Accounting</h1>",

    hr: "<h1>HR</h1>"

  });

  Logger.info(engine.keys());

  Logger.info(engine.count());

  //=========================================================================
  // GET
  //=========================================================================

  Logger.info("---------- GET ----------");

  Logger.info(engine.get("dashboard"));

  Logger.info(engine.get("inventory"));

  //=========================================================================
  // EXISTS
  //=========================================================================

  Logger.info("---------- EXISTS ----------");

  Logger.info(engine.exists("crm"));

  Logger.info(engine.exists("settings"));

  //=========================================================================
  // CACHE
  //=========================================================================

  Logger.info("---------- CACHE ----------");

  engine.cache("dashboard", engine.get("dashboard"));

  engine.cache("crm", engine.get("crm"));

  Logger.info(engine.getCache("dashboard"));

  Logger.info(engine.cacheSize());

  //=========================================================================
  // RENDER
  //=========================================================================

  Logger.info("---------- RENDER ----------");

  Logger.info(engine.render("sales"));

  Logger.info(engine.render("dashboard"));

  //=========================================================================
  // REMOVE
  //=========================================================================

  Logger.info("---------- REMOVE ----------");

  Logger.info(engine.remove("hr"));

  Logger.info(engine.keys());

  Logger.info(engine.count());

  //=========================================================================
  // CLEAR CACHE
  //=========================================================================

  Logger.info("---------- CLEAR CACHE ----------");

  engine.clearCache();

  Logger.info(engine.cacheSize());

  //=========================================================================
  // INFORMATION
  //=========================================================================

  Logger.info("---------- INFORMATION ----------");

  Logger.info(engine.info());

  //=========================================================================
  // CLEAR
  //=========================================================================

  Logger.info("---------- CLEAR ----------");

  engine.clear();

  Logger.info(engine.keys());

  Logger.info(engine.count());

  Logger.info("==================================================");
  Logger.info("UI Template Engine Test Completed");
  Logger.info("==================================================");

}

function test_205_UIAssetManager() {

  Logger.info("==================================================");
  Logger.info("Workspace ERP Framework - UI Asset Manager");
  Logger.info("==================================================");

  const manager = WEF.UI.Core.AssetManager;

  manager.initialize();

  //=========================================================================
  // REGISTER
  //=========================================================================

  Logger.info("---------- REGISTER ----------");

  manager.register("theme", "/css/theme.css", "css");

  manager.register("layout", "/css/layout.css", "css");

  manager.register("app", "/js/app.js", "javascript");

  manager.register("router", "/js/router.js", "javascript");

  manager.register("logo", "/images/logo.svg", "images");

  manager.register("font", "/fonts/roboto.woff2", "fonts");

  Logger.info(manager.keys());

  Logger.info(manager.count());

  //=========================================================================
  // REGISTER MANY
  //=========================================================================

  Logger.info("---------- REGISTER MANY ----------");

  manager.registerMany([

    {

      name: "icons",

      path: "/images/icons.svg",

      type: "icons"

    },

    {

      name: "dashboard",

      path: "/css/dashboard.css",

      type: "css"

    }

  ]);

  Logger.info(manager.keys());

  Logger.info(manager.count());

  //=========================================================================
  // GET
  //=========================================================================

  Logger.info("---------- GET ----------");

  Logger.info(manager.get("theme"));

  Logger.info(manager.getByType("css"));

  //=========================================================================
  // STATE
  //=========================================================================

  Logger.info("---------- ENABLE / DISABLE ----------");

  manager.disable("theme");

  Logger.info(manager.get("theme"));

  manager.enable("theme");

  Logger.info(manager.get("theme"));

  Logger.info("---------- LOADED ----------");

  manager.markLoaded("app");

  Logger.info(manager.get("app"));

  manager.markUnloaded("app");

  Logger.info(manager.get("app"));

  //=========================================================================
  // REMOVE
  //=========================================================================

  Logger.info("---------- REMOVE ----------");

  Logger.info(manager.remove("font"));

  Logger.info(manager.keys());

  Logger.info(manager.count());

  //=========================================================================
  // INFORMATION
  //=========================================================================

  Logger.info("---------- INFORMATION ----------");

  Logger.info(manager.info());

  //=========================================================================
  // CLEAR
  //=========================================================================

  Logger.info("---------- CLEAR ----------");

  manager.clear();

  Logger.info(manager.keys());

  Logger.info(manager.count());

  Logger.info("==================================================");
  Logger.info("UI Asset Manager Test Completed");
  Logger.info("==================================================");

}

function test_206_UIThemeManager() {

  Logger.info("==================================================");
  Logger.info("Workspace ERP Framework - UI Theme Manager");
  Logger.info("==================================================");

  const manager = WEF.UI.Core.ThemeManager;

  manager.initialize();

  //=========================================================================
  // REGISTER
  //=========================================================================

  Logger.info("---------- REGISTER ----------");

  manager.register("light", {

    primary: "#2563EB",

    background: "#FFFFFF",

    text: "#111827"

  });

  manager.register("dark", {

    primary: "#3B82F6",

    background: "#111827",

    text: "#F9FAFB"

  });

  Logger.info(manager.keys());

  Logger.info(manager.count());

  //=========================================================================
  // REGISTER MANY
  //=========================================================================

  Logger.info("---------- REGISTER MANY ----------");

  manager.registerMany({

    corporate: {

      primary: "#1D4ED8",

      background: "#F8FAFC",

      text: "#1E293B"

    },

    classic: {

      primary: "#0F766E",

      background: "#FFFFFF",

      text: "#374151"

    }

  });

  Logger.info(manager.keys());

  Logger.info(manager.count());

  //=========================================================================
  // GET
  //=========================================================================

  Logger.info("---------- GET ----------");

  Logger.info(manager.get("light"));

  Logger.info(manager.get("dark"));

  //=========================================================================
  // ACTIVE THEME
  //=========================================================================

  Logger.info("---------- ACTIVE THEME ----------");

  Logger.info(manager.getActive());

  manager.setActive("dark");

  Logger.info(manager.getActive());

  Logger.info(manager.getActiveTheme());

  //=========================================================================
  // ENABLE / DISABLE
  //=========================================================================

  Logger.info("---------- ENABLE / DISABLE ----------");

  manager.disable("classic");

  Logger.info(manager.get("classic"));

  manager.enable("classic");

  Logger.info(manager.get("classic"));

  //=========================================================================
  // REMOVE
  //=========================================================================

  Logger.info("---------- REMOVE ----------");

  Logger.info(manager.remove("corporate"));

  Logger.info(manager.keys());

  Logger.info(manager.count());

  //=========================================================================
  // INFORMATION
  //=========================================================================

  Logger.info("---------- INFORMATION ----------");

  Logger.info(manager.info());

  //=========================================================================
  // CLEAR
  //=========================================================================

  Logger.info("---------- CLEAR ----------");

  manager.clear();

  Logger.info(manager.keys());

  Logger.info(manager.count());

  Logger.info("==================================================");
  Logger.info("UI Theme Manager Test Completed");
  Logger.info("==================================================");

}

function test_207_UIComponentManager() {

  Logger.info("==================================================");

  Logger.info("Workspace ERP Framework - UI Component Manager");

  Logger.info("==================================================");

  const manager = WEF.UI.Core.ComponentManager;

  manager.initialize();

  //=========================================================================
  // REGISTER
  //=========================================================================

  Logger.info("---------- REGISTER ----------");

  manager.register("Button", {}, "Controls");

  manager.register("TextBox", {}, "Controls");

  manager.register("Card", {}, "Containers");

  manager.register("Grid", {}, "Containers");

  Logger.info(manager.keys());

  Logger.info(manager.count());

  //=========================================================================
  // REGISTER MANY
  //=========================================================================

  Logger.info("---------- REGISTER MANY ----------");

  manager.registerMany([

    {

      name: "Chart",

      definition: {},

      category: "Visualization"

    },

    {

      name: "KPI Card",

      definition: {},

      category: "Visualization"

    },

    {

      name: "Toast",

      definition: {},

      category: "Notifications"

    }

  ]);

  Logger.info(manager.keys());

  Logger.info(manager.count());

  Logger.info(manager.categoryKeys());

  //=========================================================================
  // GET
  //=========================================================================

  Logger.info("---------- GET ----------");

  Logger.info(manager.get("Button"));

  Logger.info(manager.getByCategory("Visualization"));

  //=========================================================================
  // ENABLE / DISABLE
  //=========================================================================

  Logger.info("---------- ENABLE / DISABLE ----------");

  manager.disable("Chart");

  Logger.info(manager.get("Chart"));

  manager.enable("Chart");

  Logger.info(manager.get("Chart"));

  //=========================================================================
  // REMOVE
  //=========================================================================

  Logger.info("---------- REMOVE ----------");

  Logger.info(manager.remove("Toast"));

  Logger.info(manager.keys());

  Logger.info(manager.count());

  //=========================================================================
  // INFORMATION
  //=========================================================================

  Logger.info("---------- INFORMATION ----------");

  Logger.info(manager.info());

  //=========================================================================
  // CLEAR
  //=========================================================================

  Logger.info("---------- CLEAR ----------");

  manager.clear();

  Logger.info(manager.keys());

  Logger.info(manager.count());

  Logger.info("==================================================");

  Logger.info("UI Component Manager Test Completed");

  Logger.info("==================================================");

}

function test_208_UILayoutManager() {

  Logger.info("==================================================");
  Logger.info("Workspace ERP Framework - UI Layout Manager");
  Logger.info("==================================================");

  const manager = WEF.UI.Core.LayoutManager;

  manager.initialize();

  //=========================================================================
  // REGISTER
  //=========================================================================

  Logger.info("---------- REGISTER ----------");

  manager.register("default", {

    header: true,

    sidebar: true,

    content: true,

    footer: true

  });

  manager.register("login", {

    header: false,

    sidebar: false,

    content: true,

    footer: false

  });

  Logger.info(manager.keys());

  Logger.info(manager.count());

  //=========================================================================
  // REGISTER MANY
  //=========================================================================

  Logger.info("---------- REGISTER MANY ----------");

  manager.registerMany({

    dashboard: {

      header: true,

      sidebar: true,

      content: true,

      footer: true

    },

    report: {

      header: true,

      sidebar: false,

      content: true,

      footer: true

    }

  });

  Logger.info(manager.keys());

  Logger.info(manager.count());

  //=========================================================================
  // GET
  //=========================================================================

  Logger.info("---------- GET ----------");

  Logger.info(manager.get("default"));

  Logger.info(manager.get("report"));

  //=========================================================================
  // ACTIVE LAYOUT
  //=========================================================================

  Logger.info("---------- ACTIVE LAYOUT ----------");

  Logger.info(manager.getActive());

  manager.setActive("dashboard");

  Logger.info(manager.getActive());

  Logger.info(manager.getActiveLayout());

  //=========================================================================
  // REGIONS
  //=========================================================================

  Logger.info("---------- REGIONS ----------");

  manager.setRegion("header", "Main Header");

  manager.setRegion("sidebar", "Navigation Sidebar");

  manager.setRegion("content", "Dashboard Content");

  manager.setRegion("footer", "Application Footer");

  Logger.info(manager.getRegion("header"));

  Logger.info(manager.getRegions());

  //=========================================================================
  // ENABLE / DISABLE
  //=========================================================================

  Logger.info("---------- ENABLE / DISABLE ----------");

  manager.disable("report");

  Logger.info(manager.get("report"));

  manager.enable("report");

  Logger.info(manager.get("report"));

  //=========================================================================
  // REMOVE
  //=========================================================================

  Logger.info("---------- REMOVE ----------");

  Logger.info(manager.remove("login"));

  Logger.info(manager.keys());

  Logger.info(manager.count());

  //=========================================================================
  // INFORMATION
  //=========================================================================

  Logger.info("---------- INFORMATION ----------");

  Logger.info(manager.info());

  //=========================================================================
  // CLEAR REGIONS
  //=========================================================================

  Logger.info("---------- CLEAR REGIONS ----------");

  manager.clearRegions();

  Logger.info(manager.getRegions());

  //=========================================================================
  // CLEAR
  //=========================================================================

  Logger.info("---------- CLEAR ----------");

  manager.clear();

  Logger.info(manager.keys());

  Logger.info(manager.count());

  Logger.info("==================================================");
  Logger.info("UI Layout Manager Test Completed");
  Logger.info("==================================================");

}

/*==============================================================================
  Test Function
==============================================================================*/

function test_209_UIMenuManager() {

  Logger.info("==================================================");
  Logger.info("Workspace ERP Framework - UI Menu Manager");
  Logger.info("==================================================");

  const manager = WEF.UI.Core.MenuManager;

  manager.initialize();

  //=========================================================================
  // REGISTER
  //=========================================================================

  Logger.info("---------- REGISTER ----------");

  manager.register("dashboard", {

    title: "Dashboard",

    icon: "dashboard",

    route: "/dashboard",

    order: 1

  });

  manager.register("crm", {

    title: "CRM",

    icon: "people",

    route: "/crm",

    order: 2

  });

  manager.register("sales", {

    title: "Sales",

    icon: "shopping_cart",

    route: "/sales",

    order: 3

  });

  Logger.info(manager.keys());

  Logger.info(manager.count());

  //=========================================================================
  // REGISTER MANY
  //=========================================================================

  Logger.info("---------- REGISTER MANY ----------");

  manager.registerMany({

    inventory: {

      title: "Inventory",

      icon: "inventory",

      route: "/inventory",

      order: 4

    },

    accounting: {

      title: "Accounting",

      icon: "payments",

      route: "/accounting",

      order: 5

    },

    settings: {

      title: "Settings",

      icon: "settings",

      route: "/settings",

      order: 99

    }

  });

  Logger.info(manager.keys());

  Logger.info(manager.count());

  //=========================================================================
  // GET
  //=========================================================================

  Logger.info("---------- GET ----------");

  Logger.info(manager.get("dashboard"));

  Logger.info(manager.get("inventory"));

  //=========================================================================
  // ACTIVE MENU
  //=========================================================================

  Logger.info("---------- ACTIVE MENU ----------");

  Logger.info(manager.getActive());

  manager.setActive("sales");

  Logger.info(manager.getActive());

  Logger.info(manager.getActiveMenu());

  //=========================================================================
  // SHOW / HIDE
  //=========================================================================

  Logger.info("---------- SHOW / HIDE ----------");

  manager.hide("settings");

  Logger.info(manager.get("settings"));

  manager.show("settings");

  Logger.info(manager.get("settings"));

  //=========================================================================
  // ENABLE / DISABLE
  //=========================================================================

  Logger.info("---------- ENABLE / DISABLE ----------");

  manager.disable("accounting");

  Logger.info(manager.get("accounting"));

  manager.enable("accounting");

  Logger.info(manager.get("accounting"));

  //=========================================================================
  // REMOVE
  //=========================================================================

  Logger.info("---------- REMOVE ----------");

  Logger.info(manager.remove("settings"));

  Logger.info(manager.keys());

  Logger.info(manager.count());

  //=========================================================================
  // INFORMATION
  //=========================================================================

  Logger.info("---------- INFORMATION ----------");

  Logger.info(manager.info());

  //=========================================================================
  // CLEAR
  //=========================================================================

  Logger.info("---------- CLEAR ----------");

  manager.clear();

  Logger.info(manager.keys());

  Logger.info(manager.count());

  Logger.info("==================================================");
  Logger.info("UI Menu Manager Test Completed");
  Logger.info("==================================================");

}

/*==============================================================================
  Test Function
==============================================================================*/

function test_210_UINavigationManager() {

  Logger.info("==================================================");
  Logger.info("Workspace ERP Framework - UI Navigation Manager");
  Logger.info("==================================================");

  const manager = WEF.UI.Core.NavigationManager;

  manager.initialize();

  //=========================================================================
  // NAVIGATION
  //=========================================================================

  Logger.info("---------- NAVIGATION ----------");

  manager.navigate("dashboard");

  manager.navigate("crm");

  manager.navigate("sales");

  Logger.info(manager.current());

  Logger.info(manager.previous());

  Logger.info(manager.history());

  Logger.info(manager.historyCount());

  //=========================================================================
  // BACK
  //=========================================================================

  Logger.info("---------- BACK ----------");

  manager.back();

  Logger.info(manager.current());

  Logger.info(manager.previous());

  Logger.info(manager.history());

  //=========================================================================
  // BREADCRUMBS
  //=========================================================================

  Logger.info("---------- BREADCRUMBS ----------");

  manager.addBreadcrumb("Home", "/");

  manager.addBreadcrumb("CRM", "/crm");

  manager.addBreadcrumb("Customers", "/crm/customers");

  Logger.info(manager.breadcrumbs());

  Logger.info(manager.hasBreadcrumbs());

  //=========================================================================
  // HISTORY
  //=========================================================================

  Logger.info("---------- HISTORY ----------");

  Logger.info(manager.hasHistory());

  manager.clearHistory();

  Logger.info(manager.history());

  Logger.info(manager.hasHistory());

  //=========================================================================
  // CLEAR BREADCRUMBS
  //=========================================================================

  Logger.info("---------- CLEAR BREADCRUMBS ----------");

  manager.clearBreadcrumbs();

  Logger.info(manager.breadcrumbs());

  //=========================================================================
  // INFORMATION
  //=========================================================================

  Logger.info("---------- INFORMATION ----------");

  Logger.info(manager.info());

  //=========================================================================
  // RESET
  //=========================================================================

  Logger.info("---------- RESET ----------");

  manager.reset();

  Logger.info(manager.info());

  Logger.info("==================================================");
  Logger.info("UI Navigation Manager Test Completed");
  Logger.info("==================================================");

}

/*==============================================================================
  Test Function
==============================================================================*/

function test_211_UIFormManager() {

  Logger.info("==================================================");
  Logger.info("Workspace ERP Framework - UI Form Manager");
  Logger.info("==================================================");

  const manager = WEF.UI.Core.FormManager;

  manager.initialize();

  //=========================================================================
  // REGISTER
  //=========================================================================

  Logger.info("---------- REGISTER ----------");

  manager.register("CustomerForm", {

    title: "Customer Form",

    fields: {

      customerCode: {},

      customerName: {},

      phone: {},

      email: {}

    },

    validation: {

      customerCode: "required",

      customerName: "required"

    }

  });

  manager.register("SupplierForm", {

    title: "Supplier Form",

    fields: {

      supplierCode: {},

      supplierName: {},

      phone: {},

      email: {}

    }

  });

  Logger.info(manager.keys());

  Logger.info(manager.count());

  //=========================================================================
  // REGISTER MANY
  //=========================================================================

  Logger.info("---------- REGISTER MANY ----------");

  manager.registerMany({

    ProductForm: {

      title: "Product Form",

      fields: {

        sku: {},

        description: {},

        price: {}

      }

    },

    EmployeeForm: {

      title: "Employee Form",

      fields: {

        employeeId: {},

        employeeName: {},

        department: {}

      }

    }

  });

  Logger.info(manager.keys());

  Logger.info(manager.count());

  //=========================================================================
  // GET
  //=========================================================================

  Logger.info("---------- GET ----------");

  Logger.info(manager.get("CustomerForm"));

  Logger.info(manager.get("EmployeeForm"));

  //=========================================================================
  // ACTIVE FORM
  //=========================================================================

  Logger.info("---------- ACTIVE FORM ----------");

  manager.open("CustomerForm");

  Logger.info(manager.active());

  Logger.info(manager.getActiveForm());

  manager.close();

  Logger.info(manager.active());

  //=========================================================================
  // VALIDATE
  //=========================================================================

  Logger.info("---------- VALIDATE ----------");

  Logger.info(

    manager.validate("CustomerForm", {})

  );

  //=========================================================================
  // SUBMIT
  //=========================================================================

  Logger.info("---------- SUBMIT ----------");

  Logger.info(

    manager.submit("CustomerForm", {})

  );

  //=========================================================================
  // RESET
  //=========================================================================

  Logger.info("---------- RESET ----------");

  Logger.info(

    manager.reset("CustomerForm")

  );

  //=========================================================================
  // ENABLE / DISABLE
  //=========================================================================

  Logger.info("---------- ENABLE / DISABLE ----------");

  manager.disable("SupplierForm");

  Logger.info(manager.get("SupplierForm"));

  manager.enable("SupplierForm");

  Logger.info(manager.get("SupplierForm"));

  //=========================================================================
  // REMOVE
  //=========================================================================

  Logger.info("---------- REMOVE ----------");

  Logger.info(

    manager.remove("EmployeeForm")

  );

  Logger.info(manager.keys());

  Logger.info(manager.count());

  //=========================================================================
  // INFORMATION
  //=========================================================================

  Logger.info("---------- INFORMATION ----------");

  Logger.info(manager.info());

  //=========================================================================
  // CLEAR
  //=========================================================================

  Logger.info("---------- CLEAR ----------");

  manager.clear();

  Logger.info(manager.keys());

  Logger.info(manager.count());

  Logger.info("==================================================");
  Logger.info("UI Form Manager Test Completed");
  Logger.info("==================================================");

}

/*==============================================================================
  Test Function
==============================================================================*/

function test_212_UITableManager() {

  Logger.info("==================================================");
  Logger.info("Workspace ERP Framework - UI Table Manager");
  Logger.info("==================================================");

  const manager = WEF.UI.Core.TableManager;

  manager.initialize();

  //=========================================================================
  // REGISTER
  //=========================================================================

  Logger.info("---------- REGISTER ----------");

  manager.register("CustomerTable", {

    title: "Customers",

    columns: [

      "Customer Code",

      "Customer Name",

      "City",

      "Balance"

    ],

    data: [],

    pageSize: 25

  });

  manager.register("ProductTable", {

    title: "Products",

    columns: [

      "SKU",

      "Description",

      "Category",

      "Price"

    ],

    data: [],

    pageSize: 50

  });

  Logger.info(manager.keys());

  Logger.info(manager.count());

  //=========================================================================
  // REGISTER MANY
  //=========================================================================

  Logger.info("---------- REGISTER MANY ----------");

  manager.registerMany({

    SalesTable: {

      title: "Sales",

      columns: [

        "Invoice",

        "Customer",

        "Amount"

      ],

      data: []

    },

    InventoryTable: {

      title: "Inventory",

      columns: [

        "Item",

        "Stock",

        "Location"

      ],

      data: []

    }

  });

  Logger.info(manager.keys());

  Logger.info(manager.count());

  //=========================================================================
  // GET
  //=========================================================================

  Logger.info("---------- GET ----------");

  Logger.info(manager.get("CustomerTable"));

  Logger.info(manager.get("InventoryTable"));

  //=========================================================================
  // ACTIVE TABLE
  //=========================================================================

  Logger.info("---------- ACTIVE TABLE ----------");

  manager.open("CustomerTable");

  Logger.info(manager.active());

  Logger.info(manager.getActiveTable());

  manager.close();

  Logger.info(manager.active());

  //=========================================================================
  // TABLE OPERATIONS
  //=========================================================================

  Logger.info("---------- SORT ----------");

  Logger.info(

    manager.sort(

      "CustomerTable",

      "Customer Name",

      "ASC"

    )

  );

  Logger.info("---------- FILTER ----------");

  Logger.info(

    manager.filter(

      "CustomerTable",

      {

        City: "Lahore"

      }

    )

  );

  Logger.info("---------- REFRESH ----------");

  Logger.info(

    manager.refresh(

      "CustomerTable"

    )

  );

  //=========================================================================
  // ENABLE / DISABLE
  //=========================================================================

  Logger.info("---------- ENABLE / DISABLE ----------");

  manager.disable("ProductTable");

  Logger.info(manager.get("ProductTable"));

  manager.enable("ProductTable");

  Logger.info(manager.get("ProductTable"));

  //=========================================================================
  // REMOVE
  //=========================================================================

  Logger.info("---------- REMOVE ----------");

  Logger.info(

    manager.remove("SalesTable")

  );

  Logger.info(manager.keys());

  Logger.info(manager.count());

  //=========================================================================
  // INFORMATION
  //=========================================================================

  Logger.info("---------- INFORMATION ----------");

  Logger.info(manager.info());

  //=========================================================================
  // CLEAR
  //=========================================================================

  Logger.info("---------- CLEAR ----------");

  manager.clear();

  Logger.info(manager.keys());

  Logger.info(manager.count());

  Logger.info("==================================================");
  Logger.info("UI Table Manager Test Completed");
  Logger.info("==================================================");

}

/*==============================================================================
  Test Function
==============================================================================*/

function test_213_UIDashboardManager() {

  Logger.info("==================================================");
  Logger.info("Workspace ERP Framework - UI Dashboard Manager");
  Logger.info("==================================================");

  const manager = WEF.UI.Core.DashboardManager;

  manager.initialize();

  //=========================================================================
  // REGISTER
  //=========================================================================

  Logger.info("---------- REGISTER ----------");

  manager.register("ExecutiveDashboard", {

    title: "Executive Dashboard",

    widgets: [

      "Sales KPI",

      "Revenue KPI",

      "Cash Flow"

    ],

    layout: "3-column",

    refreshInterval: 300

  });

  manager.register("SalesDashboard", {

    title: "Sales Dashboard",

    widgets: [

      "Sales Chart",

      "Top Customers"

    ],

    layout: "2-column",

    refreshInterval: 180

  });

  Logger.info(manager.keys());

  Logger.info(manager.count());

  //=========================================================================
  // REGISTER MANY
  //=========================================================================

  Logger.info("---------- REGISTER MANY ----------");

  manager.registerMany({

    InventoryDashboard: {

      title: "Inventory Dashboard",

      widgets: [

        "Stock Level",

        "Low Stock",

        "Warehouse"

      ],

      layout: "2-column"

    },

    FinanceDashboard: {

      title: "Finance Dashboard",

      widgets: [

        "Balance Sheet",

        "Profit & Loss"

      ],

      layout: "3-column"

    }

  });

  Logger.info(manager.keys());

  Logger.info(manager.count());

  //=========================================================================
  // GET
  //=========================================================================

  Logger.info("---------- GET ----------");

  Logger.info(manager.get("ExecutiveDashboard"));

  Logger.info(manager.get("FinanceDashboard"));

  //=========================================================================
  // ACTIVE DASHBOARD
  //=========================================================================

  Logger.info("---------- ACTIVE DASHBOARD ----------");

  manager.open("ExecutiveDashboard");

  Logger.info(manager.active());

  Logger.info(manager.getActiveDashboard());

  manager.close();

  Logger.info(manager.active());

  //=========================================================================
  // WIDGETS
  //=========================================================================

  Logger.info("---------- ADD WIDGET ----------");

  manager.addWidget(

    "ExecutiveDashboard",

    "Receivables KPI"

  );

  Logger.info(

    manager.get("ExecutiveDashboard")

  );

  Logger.info("---------- REMOVE WIDGET ----------");

  manager.removeWidget(

    "ExecutiveDashboard",

    "Revenue KPI"

  );

  Logger.info(

    manager.get("ExecutiveDashboard")

  );

  //=========================================================================
  // REFRESH
  //=========================================================================

  Logger.info("---------- REFRESH ----------");

  Logger.info(

    manager.refresh(

      "ExecutiveDashboard"

    )

  );

  //=========================================================================
  // ENABLE / DISABLE
  //=========================================================================

  Logger.info("---------- ENABLE / DISABLE ----------");

  manager.disable("FinanceDashboard");

  Logger.info(manager.get("FinanceDashboard"));

  manager.enable("FinanceDashboard");

  Logger.info(manager.get("FinanceDashboard"));

  //=========================================================================
  // REMOVE
  //=========================================================================

  Logger.info("---------- REMOVE ----------");

  Logger.info(

    manager.remove("SalesDashboard")

  );

  Logger.info(manager.keys());

  Logger.info(manager.count());

  //=========================================================================
  // INFORMATION
  //=========================================================================

  Logger.info("---------- INFORMATION ----------");

  Logger.info(manager.info());

  //=========================================================================
  // CLEAR
  //=========================================================================

  Logger.info("---------- CLEAR ----------");

  manager.clear();

  Logger.info(manager.keys());

  Logger.info(manager.count());

  Logger.info("==================================================");
  Logger.info("UI Dashboard Manager Test Completed");
  Logger.info("==================================================");

}

/*==============================================================================
  Test Function
==============================================================================*/

function test_214_UIReportViewerManager() {

  Logger.info("==================================================");
  Logger.info("Workspace ERP Framework - UI Report Viewer Manager");
  Logger.info("==================================================");

  const manager = WEF.UI.Core.ReportViewerManager;

  manager.initialize();

  //=========================================================================
  // REGISTER
  //=========================================================================

  Logger.info("---------- REGISTER ----------");

  manager.register("SalesReport", {

    title: "Sales Report",

    category: "Sales",

    template: "SalesTemplate",

    exportFormats: [

      "PDF",

      "Excel",

      "CSV"

    ]

  });

  manager.register("InventoryReport", {

    title: "Inventory Report",

    category: "Inventory",

    template: "InventoryTemplate",

    exportFormats: [

      "PDF",

      "Excel"

    ]

  });

  Logger.info(manager.keys());

  Logger.info(manager.count());

  //=========================================================================
  // REGISTER MANY
  //=========================================================================

  Logger.info("---------- REGISTER MANY ----------");

  manager.registerMany({

    FinanceReport: {

      title: "Finance Report",

      category: "Finance",

      template: "FinanceTemplate"

    },

    CustomerReport: {

      title: "Customer Report",

      category: "CRM",

      template: "CustomerTemplate"

    }

  });

  Logger.info(manager.keys());

  Logger.info(manager.count());

  //=========================================================================
  // GET
  //=========================================================================

  Logger.info("---------- GET ----------");

  Logger.info(manager.get("SalesReport"));

  Logger.info(manager.get("FinanceReport"));

  //=========================================================================
  // ACTIVE REPORT
  //=========================================================================

  Logger.info("---------- ACTIVE REPORT ----------");

  manager.open("SalesReport");

  Logger.info(manager.active());

  Logger.info(manager.getActiveReport());

  manager.close();

  Logger.info(manager.active());

  //=========================================================================
  // REPORT OPERATIONS
  //=========================================================================

  Logger.info("---------- RENDER ----------");

  Logger.info(

    manager.render(

      "SalesReport",

      {

        fromDate: "2026-01-01",

        toDate: "2026-12-31"

      }

    )

  );

  Logger.info("---------- EXPORT ----------");

  Logger.info(

    manager.export(

      "SalesReport",

      "PDF"

    )

  );

  Logger.info("---------- REFRESH ----------");

  Logger.info(

    manager.refresh(

      "SalesReport"

    )

  );

  //=========================================================================
  // ENABLE / DISABLE
  //=========================================================================

  Logger.info("---------- ENABLE / DISABLE ----------");

  manager.disable("FinanceReport");

  Logger.info(manager.get("FinanceReport"));

  manager.enable("FinanceReport");

  Logger.info(manager.get("FinanceReport"));

  //=========================================================================
  // REMOVE
  //=========================================================================

  Logger.info("---------- REMOVE ----------");

  Logger.info(

    manager.remove("CustomerReport")

  );

  Logger.info(manager.keys());

  Logger.info(manager.count());

  //=========================================================================
  // INFORMATION
  //=========================================================================

  Logger.info("---------- INFORMATION ----------");

  Logger.info(manager.info());

  //=========================================================================
  // CLEAR
  //=========================================================================

  Logger.info("---------- CLEAR ----------");

  manager.clear();

  Logger.info(manager.keys());

  Logger.info(manager.count());

  Logger.info("==================================================");
  Logger.info("UI Report Viewer Manager Test Completed");
  Logger.info("==================================================");

}

/*==============================================================================
  Test Function
==============================================================================*/

function test_215_UIChartManager() {

  Logger.info("==================================================");
  Logger.info("Workspace ERP Framework - UI Chart Manager");
  Logger.info("==================================================");

  const manager = WEF.UI.Core.ChartManager;

  manager.initialize();

  //=========================================================================
  // REGISTER
  //=========================================================================

  Logger.info("---------- REGISTER ----------");

  manager.register("SalesChart", {

    title: "Monthly Sales",

    type: "bar",

    dataset: [

      { month: "Jan", value: 120000 },

      { month: "Feb", value: 145000 }

    ]

  });

  manager.register("RevenueChart", {

    title: "Revenue Trend",

    type: "line",

    dataset: [

      { month: "Jan", value: 250000 },

      { month: "Feb", value: 275000 }

    ]

  });

  Logger.info(manager.keys());

  Logger.info(manager.count());

  //=========================================================================
  // REGISTER MANY
  //=========================================================================

  Logger.info("---------- REGISTER MANY ----------");

  manager.registerMany({

    InventoryChart: {

      title: "Inventory Status",

      type: "pie",

      dataset: [

        { label: "Available", value: 820 },

        { label: "Reserved", value: 95 }

      ]

    },

    CustomerChart: {

      title: "Customers by Region",

      type: "doughnut",

      dataset: [

        { label: "North", value: 120 },

        { label: "South", value: 85 }

      ]

    }

  });

  Logger.info(manager.keys());

  Logger.info(manager.count());

  //=========================================================================
  // GET
  //=========================================================================

  Logger.info("---------- GET ----------");

  Logger.info(manager.get("SalesChart"));

  Logger.info(manager.get("CustomerChart"));

  //=========================================================================
  // ACTIVE CHART
  //=========================================================================

  Logger.info("---------- ACTIVE CHART ----------");

  manager.open("SalesChart");

  Logger.info(manager.active());

  Logger.info(manager.getActiveChart());

  manager.close();

  Logger.info(manager.active());

  //=========================================================================
  // CHART OPERATIONS
  //=========================================================================

  Logger.info("---------- RENDER ----------");

  Logger.info(

    manager.render(

      "SalesChart"

    )

  );

  Logger.info("---------- REFRESH ----------");

  Logger.info(

    manager.refresh(

      "SalesChart"

    )

  );

  Logger.info("---------- UPDATE DATASET ----------");

  Logger.info(

    manager.updateDataset(

      "SalesChart",

      [

        { month: "Mar", value: 190000 },

        { month: "Apr", value: 215000 }

      ]

    )

  );

  Logger.info(manager.get("SalesChart"));

  //=========================================================================
  // ENABLE / DISABLE
  //=========================================================================

  Logger.info("---------- ENABLE / DISABLE ----------");

  manager.disable("RevenueChart");

  Logger.info(manager.get("RevenueChart"));

  manager.enable("RevenueChart");

  Logger.info(manager.get("RevenueChart"));

  //=========================================================================
  // REMOVE
  //=========================================================================

  Logger.info("---------- REMOVE ----------");

  Logger.info(

    manager.remove("CustomerChart")

  );

  Logger.info(manager.keys());

  Logger.info(manager.count());

  //=========================================================================
  // INFORMATION
  //=========================================================================

  Logger.info("---------- INFORMATION ----------");

  Logger.info(manager.info());

  //=========================================================================
  // CLEAR
  //=========================================================================

  Logger.info("---------- CLEAR ----------");

  manager.clear();

  Logger.info(manager.keys());

  Logger.info(manager.count());

  Logger.info("==================================================");
  Logger.info("UI Chart Manager Test Completed");
  Logger.info("==================================================");

}

/*==============================================================================
  Test Function
==============================================================================*/

function test_216_UINotificationManager() {

  Logger.info("==================================================");
  Logger.info("Workspace ERP Framework - UI Notification Manager");
  Logger.info("==================================================");

  const manager = WEF.UI.Core.NotificationManager;

  manager.initialize();

  //=========================================================================
  // REGISTER
  //=========================================================================

  Logger.info("---------- REGISTER ----------");

  manager.register("SaveSuccess", {

    title: "Saved Successfully",

    message: "Record has been saved successfully.",

    type: "success",

    duration: 3000

  });

  manager.register("DeleteWarning", {

    title: "Delete Confirmation",

    message: "This action cannot be undone.",

    type: "warning",

    duration: 5000

  });

  Logger.info(manager.keys());

  Logger.info(manager.count());

  //=========================================================================
  // REGISTER MANY
  //=========================================================================

  Logger.info("---------- REGISTER MANY ----------");

  manager.registerMany({

    LoginFailed: {

      title: "Login Failed",

      message: "Invalid username or password.",

      type: "error"

    },

    SessionExpired: {

      title: "Session Expired",

      message: "Please login again.",

      type: "info"

    }

  });

  Logger.info(manager.keys());

  Logger.info(manager.count());

  //=========================================================================
  // GET
  //=========================================================================

  Logger.info("---------- GET ----------");

  Logger.info(manager.get("SaveSuccess"));

  Logger.info(manager.get("SessionExpired"));

  //=========================================================================
  // ACTIVE NOTIFICATION
  //=========================================================================

  Logger.info("---------- ACTIVE NOTIFICATION ----------");

  manager.show("SaveSuccess");

  Logger.info(manager.active());

  Logger.info(manager.getActiveNotification());

  manager.hide();

  Logger.info(manager.active());

  //=========================================================================
  // NOTIFICATION OPERATIONS
  //=========================================================================

  Logger.info("---------- SUCCESS ----------");

  manager.success("Customer saved successfully.");

  Logger.info("---------- WARNING ----------");

  manager.warning("Inventory level is low.");

  Logger.info("---------- ERROR ----------");

  manager.error("Unable to connect to the server.");

  Logger.info("---------- INFO ----------");

  manager.infoMessage("Daily backup completed.");

  Logger.info("---------- CUSTOM ----------");

  manager.notify(

    "Framework",

    "Workspace ERP Framework initialized successfully.",

    "success"

  );

  //=========================================================================
  // ENABLE / DISABLE
  //=========================================================================

  Logger.info("---------- ENABLE / DISABLE ----------");

  manager.disable("DeleteWarning");

  Logger.info(manager.get("DeleteWarning"));

  manager.enable("DeleteWarning");

  Logger.info(manager.get("DeleteWarning"));

  //=========================================================================
  // REMOVE
  //=========================================================================

  Logger.info("---------- REMOVE ----------");

  Logger.info(manager.remove("SessionExpired"));

  Logger.info(manager.keys());

  Logger.info(manager.count());

  //=========================================================================
  // INFORMATION
  //=========================================================================

  Logger.info("---------- INFORMATION ----------");

  Logger.info(manager.info());

  //=========================================================================
  // CLEAR
  //=========================================================================

  Logger.info("---------- CLEAR ----------");

  manager.clear();

  Logger.info(manager.keys());

  Logger.info(manager.count());

  Logger.info("==================================================");
  Logger.info("UI Notification Manager Test Completed");
  Logger.info("==================================================");

}

/*==============================================================================
  Test Function
==============================================================================*/

function test_217_UIDialogManager() {

  Logger.info("==================================================");
  Logger.info("Workspace ERP Framework - UI Dialog Manager");
  Logger.info("==================================================");

  const manager = WEF.UI.Core.DialogManager;

  manager.initialize();

  //=========================================================================
  // REGISTER
  //=========================================================================

  Logger.info("---------- REGISTER ----------");

  manager.register("CustomerDialog", {

    title: "Customer Details",

    message: "Customer information dialog.",

    type: "modal",

    width: 700,

    height: 500

  });

  manager.register("DeleteDialog", {

    title: "Delete Confirmation",

    message: "Are you sure you want to delete this record?",

    type: "confirm"

  });

  Logger.info(manager.keys());

  Logger.info(manager.count());

  //=========================================================================
  // REGISTER MANY
  //=========================================================================

  Logger.info("---------- REGISTER MANY ----------");

  manager.registerMany({

    ProgressDialog: {

      title: "Processing",

      message: "Please wait...",

      type: "progress"

    },

    LoginPrompt: {

      title: "Login Required",

      message: "Please enter your credentials.",

      type: "prompt"

    }

  });

  Logger.info(manager.keys());

  Logger.info(manager.count());

  //=========================================================================
  // GET
  //=========================================================================

  Logger.info("---------- GET ----------");

  Logger.info(manager.get("CustomerDialog"));

  Logger.info(manager.get("ProgressDialog"));

  //=========================================================================
  // ACTIVE DIALOG
  //=========================================================================

  Logger.info("---------- ACTIVE DIALOG ----------");

  manager.open("CustomerDialog");

  Logger.info(manager.active());

  Logger.info(manager.getActiveDialog());

  manager.close();

  Logger.info(manager.active());

  //=========================================================================
  // DIALOG OPERATIONS
  //=========================================================================

  Logger.info("---------- CONFIRM ----------");

  Logger.info(

    manager.confirm(

      "Delete Record",

      "Do you really want to continue?"

    )

  );

  Logger.info("---------- PROMPT ----------");

  Logger.info(

    manager.prompt(

      "Customer Code",

      "Enter Customer Code:",

      "CUST-001"

    )

  );

  Logger.info("---------- PROGRESS ----------");

  Logger.info(

    manager.progress(

      "Importing Data",

      75

    )

  );

  Logger.info("---------- ALERT ----------");

  Logger.info(

    manager.alert(

      "Completed",

      "Operation completed successfully."

    )

  );

  //=========================================================================
  // ENABLE / DISABLE
  //=========================================================================

  Logger.info("---------- ENABLE / DISABLE ----------");

  manager.disable("DeleteDialog");

  Logger.info(manager.get("DeleteDialog"));

  manager.enable("DeleteDialog");

  Logger.info(manager.get("DeleteDialog"));

  //=========================================================================
  // REMOVE
  //=========================================================================

  Logger.info("---------- REMOVE ----------");

  Logger.info(

    manager.remove("LoginPrompt")

  );

  Logger.info(manager.keys());

  Logger.info(manager.count());

  //=========================================================================
  // INFORMATION
  //=========================================================================

  Logger.info("---------- INFORMATION ----------");

  Logger.info(manager.info());

  //=========================================================================
  // CLEAR
  //=========================================================================

  Logger.info("---------- CLEAR ----------");

  manager.clear();

  Logger.info(manager.keys());

  Logger.info(manager.count());

  Logger.info("==================================================");
  Logger.info("UI Dialog Manager Test Completed");
  Logger.info("==================================================");

}

/*==============================================================================
  Test Function
==============================================================================*/

function test_218_UISidebarManager() {

  Logger.info("==================================================");
  Logger.info("Workspace ERP Framework - UI Sidebar Manager");
  Logger.info("==================================================");

  const manager = WEF.UI.Core.SidebarManager;

  manager.initialize();

  //=========================================================================
  // REGISTER
  //=========================================================================

  Logger.info("---------- REGISTER ----------");

  manager.register("MainSidebar", {

    title: "Main Navigation",

    position: "left",

    width: 300,

    sections: [

      "Dashboard",

      "Sales",

      "Inventory",

      "CRM"

    ]

  });

  manager.register("SettingsSidebar", {

    title: "Settings",

    position: "right",

    width: 350,

    sections: [

      "General",

      "Security",

      "Appearance"

    ]

  });

  Logger.info(manager.keys());

  Logger.info(manager.count());

  //=========================================================================
  // REGISTER MANY
  //=========================================================================

  Logger.info("---------- REGISTER MANY ----------");

  manager.registerMany({

    ReportsSidebar: {

      title: "Reports",

      position: "left",

      sections: [

        "Sales Reports",

        "Finance Reports",

        "HR Reports"

      ]

    },

    HelpSidebar: {

      title: "Help Center",

      position: "right",

      sections: [

        "Documentation",

        "Tutorials",

        "Support"

      ]

    }

  });

  Logger.info(manager.keys());

  Logger.info(manager.count());

  //=========================================================================
  // GET
  //=========================================================================

  Logger.info("---------- GET ----------");

  Logger.info(manager.get("MainSidebar"));

  Logger.info(manager.get("HelpSidebar"));

  //=========================================================================
  // ACTIVE SIDEBAR
  //=========================================================================

  Logger.info("---------- ACTIVE SIDEBAR ----------");

  manager.open("MainSidebar");

  Logger.info(manager.active());

  Logger.info(manager.getActiveSidebar());

  manager.close();

  Logger.info(manager.active());

  //=========================================================================
  // SIDEBAR OPERATIONS
  //=========================================================================

  Logger.info("---------- COLLAPSE ----------");

  Logger.info(

    manager.collapse(

      "MainSidebar"

    )

  );

  Logger.info(manager.get("MainSidebar"));

  Logger.info("---------- EXPAND ----------");

  Logger.info(

    manager.expand(

      "MainSidebar"

    )

  );

  Logger.info(manager.get("MainSidebar"));

  Logger.info("---------- TOGGLE ----------");

  Logger.info(

    manager.toggle(

      "MainSidebar"

    )

  );

  Logger.info(manager.get("MainSidebar"));

  //=========================================================================
  // ENABLE / DISABLE
  //=========================================================================

  Logger.info("---------- ENABLE / DISABLE ----------");

  manager.disable("SettingsSidebar");

  Logger.info(manager.get("SettingsSidebar"));

  manager.enable("SettingsSidebar");

  Logger.info(manager.get("SettingsSidebar"));

  //=========================================================================
  // REMOVE
  //=========================================================================

  Logger.info("---------- REMOVE ----------");

  Logger.info(

    manager.remove("HelpSidebar")

  );

  Logger.info(manager.keys());

  Logger.info(manager.count());

  //=========================================================================
  // INFORMATION
  //=========================================================================

  Logger.info("---------- INFORMATION ----------");

  Logger.info(manager.info());

  //=========================================================================
  // CLEAR
  //=========================================================================

  Logger.info("---------- CLEAR ----------");

  manager.clear();

  Logger.info(manager.keys());

  Logger.info(manager.count());

  Logger.info("==================================================");
  Logger.info("UI Sidebar Manager Test Completed");
  Logger.info("==================================================");

}

/*==============================================================================
  Test Function
==============================================================================*/

function test_219_UIHTMLTemplateManager() {

  Logger.info("==================================================");
  Logger.info("Workspace ERP Framework - UI HTML Template Manager");
  Logger.info("==================================================");

  const manager = WEF.UI.Core.HTMLTemplateManager;

  manager.initialize();

  //=========================================================================
  // REGISTER
  //=========================================================================

  Logger.info("---------- REGISTER ----------");

  manager.register("DashboardTemplate", {

    title: "Dashboard",

    file: "Dashboard",

    cacheable: true,

    version: "1.0.0"

  });

  manager.register("SalesTemplate", {

    title: "Sales",

    file: "Sales",

    cacheable: true,

    version: "1.0.0"

  });

  Logger.info(manager.keys());

  Logger.info(manager.count());

  //=========================================================================
  // REGISTER MANY
  //=========================================================================

  Logger.info("---------- REGISTER MANY ----------");

  manager.registerMany({

    CustomerTemplate: {

      title: "Customer",

      file: "Customer"

    },

    InventoryTemplate: {

      title: "Inventory",

      file: "Inventory"

    }

  });

  Logger.info(manager.keys());

  Logger.info(manager.count());

  //=========================================================================
  // GET
  //=========================================================================

  Logger.info("---------- GET ----------");

  Logger.info(manager.get("DashboardTemplate"));

  Logger.info(manager.get("CustomerTemplate"));

  //=========================================================================
  // ACTIVE TEMPLATE
  //=========================================================================

  Logger.info("---------- ACTIVE TEMPLATE ----------");

  manager.open("DashboardTemplate");

  Logger.info(manager.active());

  Logger.info(manager.getActiveTemplate());

  manager.close();

  Logger.info(manager.active());

  //=========================================================================
  // TEMPLATE OPERATIONS
  //=========================================================================

  Logger.info("---------- CACHE ----------");

  Logger.info(

    manager.cache(

      "DashboardTemplate"

    )

  );

  Logger.info(manager.get("DashboardTemplate"));

  Logger.info("---------- CLEAR CACHE ----------");

  Logger.info(

    manager.clearCache(

      "DashboardTemplate"

    )

  );

  Logger.info(manager.get("DashboardTemplate"));

  Logger.info("---------- RENDER ----------");

  Logger.info(

    manager.render(

      "DashboardTemplate",

      {}

    )

  );

  //=========================================================================
  // ENABLE / DISABLE
  //=========================================================================

  Logger.info("---------- ENABLE / DISABLE ----------");

  manager.disable("SalesTemplate");

  Logger.info(manager.get("SalesTemplate"));

  manager.enable("SalesTemplate");

  Logger.info(manager.get("SalesTemplate"));

  //=========================================================================
  // REMOVE
  //=========================================================================

  Logger.info("---------- REMOVE ----------");

  Logger.info(

    manager.remove("InventoryTemplate")

  );

  Logger.info(manager.keys());

  Logger.info(manager.count());

  //=========================================================================
  // INFORMATION
  //=========================================================================

  Logger.info("---------- INFORMATION ----------");

  Logger.info(manager.info());

  //=========================================================================
  // CLEAR
  //=========================================================================

  Logger.info("---------- CLEAR ----------");

  manager.clear();

  Logger.info(manager.keys());

  Logger.info(manager.count());

  Logger.info("==================================================");
  Logger.info("UI HTML Template Manager Test Completed");
  Logger.info("==================================================");

}

/*==============================================================================
  Test Function
==============================================================================*/

function test_220_UIFrameworkManager() {

  Logger.info("==================================================");
  Logger.info("Workspace ERP Framework - UI Framework Manager");
  Logger.info("==================================================");

  const framework = WEF.UI.Framework;

  //=========================================================================
  // INITIALIZE
  //=========================================================================

  Logger.info("---------- INITIALIZE ----------");

  framework.initialize();

  Logger.info(framework.runtime());

  //=========================================================================
  // BOOT
  //=========================================================================

  Logger.info("---------- BOOT ----------");

  framework.boot();

  Logger.info(framework.runtime());

  //=========================================================================
  // START
  //=========================================================================

  Logger.info("---------- START ----------");

  framework.start();

  Logger.info(framework.runtime());

  //=========================================================================
  // MANAGER ACCESS
  //=========================================================================

  Logger.info("---------- MANAGERS ----------");

  Logger.info(framework.managers());

  Logger.info(framework.manager("router"));

  Logger.info(framework.manager("dashboardManager"));

  Logger.info(framework.manager("notificationManager"));

  //=========================================================================
  // VERSION
  //=========================================================================

  Logger.info("---------- VERSION ----------");

  Logger.info(framework.version());

  //=========================================================================
  // BOOT TIME
  //=========================================================================

  Logger.info("---------- BOOT TIME ----------");

  Logger.info(framework.bootTime());

  //=========================================================================
  // RESTART
  //=========================================================================

  Logger.info("---------- RESTART ----------");

  framework.restart();

  Logger.info(framework.runtime());

  //=========================================================================
  // STOP
  //=========================================================================

  Logger.info("---------- STOP ----------");

  framework.stop();

  Logger.info(framework.runtime());

  //=========================================================================
  // INFORMATION
  //=========================================================================

  Logger.info("---------- INFORMATION ----------");

  Logger.info(framework.info());

  //=========================================================================
  // RESET
  //=========================================================================

  Logger.info("---------- RESET ----------");

  framework.reset();

  Logger.info(framework.runtime());

  Logger.info("==================================================");
  Logger.info("UI Framework Manager Test Completed");
  Logger.info("==================================================");

}

/*==============================================================================
  Test Function
==============================================================================*/

function test_300_Login() {

  Logger.info("==================================================");
  Logger.info("Workspace ERP - Login Application");
  Logger.info("==================================================");

  const login = WEF.App.Login;

  //=========================================================================
  // INITIALIZE
  //=========================================================================

  Logger.info("---------- INITIALIZE ----------");

  login.initialize();

  Logger.info(login.runtime());

  //=========================================================================
  // BOOT
  //=========================================================================

  Logger.info("---------- BOOT ----------");

  login.boot();

  Logger.info(login.runtime());

  //=========================================================================
  // COMPANY
  //=========================================================================

  Logger.info("---------- COMPANY ----------");

  login.selectCompany("ALAZIZ");

  Logger.info(login.company());

  //=========================================================================
  // SETTINGS
  //=========================================================================

  Logger.info("---------- SETTINGS ----------");

  login.rememberMe(true);

  login.language("en");

  login.theme("light");

  Logger.info(login.runtime());

  //=========================================================================
  // LOGIN
  //=========================================================================

  Logger.info("---------- LOGIN ----------");

  Logger.info(

    login.login(

      "admin",

      "admin123"

    )

  );

  Logger.info(login.runtime());

  //=========================================================================
  // HOME DASHBOARD
  //=========================================================================

  Logger.info("---------- HOME DASHBOARD ----------");

  Logger.info(login.openHomeDashboard());

  //=========================================================================
  // INFORMATION
  //=========================================================================

  Logger.info("---------- INFORMATION ----------");

  Logger.info(login.info());

  //=========================================================================
  // LOGOUT
  //=========================================================================

  Logger.info("---------- LOGOUT ----------");

  login.logout();

  Logger.info(login.runtime());

  //=========================================================================
  // RESET
  //=========================================================================

  Logger.info("---------- RESET ----------");

  login.reset();

  Logger.info(login.runtime());

  Logger.info("==================================================");
  Logger.info("Login Application Test Completed");
  Logger.info("==================================================");

}

/*==============================================================================
  Test Function
==============================================================================*/

function test_301_HomeDashboard() {

  Logger.info("==================================================");
  Logger.info("Workspace ERP - Home Dashboard");
  Logger.info("==================================================");

  const dashboard = WEF.App.HomeDashboard;

  //=========================================================================
  // INITIALIZE
  //=========================================================================

  Logger.info("---------- INITIALIZE ----------");

  dashboard.initialize();

  Logger.info(dashboard.runtime());

  //=========================================================================
  // BOOT
  //=========================================================================

  Logger.info("---------- BOOT ----------");

  dashboard.boot();

  Logger.info(dashboard.runtime());

  //=========================================================================
  // START
  //=========================================================================

  Logger.info("---------- START ----------");

  dashboard.start();

  Logger.info(dashboard.runtime());

  //=========================================================================
  // WIDGETS
  //=========================================================================

  Logger.info("---------- WIDGETS ----------");

  Logger.info(dashboard.widgets());

  //=========================================================================
  // KPI
  //=========================================================================

  Logger.info("---------- KPIs ----------");

  Logger.info(dashboard.kpis());

  //=========================================================================
  // SHORTCUTS
  //=========================================================================

  Logger.info("---------- SHORTCUTS ----------");

  Logger.info(dashboard.shortcuts());

  //=========================================================================
  // NOTIFICATIONS
  //=========================================================================

  Logger.info("---------- NOTIFICATIONS ----------");

  Logger.info(dashboard.notifications());

  //=========================================================================
  // OPEN MODULE
  //=========================================================================

  Logger.info("---------- OPEN MODULE ----------");

  Logger.info(dashboard.openModule("CRM"));

  Logger.info(dashboard.openModule("Sales"));

  Logger.info(dashboard.openModule("Inventory"));

  //=========================================================================
  // REFRESH
  //=========================================================================

  Logger.info("---------- REFRESH ----------");

  dashboard.refresh();

  Logger.info(dashboard.runtime());

  //=========================================================================
  // RESTART
  //=========================================================================

  Logger.info("---------- RESTART ----------");

  dashboard.restart();

  Logger.info(dashboard.runtime());

  //=========================================================================
  // STOP
  //=========================================================================

  Logger.info("---------- STOP ----------");

  dashboard.stop();

  Logger.info(dashboard.runtime());

  //=========================================================================
  // INFORMATION
  //=========================================================================

  Logger.info("---------- INFORMATION ----------");

  Logger.info(dashboard.info());

  //=========================================================================
  // RESET
  //=========================================================================

  Logger.info("---------- RESET ----------");

  dashboard.reset();

  Logger.info(dashboard.runtime());

  Logger.info("==================================================");
  Logger.info("Home Dashboard Test Completed");
  Logger.info("==================================================");

}

/*==============================================================================
  Test Function
==============================================================================*/

function test_302_CRM() {

  Logger.info("==================================================");
  Logger.info("Workspace ERP - CRM Workspace");
  Logger.info("==================================================");

  const crm = WEF.App.CRM;

  //=========================================================================
  // INITIALIZE
  //=========================================================================

  Logger.info("---------- INITIALIZE ----------");

  crm.initialize();

  Logger.info(crm.runtime());

  //=========================================================================
  // BOOT
  //=========================================================================

  Logger.info("---------- BOOT ----------");

  crm.boot();

  Logger.info(crm.runtime());

  //=========================================================================
  // START
  //=========================================================================

  Logger.info("---------- START ----------");

  crm.start();

  Logger.info(crm.runtime());

  //=========================================================================
  // DASHBOARD
  //=========================================================================

  Logger.info("---------- DASHBOARD ----------");

  Logger.info(crm.dashboard());

  //=========================================================================
  // CUSTOMERS
  //=========================================================================

  Logger.info("---------- CUSTOMERS ----------");

  Logger.info(crm.customers());

  Logger.info(crm.openCustomers());

  //=========================================================================
  // CONTACTS
  //=========================================================================

  Logger.info("---------- CONTACTS ----------");

  Logger.info(crm.contacts());

  Logger.info(crm.openContacts());

  //=========================================================================
  // LEADS
  //=========================================================================

  Logger.info("---------- LEADS ----------");

  Logger.info(crm.leads());

  Logger.info(crm.openLeads());

  //=========================================================================
  // OPPORTUNITIES
  //=========================================================================

  Logger.info("---------- OPPORTUNITIES ----------");

  Logger.info(crm.opportunities());

  Logger.info(crm.openOpportunities());

  //=========================================================================
  // ACTIVITIES
  //=========================================================================

  Logger.info("---------- ACTIVITIES ----------");

  Logger.info(crm.activities());

  Logger.info(crm.openActivities());

  //=========================================================================
  // REFRESH
  //=========================================================================

  Logger.info("---------- REFRESH ----------");

  crm.refresh();

  Logger.info(crm.runtime());

  //=========================================================================
  // RESTART
  //=========================================================================

  Logger.info("---------- RESTART ----------");

  crm.restart();

  Logger.info(crm.runtime());

  //=========================================================================
  // STOP
  //=========================================================================

  Logger.info("---------- STOP ----------");

  crm.stop();

  Logger.info(crm.runtime());

  //=========================================================================
  // INFORMATION
  //=========================================================================

  Logger.info("---------- INFORMATION ----------");

  Logger.info(crm.info());

  //=========================================================================
  // RESET
  //=========================================================================

  Logger.info("---------- RESET ----------");

  crm.reset();

  Logger.info(crm.runtime());

  Logger.info("==================================================");
  Logger.info("CRM Workspace Test Completed");
  Logger.info("==================================================");

}

function test_303_Sales() {

  Logger.info("==================================================");
  Logger.info("Workspace ERP - Sales Workspace");
  Logger.info("==================================================");

  const sales = WEF.App.Sales;

  sales.initialize();

  sales.boot();

  sales.start();

  Logger.info(sales.dashboard());

  Logger.info(sales.openQuotations());

  Logger.info(sales.openSalesOrders());

  Logger.info(sales.openDeliveries());

  Logger.info(sales.openInvoices());

  Logger.info(sales.openCustomers());

  Logger.info(sales.openReceivables());

  Logger.info(sales.openReports());

  sales.refresh();

  Logger.info(sales.info());

  sales.stop();

  sales.reset();

  Logger.info("==================================================");
  Logger.info("Sales Workspace Test Completed");
  Logger.info("==================================================");

}

function test_304_Purchase() {

  Logger.info("==================================================");
  Logger.info("Workspace ERP - Purchase Workspace");
  Logger.info("==================================================");

  const purchase = WEF.App.Purchase;

  //=========================================================================
  // INITIALIZE
  //=========================================================================

  purchase.initialize();

  Logger.info(purchase.runtime());

  //=========================================================================
  // BOOT
  //=========================================================================

  purchase.boot();

  Logger.info(purchase.runtime());

  //=========================================================================
  // START
  //=========================================================================

  purchase.start();

  Logger.info(purchase.runtime());

  //=========================================================================
  // DASHBOARD
  //=========================================================================

  Logger.info("---------- DASHBOARD ----------");

  Logger.info(purchase.dashboard());

  //=========================================================================
  // NAVIGATION
  //=========================================================================

  Logger.info("---------- SUPPLIERS ----------");

  Logger.info(purchase.openSuppliers());

  Logger.info("---------- RFQs ----------");

  Logger.info(purchase.openRFQs());

  Logger.info("---------- PURCHASE ORDERS ----------");

  Logger.info(purchase.openPurchaseOrders());

  Logger.info("---------- GOODS RECEIPTS ----------");

  Logger.info(purchase.openGoodsReceipts());

  Logger.info("---------- VENDOR BILLS ----------");

  Logger.info(purchase.openVendorBills());

  Logger.info("---------- PAYMENTS ----------");

  Logger.info(purchase.openPayments());

  Logger.info("---------- REPORTS ----------");

  Logger.info(purchase.openReports());

  //=========================================================================
  // REFRESH
  //=========================================================================

  purchase.refresh();

  Logger.info(purchase.runtime());

  //=========================================================================
  // INFORMATION
  //=========================================================================

  Logger.info("---------- INFORMATION ----------");

  Logger.info(purchase.info());

  //=========================================================================
  // STOP
  //=========================================================================

  purchase.stop();

  Logger.info(purchase.runtime());

  //=========================================================================
  // RESET
  //=========================================================================

  purchase.reset();

  Logger.info(purchase.runtime());

  Logger.info("==================================================");
  Logger.info("Purchase Workspace Test Completed");
  Logger.info("==================================================");

}

function test_305_Inventory() {

  Logger.info("==================================================");
  Logger.info("Workspace ERP - Inventory Workspace");
  Logger.info("==================================================");

  const inventory = WEF.App.Inventory;

  //=========================================================================
  // INITIALIZE
  //=========================================================================

  inventory.initialize();

  Logger.info(inventory.runtime());

  //=========================================================================
  // BOOT
  //=========================================================================

  inventory.boot();

  Logger.info(inventory.runtime());

  //=========================================================================
  // START
  //=========================================================================

  inventory.start();

  Logger.info(inventory.runtime());

  //=========================================================================
  // DASHBOARD
  //=========================================================================

  Logger.info("---------- DASHBOARD ----------");

  Logger.info(inventory.dashboard());

  //=========================================================================
  // NAVIGATION
  //=========================================================================

  Logger.info("---------- PRODUCTS ----------");

  Logger.info(inventory.openProducts());

  Logger.info("---------- WAREHOUSES ----------");

  Logger.info(inventory.openWarehouses());

  Logger.info("---------- STOCK MOVEMENTS ----------");

  Logger.info(inventory.openStockMovements());

  Logger.info("---------- TRANSFERS ----------");

  Logger.info(inventory.openTransfers());

  Logger.info("---------- ADJUSTMENTS ----------");

  Logger.info(inventory.openAdjustments());

  Logger.info("---------- STOCK VALUATION ----------");

  Logger.info(inventory.openStockValuation());

  Logger.info("---------- REPORTS ----------");

  Logger.info(inventory.openReports());

  //=========================================================================
  // REFRESH
  //=========================================================================

  inventory.refresh();

  Logger.info(inventory.runtime());

  //=========================================================================
  // INFORMATION
  //=========================================================================

  Logger.info("---------- INFORMATION ----------");

  Logger.info(inventory.info());

  //=========================================================================
  // STOP
  //=========================================================================

  inventory.stop();

  Logger.info(inventory.runtime());

  //=========================================================================
  // RESET
  //=========================================================================

  inventory.reset();

  Logger.info(inventory.runtime());

  Logger.info("==================================================");
  Logger.info("Inventory Workspace Test Completed");
  Logger.info("==================================================");

}

function test_306_Accounting() {

  Logger.info("==================================================");
  Logger.info("Workspace ERP - Accounting Workspace");
  Logger.info("==================================================");

  const accounting = WEF.App.Accounting;

  //=========================================================================
  // INITIALIZE
  //=========================================================================

  accounting.initialize();

  Logger.info(accounting.runtime());

  //=========================================================================
  // BOOT
  //=========================================================================

  accounting.boot();

  Logger.info(accounting.runtime());

  //=========================================================================
  // START
  //=========================================================================

  accounting.start();

  Logger.info(accounting.runtime());

  //=========================================================================
  // DASHBOARD
  //=========================================================================

  Logger.info("---------- DASHBOARD ----------");

  Logger.info(accounting.dashboard());

  //=========================================================================
  // NAVIGATION
  //=========================================================================

  Logger.info("---------- CHART OF ACCOUNTS ----------");

  Logger.info(accounting.openChartOfAccounts());

  Logger.info("---------- JOURNAL ENTRIES ----------");

  Logger.info(accounting.openJournalEntries());

  Logger.info("---------- RECEIVABLES ----------");

  Logger.info(accounting.openReceivables());

  Logger.info("---------- PAYABLES ----------");

  Logger.info(accounting.openPayables());

  Logger.info("---------- BANK ACCOUNTS ----------");

  Logger.info(accounting.openBankAccounts());

  Logger.info("---------- GENERAL LEDGER ----------");

  Logger.info(accounting.openGeneralLedger());

  Logger.info("---------- FINANCIAL STATEMENTS ----------");

  Logger.info(accounting.openFinancialStatements());

  Logger.info("---------- REPORTS ----------");

  Logger.info(accounting.openReports());

  //=========================================================================
  // REFRESH
  //=========================================================================

  accounting.refresh();

  Logger.info(accounting.runtime());

  //=========================================================================
  // INFORMATION
  //=========================================================================

  Logger.info("---------- INFORMATION ----------");

  Logger.info(accounting.info());

  //=========================================================================
  // STOP
  //=========================================================================

  accounting.stop();

  Logger.info(accounting.runtime());

  //=========================================================================
  // RESET
  //=========================================================================

  accounting.reset();

  Logger.info(accounting.runtime());

  Logger.info("==================================================");
  Logger.info("Accounting Workspace Test Completed");
  Logger.info("==================================================");

}

function test_307_HR() {

  Logger.info("==================================================");
  Logger.info("Workspace ERP - HR Workspace");
  Logger.info("==================================================");

  const hr = WEF.App.HR;

  //=========================================================================
  // INITIALIZE
  //=========================================================================

  hr.initialize();

  Logger.info(hr.runtime());

  //=========================================================================
  // BOOT
  //=========================================================================

  hr.boot();

  Logger.info(hr.runtime());

  //=========================================================================
  // START
  //=========================================================================

  hr.start();

  Logger.info(hr.runtime());

  //=========================================================================
  // DASHBOARD
  //=========================================================================

  Logger.info("---------- DASHBOARD ----------");

  Logger.info(hr.dashboard());

  //=========================================================================
  // NAVIGATION
  //=========================================================================

  Logger.info("---------- EMPLOYEES ----------");

  Logger.info(hr.openEmployees());

  Logger.info("---------- DEPARTMENTS ----------");

  Logger.info(hr.openDepartments());

  Logger.info("---------- ATTENDANCE ----------");

  Logger.info(hr.openAttendance());

  Logger.info("---------- LEAVE REQUESTS ----------");

  Logger.info(hr.openLeaveRequests());

  Logger.info("---------- PAYROLL ----------");

  Logger.info(hr.openPayroll());

  Logger.info("---------- RECRUITMENT ----------");

  Logger.info(hr.openRecruitment());

  Logger.info("---------- PERFORMANCE ----------");

  Logger.info(hr.openPerformance());

  Logger.info("---------- REPORTS ----------");

  Logger.info(hr.openReports());

  //=========================================================================
  // REFRESH
  //=========================================================================

  hr.refresh();

  Logger.info(hr.runtime());

  //=========================================================================
  // INFORMATION
  //=========================================================================

  Logger.info("---------- INFORMATION ----------");

  Logger.info(hr.info());

  //=========================================================================
  // STOP
  //=========================================================================

  hr.stop();

  Logger.info(hr.runtime());

  //=========================================================================
  // RESET
  //=========================================================================

  hr.reset();

  Logger.info(hr.runtime());

  Logger.info("==================================================");
  Logger.info("HR Workspace Test Completed");
  Logger.info("==================================================");

}

function test_308_Manufacturing() {

  Logger.info("==================================================");
  Logger.info("Workspace ERP - Manufacturing Workspace");
  Logger.info("==================================================");

  const manufacturing = WEF.App.Manufacturing;

  //=========================================================================
  // INITIALIZE
  //=========================================================================

  manufacturing.initialize();

  Logger.info(manufacturing.runtime());

  //=========================================================================
  // BOOT
  //=========================================================================

  manufacturing.boot();

  Logger.info(manufacturing.runtime());

  //=========================================================================
  // START
  //=========================================================================

  manufacturing.start();

  Logger.info(manufacturing.runtime());

  //=========================================================================
  // DASHBOARD
  //=========================================================================

  Logger.info("---------- DASHBOARD ----------");

  Logger.info(manufacturing.dashboard());

  //=========================================================================
  // NAVIGATION
  //=========================================================================

  Logger.info("---------- PRODUCTION PLANS ----------");

  Logger.info(manufacturing.openProductionPlans());

  Logger.info("---------- WORK ORDERS ----------");

  Logger.info(manufacturing.openWorkOrders());

  Logger.info("---------- BILL OF MATERIALS ----------");

  Logger.info(manufacturing.openBillOfMaterials());

  Logger.info("---------- ROUTING ----------");

  Logger.info(manufacturing.openRouting());

  Logger.info("---------- PRODUCTION ----------");

  Logger.info(manufacturing.openProduction());

  Logger.info("---------- QUALITY CONTROL ----------");

  Logger.info(manufacturing.openQualityControl());

  Logger.info("---------- REPORTS ----------");

  Logger.info(manufacturing.openReports());

  //=========================================================================
  // REFRESH
  //=========================================================================

  manufacturing.refresh();

  Logger.info(manufacturing.runtime());

  //=========================================================================
  // INFORMATION
  //=========================================================================

  Logger.info("---------- INFORMATION ----------");

  Logger.info(manufacturing.info());

  //=========================================================================
  // STOP
  //=========================================================================

  manufacturing.stop();

  Logger.info(manufacturing.runtime());

  //=========================================================================
  // RESET
  //=========================================================================

  manufacturing.reset();

  Logger.info(manufacturing.runtime());

  Logger.info("==================================================");
  Logger.info("Manufacturing Workspace Test Completed");
  Logger.info("==================================================");

}

function test_309_Projects() {

  Logger.info("==================================================");
  Logger.info("Workspace ERP - Projects Workspace");
  Logger.info("==================================================");

  const projects = WEF.App.Projects;

  //=========================================================================
  // INITIALIZE
  //=========================================================================

  projects.initialize();

  Logger.info(projects.runtime());

  //=========================================================================
  // BOOT
  //=========================================================================

  projects.boot();

  Logger.info(projects.runtime());

  //=========================================================================
  // START
  //=========================================================================

  projects.start();

  Logger.info(projects.runtime());

  //=========================================================================
  // DASHBOARD
  //=========================================================================

  Logger.info("---------- DASHBOARD ----------");

  Logger.info(projects.dashboard());

  //=========================================================================
  // NAVIGATION
  //=========================================================================

  Logger.info("---------- PROJECTS ----------");

  Logger.info(projects.openProjects());

  Logger.info("---------- TASKS ----------");

  Logger.info(projects.openTasks());

  Logger.info("---------- MILESTONES ----------");

  Logger.info(projects.openMilestones());

  Logger.info("---------- TIMESHEETS ----------");

  Logger.info(projects.openTimesheets());

  Logger.info("---------- RESOURCES ----------");

  Logger.info(projects.openResources());

  Logger.info("---------- BUDGETS ----------");

  Logger.info(projects.openBudgets());

  Logger.info("---------- REPORTS ----------");

  Logger.info(projects.openReports());

  //=========================================================================
  // REFRESH
  //=========================================================================

  projects.refresh();

  Logger.info(projects.runtime());

  //=========================================================================
  // INFORMATION
  //=========================================================================

  Logger.info("---------- INFORMATION ----------");

  Logger.info(projects.info());

  //=========================================================================
  // STOP
  //=========================================================================

  projects.stop();

  Logger.info(projects.runtime());

  //=========================================================================
  // RESET
  //=========================================================================

  projects.reset();

  Logger.info(projects.runtime());

  Logger.info("==================================================");
  Logger.info("Projects Workspace Test Completed");
  Logger.info("==================================================");

}

/*==============================================================================
  Test Function
==============================================================================*/

function test_310_FixedAssets() {

  Logger.info("==================================================");
  Logger.info("Workspace ERP - Fixed Assets Workspace");
  Logger.info("==================================================");

  const assets = WEF.App.FixedAssets;

  //=========================================================================
  // INITIALIZE
  //=========================================================================

  assets.initialize();

  Logger.info(assets.runtime());

  //=========================================================================
  // BOOT
  //=========================================================================

  assets.boot();

  Logger.info(assets.runtime());

  //=========================================================================
  // START
  //=========================================================================

  assets.start();

  Logger.info(assets.runtime());

  //=========================================================================
  // DASHBOARD
  //=========================================================================

  Logger.info("---------- DASHBOARD ----------");

  Logger.info(assets.dashboard());

  //=========================================================================
  // NAVIGATION
  //=========================================================================

  Logger.info("---------- ASSETS ----------");

  Logger.info(assets.openAssets());

  Logger.info("---------- CATEGORIES ----------");

  Logger.info(assets.openCategories());

  Logger.info("---------- DEPRECIATION ----------");

  Logger.info(assets.openDepreciation());

  Logger.info("---------- TRANSFERS ----------");

  Logger.info(assets.openTransfers());

  Logger.info("---------- MAINTENANCE ----------");

  Logger.info(assets.openMaintenance());

  Logger.info("---------- DISPOSALS ----------");

  Logger.info(assets.openDisposals());

  Logger.info("---------- REPORTS ----------");

  Logger.info(assets.openReports());

  //=========================================================================
  // REFRESH
  //=========================================================================

  assets.refresh();

  Logger.info(assets.runtime());

  //=========================================================================
  // INFORMATION
  //=========================================================================

  Logger.info("---------- INFORMATION ----------");

  Logger.info(assets.info());

  //=========================================================================
  // STOP
  //=========================================================================

  assets.stop();

  Logger.info(assets.runtime());

  //=========================================================================
  // RESET
  //=========================================================================

  assets.reset();

  Logger.info(assets.runtime());

  Logger.info("==================================================");
  Logger.info("Fixed Assets Workspace Test Completed");
  Logger.info("==================================================");

}

function test_311_BI() {

  Logger.info("==================================================");
  Logger.info("Workspace ERP - Business Intelligence Workspace");
  Logger.info("==================================================");

  const bi = WEF.App.BI;

  //=========================================================================
  // INITIALIZE
  //=========================================================================

  bi.initialize();

  Logger.info(bi.runtime());

  //=========================================================================
  // BOOT
  //=========================================================================

  bi.boot();

  Logger.info(bi.runtime());

  //=========================================================================
  // START
  //=========================================================================

  bi.start();

  Logger.info(bi.runtime());

  //=========================================================================
  // DASHBOARD
  //=========================================================================

  Logger.info("---------- DASHBOARD ----------");

  Logger.info(bi.dashboard());

  //=========================================================================
  // NAVIGATION
  //=========================================================================

  Logger.info("---------- EXECUTIVE DASHBOARD ----------");

  Logger.info(bi.openExecutiveDashboard());

  Logger.info("---------- KPI DASHBOARD ----------");

  Logger.info(bi.openKPIs());

  Logger.info("---------- ANALYTICS ----------");

  Logger.info(bi.openAnalytics());

  Logger.info("---------- CHARTS ----------");

  Logger.info(bi.openCharts());

  Logger.info("---------- FORECASTS ----------");

  Logger.info(bi.openForecasts());

  Logger.info("---------- BUSINESS INSIGHTS ----------");

  Logger.info(bi.openInsights());

  Logger.info("---------- REPORTS ----------");

  Logger.info(bi.openReports());

  //=========================================================================
  // REFRESH
  //=========================================================================

  bi.refresh();

  Logger.info(bi.runtime());

  //=========================================================================
  // INFORMATION
  //=========================================================================

  Logger.info("---------- INFORMATION ----------");

  Logger.info(bi.info());

  //=========================================================================
  // STOP
  //=========================================================================

  bi.stop();

  Logger.info(bi.runtime());

  //=========================================================================
  // RESET
  //=========================================================================

  bi.reset();

  Logger.info(bi.runtime());

  Logger.info("==================================================");
  Logger.info("Business Intelligence Workspace Test Completed");
  Logger.info("==================================================");

}

function test_312_System() {

  Logger.info("==================================================");
  Logger.info("Workspace ERP - System Workspace");
  Logger.info("==================================================");

  const system = WEF.App.System;

  //=========================================================================
  // INITIALIZE
  //=========================================================================

  system.initialize();

  Logger.info(system.runtime());

  //=========================================================================
  // BOOT
  //=========================================================================

  system.boot();

  Logger.info(system.runtime());

  //=========================================================================
  // START
  //=========================================================================

  system.start();

  Logger.info(system.runtime());

  //=========================================================================
  // DASHBOARD
  //=========================================================================

  Logger.info("---------- DASHBOARD ----------");

  Logger.info(system.dashboard());

  //=========================================================================
  // NAVIGATION
  //=========================================================================

  Logger.info("---------- SETTINGS ----------");

  Logger.info(system.openSettings());

  Logger.info("---------- USERS ----------");

  Logger.info(system.openUsers());

  Logger.info("---------- ROLES ----------");

  Logger.info(system.openRoles());

  Logger.info("---------- PERMISSIONS ----------");

  Logger.info(system.openPermissions());

  Logger.info("---------- SCHEDULER ----------");

  Logger.info(system.openScheduler());

  Logger.info("---------- LOGS ----------");

  Logger.info(system.openLogs());

  Logger.info("---------- BACKUPS ----------");

  Logger.info(system.openBackups());

  Logger.info("---------- DIAGNOSTICS ----------");

  Logger.info(system.openDiagnostics());

  Logger.info("---------- MAINTENANCE ----------");

  Logger.info(system.openMaintenance());

  //=========================================================================
  // REFRESH
  //=========================================================================

  system.refresh();

  Logger.info(system.runtime());

  //=========================================================================
  // INFORMATION
  //=========================================================================

  Logger.info("---------- INFORMATION ----------");

  Logger.info(system.info());

  //=========================================================================
  // STOP
  //=========================================================================

  system.stop();

  Logger.info(system.runtime());

  //=========================================================================
  // RESET
  //=========================================================================

  system.reset();

  Logger.info(system.runtime());

  Logger.info("==================================================");
  Logger.info("System Workspace Test Completed");
  Logger.info("==================================================");

}


/*==============================================================================
  Test Function
==============================================================================*/

function test_400_WebApp() {

  Logger.info("==================================================");
  Logger.info("Workspace ERP Framework - Web Application");
  Logger.info("==================================================");

  const app = WEF.WebApp;

  //=========================================================================
  // INITIALIZE
  //=========================================================================

  app.initialize();

  Logger.info("---------- STATUS ----------");
  Logger.info(app.status());

  //=========================================================================
  // BOOT
  //=========================================================================

  app.boot();

  Logger.info("---------- METADATA ----------");
  Logger.info(app.metadata());

  //=========================================================================
  // CONFIGURATION
  //=========================================================================

  Logger.info("---------- CONFIGURATION ----------");
  Logger.info(app.configuration());

  //=========================================================================
  // BOOTSTRAP
  //=========================================================================

  Logger.info("---------- BOOTSTRAP ----------");
  Logger.info(app.bootstrap());

  //=========================================================================
  // HEALTH
  //=========================================================================

  Logger.info("---------- HEALTH ----------");
  Logger.info(app.health());

  //=========================================================================
  // PING
  //=========================================================================

  Logger.info("---------- PING ----------");
  Logger.info(app.ping());

  Logger.info("==================================================");
  Logger.info("Web Application Test Completed");
  Logger.info("==================================================");

}

/*==============================================================================
  Test Function
==============================================================================*/

function test_401_AppRouter() {

  Logger.info("==================================================");
  Logger.info("Workspace ERP Framework - Application Router");
  Logger.info("==================================================");

  const router = WEF.Router;

  //=========================================================================
  // INITIALIZE
  //=========================================================================

  router.initialize();

  Logger.info("---------- INITIAL STATUS ----------");
  Logger.info(router.status());

  //=========================================================================
  // BOOT
  //=========================================================================

  router.boot();

  Logger.info("---------- ROUTES ----------");
  Logger.info(router.routes());

  Logger.info("Registered Routes: " + router.count());

  //=========================================================================
  // NAVIGATION
  //=========================================================================

  Logger.info("---------- NAVIGATION ----------");

  Logger.info(router.dashboard());

  Logger.info(router.crm());

  Logger.info(router.sales());

  Logger.info(router.purchase());

  Logger.info(router.inventory());

  Logger.info(router.accounting());

  Logger.info(router.hr());

  Logger.info(router.manufacturing());

  Logger.info(router.projects());

  Logger.info(router.fixedAssets());

  Logger.info(router.bi());

  Logger.info(router.system());

  //=========================================================================
  // STATUS
  //=========================================================================

  Logger.info("---------- STATUS ----------");

  Logger.info(router.status());

  Logger.info("---------- HISTORY ----------");

  Logger.info(router.history());

  Logger.info("---------- INFORMATION ----------");

  Logger.info(router.info());

  //=========================================================================
  // RESET
  //=========================================================================

  router.reset();

  Logger.info(router.status());

  Logger.info("==================================================");
  Logger.info("Application Router Test Completed");
  Logger.info("==================================================");

}

/*==============================================================================
  Test Function
==============================================================================*/

function test_407_ModuleLoader() {

  Logger.info("==================================================");
  Logger.info("Workspace ERP Framework - Module Loader");
  Logger.info("==================================================");

  const loader = WEF.ModuleLoader;

  loader.initialize();

  loader.boot();

  Logger.info("---------- STATUS ----------");
  Logger.info(loader.status());

  // Example (requires corresponding HTML file to exist)
  // Logger.info(loader.load("406_Dashboard"));

  Logger.info("---------- INFO ----------");
  Logger.info(loader.info());

  Logger.info("---------- HISTORY ----------");
  Logger.info(loader.history());

  loader.reset();

  Logger.info(loader.status());

  Logger.info("==================================================");
  Logger.info("Module Loader Test Completed");
  Logger.info("==================================================");

}

function test_bootstrap(){

    Logger.log(

        webAppBootstrap()

    );

}