/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 009_Core_Metadata.gs
 * Version     : 3.2.0
 * Description : Metadata Registry Engine
 * Author      : OpenAI + Muhammad Saeed Anser
 * =============================================================================
 */

'use strict';

class MetadataService extends BaseService {

  constructor() {
    super("Metadata");
    this.initialize();
  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {
    super.initialize();

    this._entities = {};
    this._lookups = {};
    this._menus = {};
    this._workflows = {};
    this._reports = {};
    this._permissions = {};
    this._sequences = {};
    this._settings = {};
    this._modules={};
    this._dashboards={};
    this._forms={};
    this._templates={};
    this._apis={};

    return this;
  }

  //=========================================================================
  // Internal Helpers
  //=========================================================================

  _exists(collection,key){
    return Object.prototype.hasOwnProperty.call(collection,key);
  }

  _clone(object){
    return JSON.parse(JSON.stringify(object));
  }

  //=========================================================================
  // Generic Registry
  //=========================================================================

  register(collection,key,data){

    if(this._exists(collection,key)){
      throw new Error("Metadata '"+key+"' already exists.");
    }

    collection[key]=this._clone(data);

    return this;

  }

  get(collection,key){

    if(!this._exists(collection,key)){
      return null;
    }

    return this._clone(collection[key]);

  }

  update(collection,key,data){

    collection[key]=this._clone(data);

    return this;

  }

  remove(collection,key){

    delete collection[key];

    return this;

  }

  list(collection){

    return Object.keys(collection);

  }

  count(collection){

    return Object.keys(collection).length;

  }

  //=========================================================================
  // Entity Registry
  //=========================================================================

  registerEntity(name,definition){
    this.register(this._entities,name,definition);
    return this;
  }

  getEntity(name){
    return this.get(this._entities,name);
  }

  updateEntity(name,definition){
    this.update(this._entities,name,definition);
    return this;
  }

  removeEntity(name){
    this.remove(this._entities,name);
    return this;
  }

  getEntities(){
    return this.list(this._entities);
  }

  //=========================================================================
  // Lookup Registry
  //=========================================================================

  registerLookup(name,data){
    this.register(this._lookups,name,data);
    return this;
  }

  getLookup(name){
    return this.get(this._lookups,name);
  }

  updateLookup(name,data){
    this.update(this._lookups,name,data);
    return this;
  }

  removeLookup(name){
    this.remove(this._lookups,name);
    return this;
  }

  getLookups(){
    return this.list(this._lookups);
  }

  //=========================================================================
  // Menu Registry
  //=========================================================================

  registerMenu(name,data){
    this.register(this._menus,name,data);
    return this;
  }

  getMenu(name){
    return this.get(this._menus,name);
  }

  updateMenu(name,data){
    this.update(this._menus,name,data);
    return this;
  }

  removeMenu(name){
    this.remove(this._menus,name);
    return this;
  }

  getMenus(){
    return this.list(this._menus);
  }

  //=========================================================================
  // Workflow Registry
  //=========================================================================

  registerWorkflow(name,data){
    this.register(this._workflows,name,data);
    return this;
  }

  getWorkflow(name){
    return this.get(this._workflows,name);
  }

  updateWorkflow(name,data){
    this.update(this._workflows,name,data);
    return this;
  }

  removeWorkflow(name){
    this.remove(this._workflows,name);
    return this;
  }

  getWorkflows(){
    return this.list(this._workflows);
  }

  //=========================================================================
  // Sequence Registry
  //=========================================================================

  registerSequence(name,definition){
    this.register(this._sequences,name,definition);
    return this;
  }

  getSequence(name){
    return this.get(this._sequences,name);
  }

  updateSequence(name,definition){
    this.update(this._sequences,name,definition);
    return this;
  }

  removeSequence(name){
    this.remove(this._sequences,name);
    return this;
  }

  getSequences(){
    return this.list(this._sequences);
  }

  //=========================================================================
  // Permission Registry
  //=========================================================================

  registerPermission(role,definition){
    this.register(this._permissions,role,definition);
    return this;
  }

  getPermission(role){
    return this.get(this._permissions,role);
  }

  updatePermission(role,definition){
    this.update(this._permissions,role,definition);
    return this;
  }

  removePermission(role){
    this.remove(this._permissions,role);
    return this;
  }

  getPermissions(){
    return this.list(this._permissions);
  }

  //=========================================================================
  // Report Registry
  //=========================================================================

  registerReport(name,definition){
    this.register(this._reports,name,definition);
    return this;
  }

  getReport(name){
    return this.get(this._reports,name);
  }

  updateReport(name,definition){
    this.update(this._reports,name,definition);
    return this;
  }

  removeReport(name){
    this.remove(this._reports,name);
    return this;
  }

  getReports(){
    return this.list(this._reports);
  }

  //=========================================================================
  // Settings Registry
  //=========================================================================

  registerSetting(key,value){
    this._settings[key]=this._clone(value);
    return this;
  }

  getSetting(key,defaultValue=null){
    if(!this._exists(this._settings,key)){
      return defaultValue;
    }
    return this._clone(this._settings[key]);
  }

  updateSetting(key,value){
    this._settings[key]=this._clone(value);
    return this;
  }

  removeSetting(key){
    delete this._settings[key];
    return this;
  }

  getSettings(){
    return this.list(this._settings);
  }

  //=========================================================================
  // Module Registry
  //=========================================================================

  registerModule(name,definition){
    if(!this._modules) this._modules={};
    this.register(this._modules,name,definition);
    return this;
  }

  getModule(name){
    if(!this._modules) this._modules={};
    return this.get(this._modules,name);
  }

  updateModule(name,definition){
    if(!this._modules) this._modules={};
    this.update(this._modules,name,definition);
    return this;
  }

  removeModule(name){
    if(!this._modules) return this;
    this.remove(this._modules,name);
    return this;
  }

  getModules(){
    if(!this._modules) this._modules={};
    return this.list(this._modules);
  }

  //=========================================================================
  // Dashboard Registry
  //=========================================================================

  registerDashboard(name,definition){
    if(!this._dashboards) this._dashboards={};
    this.register(this._dashboards,name,definition);
    return this;
  }

  getDashboard(name){
    if(!this._dashboards) this._dashboards={};
    return this.get(this._dashboards,name);
  }

  getDashboards(){
    if(!this._dashboards) this._dashboards={};
    return this.list(this._dashboards);
  }

  //=========================================================================
  // Form Registry
  //=========================================================================

  registerForm(name,definition){
    if(!this._forms) this._forms={};
    this.register(this._forms,name,definition);
    return this;
  }

  getForm(name){
    if(!this._forms) this._forms={};
    return this.get(this._forms,name);
  }

  getForms(){
    if(!this._forms) this._forms={};
    return this.list(this._forms);
  }

  //=========================================================================
  // Template Registry
  //=========================================================================

  registerTemplate(name,definition){
    if(!this._templates) this._templates={};
    this.register(this._templates,name,definition);
    return this;
  }

  getTemplate(name){
    if(!this._templates) this._templates={};
    return this.get(this._templates,name);
  }

  getTemplates(){
    if(!this._templates) this._templates={};
    return this.list(this._templates);
  }

  //=========================================================================
  // API Registry
  //=========================================================================

  registerApi(name,definition){
    if(!this._apis) this._apis={};
    this.register(this._apis,name,definition);
    return this;
  }

  getApi(name){
    if(!this._apis) this._apis={};
    return this.get(this._apis,name);
  }

  getApis(){
    if(!this._apis) this._apis={};
    return this.list(this._apis);
  }

  //=========================================================================
  // Export / Import
  //=========================================================================

  export(){

    return this._clone({

      entities:this._entities,
      lookups:this._lookups,
      menus:this._menus,
      workflows:this._workflows,
      reports:this._reports,
      permissions:this._permissions,
      sequences:this._sequences,
      settings:this._settings,
      modules:this._modules,
      dashboards:this._dashboards,
      forms:this._forms,
      templates:this._templates,
      apis:this._apis

    });

  }

  import(data){

    if(!data) return this;

    Object.assign(this._entities,data.entities||{});
    Object.assign(this._lookups,data.lookups||{});
    Object.assign(this._menus,data.menus||{});
    Object.assign(this._workflows,data.workflows||{});
    Object.assign(this._reports,data.reports||{});
    Object.assign(this._permissions,data.permissions||{});
    Object.assign(this._sequences,data.sequences||{});
    Object.assign(this._settings,data.settings||{});
    Object.assign(this._modules,data.modules||{});
    Object.assign(this._dashboards,data.dashboards||{});
    Object.assign(this._forms,data.forms||{});
    Object.assign(this._templates,data.templates||{});
    Object.assign(this._apis,data.apis||{});

    return this;

  }

  //=========================================================================
  // Validation
  //=========================================================================

  validate(){

    const result={
      valid:true,
      errors:[]
    };

    if(Object.keys(this._entities).length===0){
      result.errors.push("No entities registered.");
    }

    if(Object.keys(this._modules).length===0){
      result.errors.push("No modules registered.");
    }

    if(result.errors.length>0){
      result.valid=false;
    }

    return result;

  }

  //=========================================================================
  // Snapshot
  //=========================================================================

  snapshot() {

    return {

      frameworkVersion: WEF.Info.version,

      frameworkBuild: WEF.Info.build,

      releaseDate: WEF.Info.releaseDate,

      releaseChannel: WEF.Info.channel,

      environment: WEF.Config.get("ENVIRONMENT"),

      exported: new Date(),

      metadata: this.export()

    };

  }

  //=========================================================================
  // JSON
  //=========================================================================

  toJSON(){

    return JSON.stringify(

      this.export(),

      null,

      2

    );

  }

  //=========================================================================
  // Reset
  //=========================================================================

  reset(){

    this.initialize();

    return this;

  }

  //=========================================================================
  // Bootstrap
  //=========================================================================

  bootstrap(){

    this.reset();

    return this;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics(){

    return{

      entities:this.count(this._entities),
      lookups:this.count(this._lookups),
      menus:this.count(this._menus),
      workflows:this.count(this._workflows),
      reports:this.count(this._reports),
      permissions:this.count(this._permissions),
      sequences:this.count(this._sequences),
      settings:this.count(this._settings),
      modules:this.count(this._modules),
      dashboards:this.count(this._dashboards),
      forms:this.count(this._forms),
      templates:this.count(this._templates),
      apis:this.count(this._apis)

    };

  }

  //=========================================================================
  // Information
  //=========================================================================

  info() {

    return {

      service: this.getName(),

      version: this.getVersion(),

      initialized: this.isInitialized(),

      created: this.getCreatedTime(),

      frameworkVersion: WEF.Info.version,

      frameworkBuild: WEF.Info.build,

      releaseDate: WEF.Info.releaseDate,

      releaseChannel: WEF.Info.channel,

      environment: WEF.Config.get("ENVIRONMENT"),

      statistics: this.statistics()

    };

  }

}

/**
 * ============================================================================
 * Register Service
 * ============================================================================
 */

WEF.Metadata = new MetadataService();

if (!WEF.ServiceRegistry.has("Metadata")) {

  WEF.ServiceRegistry.register(
    "Metadata",
    WEF.Metadata
  );

}

if (!WEF.ModuleRegistry.has("Metadata")) {

  WEF.ModuleRegistry.register(
    "Metadata",
    WEF.Metadata
  );

}

function test_Metadata_Part5(){

  const md=WEF.Metadata;

  md.bootstrap();

  md.registerModule("Accounting",{
    enabled:true
  });

  md.registerEntity("Customer",{
    sheet:"Customers"
  });

  const validation=md.validate();

  Logger.log(validation);

  Logger.log(md.snapshot());

  Logger.log(md.toJSON());

  Logger.log(md.statistics());

  Logger.log(md.info());

}