/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 30_Core_Workflow.gs
 * Version     : 1.0.0
 * Description : Workflow Engine
 * =============================================================================
 */

'use strict';

class WorkflowService extends BaseService {

  constructor() {

    super("Workflow");

    this.initialize();

  }

  initialize() {

    super.initialize();

    this.reset();

    return this;

  }

  reset() {

    this._workflows = {};
    this._instances = {};

    this._statistics = {

      workflows:0,
      instances:0,
      transitions:0,
      completed:0,
      cancelled:0,
      failures:0

    };

    return this;

  }

  //=========================================================================
  // Workflow Definition
  //=========================================================================

  create(name) {

    if (this._workflows[name])
      return false;

    this._workflows[name] = {

      name:name,

      states:{},

      transitions:{},

      initial:null,

      terminal:{}

    };

    this._statistics.workflows++;

    return true;

  }

  exists(name){

    return !!this._workflows[name];

  }

  workflow(name){

    return this._workflows[name] || null;

  }

  workflows(){

    return Object.keys(this._workflows);

  }

  workflowCount(){

    return this.workflows().length;

  }

  remove(name){

    if(!this.exists(name))
      return false;

    delete this._workflows[name];

    return true;

  }

  //=========================================================================
  // States
  //=========================================================================

  addState(workflow,state,options){

    if(!this.exists(workflow))
      throw new Error("Workflow not found.");

    options = options || {};

    this._workflows[workflow]
      .states[state] = {

        name:state,

        description:options.description || "",

        terminal:options.terminal || false

      };

    if(options.initial){

      this._workflows[workflow]
        .initial = state;

    }

    if(options.terminal){

      this._workflows[workflow]
        .terminal[state] = true;

    }

    return true;

  }

  states(workflow){

    if(!this.exists(workflow))
      return [];

    return Object.keys(
      this._workflows[workflow]
        .states
    );

  }

  initialState(workflow){

    if(!this.exists(workflow))
      return null;

    return this._workflows[workflow]
      .initial;

  }

  terminalStates(workflow){

    if(!this.exists(workflow))
      return [];

    return Object.keys(
      this._workflows[workflow]
        .terminal
    );

  }

  //=========================================================================
  // Transitions
  //=========================================================================

  addTransition(workflow, fromState, toState) {

    if (!this.exists(workflow))
      throw new Error("Workflow not found.");

    if (!this._workflows[workflow].transitions[fromState])
      this._workflows[workflow].transitions[fromState] = {};

    this._workflows[workflow]
      .transitions[fromState][toState] = true;

    return true;

  }

  nextStates(workflow, state) {

    if (!this.exists(workflow))
      return [];

    return Object.keys(
      this._workflows[workflow]
        .transitions[state] || {}
    );

  }

  canTransition(workflow, fromState, toState) {

    if (!this.exists(workflow))
      return false;

    return !!(
      this._workflows[workflow]
        .transitions[fromState] &&
      this._workflows[workflow]
        .transitions[fromState][toState]
    );

  }

  //=========================================================================
  // Workflow Instances
  //=========================================================================

  start(workflow, id, data) {

    if (!this.exists(workflow))
      throw new Error("Workflow not found.");

    const state = this.initialState(workflow);

    if (!state)
      throw new Error("Initial state not defined.");

    this._instances[id] = {

      id:id,
      workflow:workflow,
      state:state,
      completed:false,
      cancelled:false,
      created:new Date(),
      updated:new Date(),
      data:data || {}

    };

    this._statistics.instances++;

    return this._instances[id];

  }

  instance(id) {

    return this._instances[id] || null;

  }

  instances() {

    return Object.keys(this._instances);

  }

  instanceCount() {

    return this.instances().length;

  }

  //=========================================================================
  // Execution
  //=========================================================================

  transition(id, toState) {

    const instance = this.instance(id);

    if (!instance)
      throw new Error("Workflow instance not found.");

    if (!this.canTransition(
      instance.workflow,
      instance.state,
      toState
    )) {

      this._statistics.failures++;

      throw new Error(
        "Invalid workflow transition."
      );

    }

    instance.state = toState;
    instance.updated = new Date();

    this._statistics.transitions++;

    if (
      this._workflows[instance.workflow]
        .terminal[toState]
    ) {

      instance.completed = true;

      this._statistics.completed++;

    }

    return instance;

  }

  cancel(id) {

    const instance = this.instance(id);

    if (!instance)
      return false;

    instance.cancelled = true;
    instance.updated = new Date();

    this._statistics.cancelled++;

    return true;

  }

  //=========================================================================
  // Statistics
  //=========================================================================

  statistics() {

    return {

      workflows:this.workflowCount(),
      instances:this.instanceCount(),
      transitions:this._statistics.transitions,
      completed:this._statistics.completed,
      cancelled:this._statistics.cancelled,
      failures:this._statistics.failures

    };

  }

  health() {

    return {

      initialized:this.isInitialized(),
      healthy:true,
      workflows:this.workflowCount(),
      instances:this.instanceCount()

    };

  }

  report() {

    return {

      workflows:this.workflows(),

      instances:this.instances(),

      statistics:this.statistics(),

      health:this.health()

    };

  }

  info() {

    return {

      service:this.getName(),

      version:this.getVersion(),

      initialized:this.isInitialized(),

      created:this.getCreatedTime(),

      statistics:this.statistics()

    };

  }

}

WEF.Workflow =
  new WorkflowService();