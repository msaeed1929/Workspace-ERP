/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 309_Projects.gs
 * Layer       : ERP Application
 * Component   : Projects Workspace
 * Version     : 1.0.0
 * Description : Projects application workspace responsible for project
 *               planning, tasks, milestones, timesheets, resources,
 *               budgeting, project monitoring and project analytics.
 * =============================================================================
 */

'use strict';

class ERPProjects {

  constructor() {

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    this._initialized = false;

    this._running = false;

    this._workspaceName = "Projects Workspace";

    this._version = "1.0.0";

    this._dashboard = {};

    this._projects = [];

    this._tasks = [];

    this._milestones = [];

    this._timesheets = [];

    this._resources = [];

    this._budgets = [];

    this._reports = [];

    this._bootTime = null;

    return this;

  }

  //=========================================================================
  // Workspace Boot
  //=========================================================================

  boot() {

    Logger.info("========== Projects Workspace Boot Started ==========");

    this.loadDashboard();

    this.loadProjects();

    this.loadTasks();

    this.loadMilestones();

    this.loadTimesheets();

    this.loadResources();

    this.loadBudgets();

    this.loadReports();

    this._bootTime = new Date();

    this._initialized = true;

    Logger.info("========== Projects Workspace Ready ==========");

    return this;

  }

  //=========================================================================
  // Loaders
  //=========================================================================

  loadDashboard() {

    Logger.info("Loading Projects Dashboard");

    this._dashboard = {

      projects: 0,

      tasks: 0,

      milestones: 0,

      timesheets: 0,

      resources: 0,

      budgets: 0

    };

    return this;

  }

  loadProjects() {

    Logger.info("Loading Projects");

    this._projects = [];

    return this;

  }

  loadTasks() {

    Logger.info("Loading Tasks");

    this._tasks = [];

    return this;

  }

  loadMilestones() {

    Logger.info("Loading Milestones");

    this._milestones = [];

    return this;

  }

  loadTimesheets() {

    Logger.info("Loading Timesheets");

    this._timesheets = [];

    return this;

  }

  loadResources() {

    Logger.info("Loading Resources");

    this._resources = [];

    return this;

  }

  loadBudgets() {

    Logger.info("Loading Budgets");

    this._budgets = [];

    return this;

  }

  loadReports() {

    Logger.info("Loading Project Reports");

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

    Logger.info("========== Projects Workspace Started ==========");

    return this;

  }

  stop() {

    this._running = false;

    Logger.info("========== Projects Workspace Stopped ==========");

    return this;

  }

  restart() {

    this.stop();

    this.start();

    Logger.info("========== Projects Workspace Restarted ==========");

    return this;

  }

  //=========================================================================
  // Workspace Data
  //=========================================================================

  dashboard() {

    return this._dashboard;

  }

  projects() {

    return this._projects;

  }

  tasks() {

    return this._tasks;

  }

  milestones() {

    return this._milestones;

  }

  timesheets() {

    return this._timesheets;

  }

  resources() {

    return this._resources;

  }

  budgets() {

    return this._budgets;

  }

  reports() {

    return this._reports;

  }

  //=========================================================================
  // Navigation
  //=========================================================================

  openProjects() {

    Logger.info("Opening Projects");

    return true;

  }

  openTasks() {

    Logger.info("Opening Tasks");

    return true;

  }

  openMilestones() {

    Logger.info("Opening Milestones");

    return true;

  }

  openTimesheets() {

    Logger.info("Opening Timesheets");

    return true;

  }

  openResources() {

    Logger.info("Opening Resources");

    return true;

  }

  openBudgets() {

    Logger.info("Opening Budgets");

    return true;

  }

  openReports() {

    Logger.info("Opening Project Reports");

    return true;

  }

  //=========================================================================
  // Workspace Operations
  //=========================================================================

  refresh() {

    Logger.info("Refreshing Projects Workspace");

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

      projects: this._projects.length,

      tasks: this._tasks.length,

      milestones: this._milestones.length,

      timesheets: this._timesheets.length,

      resources: this._resources.length,

      budgets: this._budgets.length,

      reports: this._reports.length,

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

    Logger.info("========== Projects Workspace Reset ==========");

    return this;

  }

}

/*==============================================================================
  Module Registration
==============================================================================*/

WEF.App = WEF.App || {};

WEF.App.Projects = new ERPProjects();