/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 17_Core_EventBus.gs
 * Version     : 1.0.0
 * Description : Event Bus
 * =============================================================================
 */

'use strict';

class EventBusService extends BaseService{

  constructor(){

    super("EventBus");

    this.initialize();

  }

  initialize(){

    super.initialize();

    this._events={};

    this._history=[];

    this._disabled={};

    this._statistics={

      events:0,

      listeners:0,

      emissions:0

    };

    this._propagationStopped=false;

    return this;

  }

  //=========================================================================
  // Event Registry
  //=========================================================================

  has(event){

    return Object.prototype.hasOwnProperty.call(

      this._events,

      event

    );

  }

  create(event){

    if(!event)
      throw new Error("Event name is required.");

    if(!this.has(event)){

      this._events[event]=[];

      this._statistics.events++;

    }

    return this;

  }

  remove(event){

    if(this.has(event)){

      this._statistics.listeners-=

      this._events[event].length;

      delete this._events[event];

      delete this._disabled[event];

      if(this._statistics.events>0)
        this._statistics.events--;

    }

    return this;

  }

  clear(){

    this._events={};

    this._disabled={};

    this._history=[];

    this._statistics.events=0;

    this._statistics.listeners=0;

    this._statistics.emissions=0;

    this._propagationStopped=false;

    return this;

  }

  events(){

    return Object.keys(this._events);

  }

  count(){

    return this.events().length;

  }

  //=========================================================================
  // Listener Engine
  //=========================================================================

  on(event,callback,priority=0){

    if(typeof callback!=="function")
      throw new Error("Listener must be a function.");

    this.create(event);

    this._events[event].push({

      callback:callback,

      priority:priority,

      once:false

    });

    this.sort(event);

    this._statistics.listeners++;

    return this;

  }

  once(event,callback,priority=0){

    if(typeof callback!=="function")
      throw new Error("Listener must be a function.");

    this.create(event);

    this._events[event].push({

      callback:callback,

      priority:priority,

      once:true

    });

    this.sort(event);

    this._statistics.listeners++;

    return this;

  }

  off(event,callback){

    if(!this.has(event))
      return this;

    const before=this._events[event].length;

    this._events[event]=

    this._events[event].filter(listener=>{

      return listener.callback!==callback;

    });

    this._statistics.listeners-=

    before-this._events[event].length;

    return this;

  }

  listeners(event){

    if(!this.has(event))
      return [];

    return this._events[event];

  }

  listenerCount(event){

    return this.listeners(event).length;

  }

  hasListeners(event){

    return this.listenerCount(event)>0;

  }

  clearListeners(event){

    if(!this.has(event))
      return this;

    this._statistics.listeners-=

    this.listenerCount(event);

    this._events[event]=[];

    return this;

  }

  //=========================================================================
  // Internal Helpers
  //=========================================================================

  sort(event){

    if(!this.has(event))
      return this;

    this._events[event].sort((a,b)=>{

      return b.priority-a.priority;

    });

    return this;

  }

  stop(){

    this._propagationStopped=true;

    return this;

  }

  resume(){

    this._propagationStopped=false;

    return this;

  }

  propagationStopped(){

    return this._propagationStopped;

  }

    //=========================================================================
  // Event Dispatch Engine
  //=========================================================================

  emit(event,payload=null){

    return this.dispatch(event,payload);

  }

  dispatch(event,payload=null){

    if(!this.has(event))
      return payload;

    if(this.isDisabled(event))
      return payload;

    this.resume();

    const eventObject={

      name:event,

      payload:payload,

      timestamp:new Date(),

      cancelled:false,

      stop:()=>{

        this.stop();

        eventObject.cancelled=true;

      }

    };

    const listeners=this.listeners(event).slice();

    listeners.forEach(listener=>{

      if(this.propagationStopped())
        return;

      listener.callback(eventObject);

      if(listener.once){

        this.off(

          event,

          listener.callback

        );

      }

    });

    this._statistics.emissions++;

    this.addHistory(

      event,

      payload,

      listeners.length

    );

    return eventObject.payload;

  }

  broadcast(payload=null){

    this.events().forEach(event=>{

      this.dispatch(

        event,

        payload

      );

    });

    return this;

  }

  //=========================================================================
  // Enable / Disable
  //=========================================================================

  enable(event){

    delete this._disabled[event];

    return this;

  }

  disable(event){

    this._disabled[event]=true;

    return this;

  }

  isDisabled(event){

    return this._disabled[event]===true;

  }

  enabled(event){

    return !this.isDisabled(event);

  }

  //=========================================================================
  // History Engine
  //=========================================================================

  addHistory(event,payload,listeners){

    this._history.push({

      event:event,

      payload:payload,

      listeners:listeners,

      timestamp:new Date()

    });

    return this;

  }

  history(){

    return this._history.slice();

  }

  last(){

    if(this._history.length===0)
      return null;

    return this._history[
      this._history.length-1
    ];

  }

  clearHistory(){

    this._history=[];

    return this;

  }

  replay(event){

    this.history()

    .filter(item=>{

      return item.event===event;

    })

    .forEach(item=>{

      this.dispatch(

        item.event,

        item.payload

      );

    });

    return this;

  }

  //=========================================================================
  // Event Information
  //=========================================================================

  eventInfo(event){

    return{

      event:event,

      exists:this.has(event),

      enabled:this.enabled(event),

      listeners:this.listenerCount(event)

    };

  }

  listenerReport(){

    const report={};

    this.events().forEach(event=>{

      report[event]=this.listenerCount(event);

    });

    return report;

  }

  eventsReport(){

    return this.events().map(event=>{

      return{

        event:event,

        listeners:this.listenerCount(event),

        enabled:this.enabled(event)

      };

    });

  }

    //=========================================================================
  // Statistics
  //=========================================================================

  statistics(){

    return{

      events:this.count(),

      listeners:this._statistics.listeners,

      emissions:this._statistics.emissions,

      history:this._history.length

    };

  }

  //=========================================================================
  // Health
  //=========================================================================

  health(){

    return{

      initialized:this.isInitialized(),

      events:this.count(),

      listeners:this._statistics.listeners,

      history:this._history.length,

      propagationStopped:this.propagationStopped()

    };

  }

  //=========================================================================
  // Report
  //=========================================================================

  report(){

    return{

      statistics:this.statistics(),

      health:this.health(),

      events:this.eventsReport()

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

WEF.EventBus=new EventBusService();