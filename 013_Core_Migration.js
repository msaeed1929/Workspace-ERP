/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 13_Core_Migration.gs
 * Version     : 1.0.0
 * Description : Database Migration Engine
 * Author      : OpenAI + Muhammad Saeed Anser
 * =============================================================================
 */

'use strict';

class MigrationService extends BaseService{

  constructor(){

    super("Migration");

    this.initialize();

  }

  initialize(){

    super.initialize();

    this._migrations={};

    this._history=[];

    this.initializeSheet();

    this.loadHistory();

    this._version = WEF_FRAMEWORK.VERSION;

    return this;

  }

  //=========================================================================
  // Registration
  //=========================================================================

  register(name,migration){

    if(!name)
      throw new Error("Migration name is required.");

    if(typeof migration!=="object")
    throw new Error("Migration definition is invalid.");

    migration.name=name;
    migration.created=new Date();
    migration.dependencies=migration.dependencies||[];
    migration.version=migration.version||this.version();

    this._migrations[name]=migration;

    return migration;

  }

  exists(name){

  return Object.prototype.hasOwnProperty.call(
  this._migrations,
  name
  );

  }

  get(name){

    return this._migrations[name]||null;

  }

  all(){

    return Object.values(this._migrations);

  }

  count(){

    return this.all().length;

  }

  remove(name){

    delete this._migrations[name];

    return true;

  }

  clear(){

    this._migrations={};

    this._history=[];

    this.initializeSheet();

    return this;

  }

  //=========================================================================
  // Version
  //=========================================================================

  version(){

    return this._version;

  }

  setVersion(version){

    this._version=version;

    return this;

  }

  //=========================================================================
  // History
  //=========================================================================

  addHistory(record){

    record.timestamp=new Date();

    this._history.push(record);

    return record;

  }

  history(){

    return this._history;

  }

  executedCount(){

    return this.loadHistory()

    .filter(r=>r.status==="SUCCESS")

    .length;

  }

  clearHistory(){

    this._history=[];

    return this;

  }

  //=========================================================================
  // Migration Sheet
  //=========================================================================

  sheet() {

    const spreadsheet = WEF.Environment.getSpreadsheet();

    let sheet = spreadsheet.getSheetByName("_Migration");

    if (!sheet) {

      sheet = spreadsheet.insertSheet("_Migration");

      sheet.hideSheet();

      sheet.getRange(1, 1, 1, 6).setValues([[
        "Migration",
        "Version",
        "Status",
        "ExecutedAt",
        "ExecutedBy",
        "Notes"
      ]]);

    }

    return sheet;

  }

  initializeSheet(){

    const sheet=this.sheet();

      if(sheet.getLastRow()===0){

        sheet.getRange(1,1,1,6).setValues([[
        "Migration",
        "Version",
        "Status",
        "ExecutedAt",
        "ExecutedBy",
        "Notes"
        ]]);

      }

    return sheet;

  }

  //=========================================================================
  // Persistence
  //=========================================================================

  loadHistory(){

    this._history=[];

    const sheet=this.sheet();

    const lastRow=sheet.getLastRow();

    if(lastRow<=1)
      return this._history;

    const values=sheet
      .getRange(2,1,lastRow-1,6)
      .getValues();

      values.forEach(row=>{

      this._history.push({

        migration:row[0],

        version:row[1],

        status:row[2],

        timestamp:row[3],

        user:row[4],

        notes:row[5]

      });

    });

    return this._history;

  }

  saveHistory(record){

    this.sheet().appendRow([

    record.migration,

    record.version,

    record.status,

    record.timestamp||new Date(),

    record.user||this.user(),

    record.notes||""

    ]);

    this._history.push(record);

    return record;

  }

    executed(name){

    return this._history.some(r=>r.migration===name);

    }

    //=========================================================================
    // Migration Execution
    //=========================================================================

    run(name){

      const migration=this.get(name);

      if(!migration)
        throw new Error("Migration '"+name+"' not found.");

      this.loadHistory();

      if(this.executed(name))
        return false;

      if(!this.canRun(name))
        throw new Error(
          "Migration '"+name+"' has unresolved dependencies."
        );

      if(typeof migration.up==="function")
        migration.up();

      this.saveHistory({

        migration:name,
        version:migration.version||this.version(),
        status:"SUCCESS"

      });

      return true;

    }

  runAll(){

    let executed=0;

    this.pending().forEach(m=>{

      if(this.run(m.name))
      executed++;

    });

    return executed;

  }

  //=========================================================================
  // Version Management
  //=========================================================================

