/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 18_Core_Pipeline.gs
 * Version     : 1.0.0
 * Description : Processing Pipeline
 * =============================================================================
 */

'use strict';

class PipelineService extends BaseService{

  constructor(){

    super("Pipeline");

    this.initialize();

  }

  initialize(){

    super.initialize();

    this._stages=[];

    this._context={};

    this._statistics={

      executions:0,

      stages:0,

      failures:0

    };

    this._running=false;

    this._stopped=false;

    return this;

  }

  //=========================================================================
  // Pipeline Engine
  //=========================================================================

  pipe(stage,name){

    if(typeof stage!=="function")
      throw new Error("Pipeline stage must be a function.");

    this._stages.push({

      name:name||("Stage"+(this._stages.length+1)),

      handler:stage,

      enabled:true

    });

    this._statistics.stages=this._stages.length;

    return this;

  }

  stage(name,handler){

    return this.pipe(

      handler,

      name

    );

  }

  stages(){

    return this._stages.slice();

  }

  count(){

    return this._stages.length;

  }

  has(name){

    return this._stages.some(stage=>{

      return stage.name===name;

    });

  }

  clear(){

    this._stages=[];

    this._context={};

    this._running=false;

    this._statistics.stages=0;

    return this;

  }

  remove(name){

    this._stages=this._stages.filter(stage=>{

      return stage.name!==name;

    });

    this._statistics.stages=this._stages.length;

    return this;

  }

  //=========================================================================
  // Context Engine
  //=========================================================================

  context(){

    return this._context;

  }

  set(key,value){

    this._context[key]=value;

    return this;

  }

  get(key){

    return this._context[key];

  }

  hasContext(key){

    return Object.prototype.hasOwnProperty.call(

      this._context,

      key

    );

  }

  removeContext(key){

    delete this._context[key];

    return this;

  }

  clearContext(){

    this._context={};

    return this;

  }

  //=========================================================================
  // Stage Management
  //=========================================================================

  enable(name){

    this._stages.forEach(stage=>{

      if(stage.name===name)

        stage.enabled=true;

    });

    return this;

  }

  disable(name){

    this._stages.forEach(stage=>{

      if(stage.name===name)

        stage.enabled=false;

    });

    return this;

  }

  enabled(name){

    const stage=this._stages.find(stage=>{

      return stage.name===name;

    });

    return stage?stage.enabled:false;

  }

  running(){

    return this._running;

  }

  reset(){

    this._running=false;

    this.clearContext();

    return this;

  }

  //=========================================================================
  // Internal Helpers
  //=========================================================================

  beforeExecute(payload){

    this._running=true;

    this._stopped=false;

    this.set(

      "started",

      new Date()

    );

    this.set(

      "input",

      payload

    );

    return payload;

  }

  afterExecute(result){

    this.set(

      "finished",

      new Date()

    );

    this.set(

      "output",

      result

    );

    this._running=false;

    this._statistics.executions++;

    return result;

  }

    //=========================================================================
  // Execution Engine
  //=========================================================================

  run(payload={}){

    let result=this.beforeExecute(payload);

    try{

      for(const stage of this._stages){

        if(!stage.enabled)
          continue;

        if(this._stopped)
          break;

        result=stage.handler(

          result,

          this

        );

      }

      return this.afterExecute(result);

    }catch(error){

      this._statistics.failures++;

      this._running=false;

      throw error;

    }

  }

  execute(payload={}){

    return this.run(payload);

  }

  //=========================================================================
  // Flow Control
  //=========================================================================

  stop(){

    this._stopped=true;

    return this;

  }

  resume(){

    this._stopped=false;

    return this;

  }

  stopped(){

    return this._stopped===true;

  }

  //=========================================================================
  // Conditional Stages
  //=========================================================================

  when(condition,stage,name){

    return this.pipe(function(data,pipeline){

      if(condition(data,pipeline))
        return stage(data,pipeline);

      return data;

    },name);

  }

  unless(condition,stage,name){

    return this.pipe(function(data,pipeline){

      if(!condition(data,pipeline))
        return stage(data,pipeline);

      return data;

    },name);

  }

  //=========================================================================
  // Middleware
  //=========================================================================

  middleware(handler,name){

    return this.pipe(function(data,pipeline){

      return handler(

        data,

        pipeline,

        function(result){

          return result;

        }

      );

    },name);

  }

  //=========================================================================
  // Transaction Helpers
  //=========================================================================

  transaction(callback){

    WEF.Database.beginBatch();

    try{

      const result=callback(this);

      WEF.Database.commit();

      return result;

    }catch(error){

      WEF.Database.rollback();

      throw error;

    }

  }

  //=========================================================================
  // Event Integration
  //=========================================================================

  emit(event,payload){

    if(WEF.EventBus)

      WEF.EventBus.emit(

        event,

        payload

      );

    return this;

  }

  //=========================================================================
  // Repository Integration
  //=========================================================================

  repository(entity){

    return WEF.Repository.get(entity);

  }

  //=========================================================================
  // Stage Information
  //=========================================================================

  stageInfo(name){

    const stage=this._stages.find(stage=>{

      return stage.name===name;

    });

    if(!stage)
      return null;

    return{

      name:stage.name,

      enabled:stage.enabled

    };

  }

  stageNames(){

    return this._stages.map(stage=>{

      return stage.name;

    });

  }

  enabledStages(){

    return this._stages.filter(stage=>{

      return stage.enabled;

    });

  }

  disabledStages(){

    return this._stages.filter(stage=>{

      return !stage.enabled;

    });

  }

  executionTime(){

    if(

      !this.hasContext("started")||

      !this.hasContext("finished")

    )

      return 0;

    return this.get("finished")-

           this.get("started");

  }

    //=========================================================================
  // Statistics
  //=========================================================================

  statistics(){

    return{

      stages:this.count(),

      executions:this._statistics.executions,

      failures:this._statistics.failures,

      running:this.running(),

      executionTime:this.executionTime()

    };

  }

  //=========================================================================
  // Health
  //=========================================================================

  health(){

    return{

      initialized:this.isInitialized(),

      running:this.running(),

      stopped:this.stopped(),

      stages:this.count(),

      context:Object.keys(this._context).length

    };

  }

  //=========================================================================
  // Report
  //=========================================================================

  report(){

    return{

      statistics:this.statistics(),

      health:this.health(),

      stages:this.stageNames()

    };

  }

  //=========================================================================
  // Information
  //=========================================================================

  info(){

    return{

      service:this.getName(),

      version:this.getVersion(),

      initialized:this.isInitialized(),

      created:this.getCreatedTime(),

      statistics:this.statistics()

    };

  }

}

WEF.Pipeline=new PipelineService();