  currentVersion(){

  const history=this.loadHistory();

    if(history.length===0)
      return "0.0.0";

      return history
      .map(r=>r.version)
      .sort()
      .pop();

  }

  latestVersion(){

    const versions=this.all()
    .map(m=>m.version||"0.0.0")
    .sort((a,b)=>a.localeCompare(
    b,
    undefined,
    {
    numeric:true
    }
    ));

    return versions.length?versions[versions.length-1]:"0.0.0";

  }

  isUpToDate(){

    return this.currentVersion()===this.latestVersion();

  }

  pending(){

    this.loadHistory();

    return this.all().filter(m=>!this.executed(m.name));

  }

  hasPending(){

    return this.pending().length>0;

  }

  //=========================================================================
  // Rollback
  //=========================================================================

  registerRollback(name,callback){

    const migration=this.get(name);

    if(!migration)
      throw new Error("Migration '"+name+"' not found.");

    migration.rollback=callback;

    return migration;

  }

  rollback(name){

    const migration=this.get(name);

    if(!migration)
      throw new Error("Migration '"+name+"' not found.");

    if(typeof migration.rollback!=="function")
     return false;

    migration.rollback();

    this.saveHistory({

      migration:name,

      version:migration.version,

      status:"ROLLBACK"

    });

    return true;

  }

  //=============================================================================
  // Dependencies
  //=============================================================================

  addDependency(name,dependency){

    const migration=this.get(name);

    if(!migration)
      throw new Error("Migration '"+name+"' not found.");

    if(!migration.dependencies)
      migration.dependencies=[];

    if(migration.dependencies.indexOf(dependency)===-1)
      migration.dependencies.push(dependency);

    return migration;

  }

  dependencies(name){

    const migration=this.get(name);

    if(!migration)
      return [];

    return migration.dependencies||[];

  }

  canRun(name){

    const deps=this.dependencies(name);

    if(deps.length===0)
      return true;

    this.loadHistory();

    return deps.every(d=>this.executed(d));

  }

  //=============================================================================
  // Dependency Report
  //=============================================================================

  dependencyReport(){

    const report=[];

    this.all().forEach(m=>{

      report.push({

        migration:m.name,
        dependencies:this.dependencies(m.name),
        ready:this.canRun(m.name)

      });

    });

    return report;

  }

  //=============================================================================
  // Status
  //=============================================================================

  status(name){

    const migration=this.get(name);

    if(!migration)
      return null;

    return{
      name:name,
      version:migration.version||"0.0.0",
      executed:this.executed(name),
      dependencies:this.dependencies(name),
      canRun:this.canRun(name)
    };

  }

  statuses(){

    return this.all().map(m=>this.status(m.name));

  }

  //=============================================================================
  // Dry Run
  //=============================================================================

  dryRun(){

    return this.pending().map(m=>{

      return{
        migration:m.name,
        version:m.version||"0.0.0",
        dependencies:this.dependencies(m.name),
        ready:this.canRun(m.name)
      };

    });

  }

  //=============================================================================
  // Development
  //=============================================================================

  reset(){

  const sheet=this.sheet();

  if(sheet.getLastRow()>1){

    sheet.deleteRows(
    2,
    sheet.getLastRow()-1
    );

  }

  this._history=[];

  this._migrations={};

  return this;

  }

  //=============================================================================
  // Health
  //=============================================================================

  health(){

    return{

      sheetExists:
        WEF.Environment
          .getSpreadsheet()
          .getSheetByName("_Migration") !== null,
      registered:this.all().length,
      executed:this.executedCount(),
      pending:this.pending().length,
      upToDate:this.isUpToDate(),
      currentVersion:this.currentVersion(),
      latestVersion:this.latestVersion()

    };

  }

  //=========================================================================
  // Upgrade Report
  //=========================================================================

  report(){

    return{

      current:this.currentVersion(),
      latest:this.latestVersion(),
      upToDate:this.isUpToDate(),
      pending:this.pending().map(m=>m.name),
      registered:this.all().length,
      executed:this.executedCount(),
      dependencyReport:this.dependencyReport()

    };

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics(){

    return{

      version:this.version(),

      registered:this.all().length,

      history:this.loadHistory().length,

      executed:this.executedCount(),

      pending:this.pending().length,

      current:this.currentVersion(),

      latest:this.latestVersion()

    };

  }

  info(){

    return Object.assign(

      super.info(),

      {

        statistics:this.statistics(),

        health:this.health(),

        currentVersion:this.currentVersion(),

        latestVersion:this.latestVersion()

      }

    );

  }

}

WEF.Migration=new MigrationService();