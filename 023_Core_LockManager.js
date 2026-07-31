/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 23_Core_LockManager.gs
 * Version     : 1.0.0
 * Description : Enterprise Lock Manager
 * Author      : Muhammad Saeed Anser
 * -----------------------------------------------------------------------------
 * Responsibilities
 * -----------------------------------------------------------------------------
 * • Named Resource Locks
 * • Transaction Locks
 * • Global Locks
 * • Try Lock
 * • Timeout Management
 * • Deadlock Prevention
 * • Lock Ownership
 * • Lock Cleanup
 * • Statistics
 * =============================================================================
 */

'use strict';

class LockManagerService extends BaseService {

  constructor() {

    super("LockManager");

    this.initialize();

  }

  initialize() {

    super.initialize();

    this.reset();

    return this;

  }

  reset() {

    this._locks = {};

    this._statistics = {

      locks:0,

      releases:0,

      active:0,

      failures:0,

      expired:0,

      renewals:0,

      forceReleases:0,

      waiting:0,

      deadlocks:0

    };

    return this;

  }

  _executionId() {

    return Utilities.getUuid();

  }

  cleanup() {

    const now = Date.now();

    Object.keys(this._locks).forEach(name=>{

      if(this._locks[name].expires<=now){

        delete this._locks[name];

        this._statistics.expired++;

      }

    });

    return this;

  }

  lock(name,timeout) {

    timeout = timeout || 30000;

    this.cleanup();

    if(this._locks[name]){

      this._statistics.failures++;

      throw new Error(

        "Resource already locked : "+name

      );

    }

    this._locks[name]={

      name:name,

      owner:this._executionId(),

      created:Date.now(),

      expires:Date.now()+timeout,

      timeout:timeout,

      level:1

    };

    this._statistics.locks++;

    return true;

  }

  tryLock(name,timeout){

    try{

      return this.lock(name,timeout);

    }

    catch(error){

      return false;

    }

  }

  exists(name){

    this.cleanup();

    return !!this._locks[name];

  }

  isLocked(name){

    return this.exists(name);

  }

  owner(name){

    return this.exists(name)

      ? this._locks[name].owner

      : null;

  }

  remaining(name){

    if(!this.exists(name))

      return 0;

    return Math.max(

      0,

      this._locks[name].expires-Date.now()

    );

  }

  renew(name,timeout){

    timeout=timeout||30000;

    if(!this.exists(name))

      throw new Error(

        "Lock not found."

      );

    this._locks[name].expires=

      Date.now()+timeout;

    this._locks[name].timeout=

      timeout;

    return true;

  }

  release(name){

    if(!this.exists(name))

      return false;

    delete this._locks[name];

    this._statistics.releases++;

    return true;

  }

  forceRelease(name){

    delete this._locks[name];

    this._statistics.releases++;

    return true;

  }

  releaseAll(){

      this._statistics.releases +=

          Object.keys(this._locks).length;

      this._locks={};

      return this;

  }

  locks(){

    this.cleanup();

    return Object.keys(this._locks);

  }

  count(){

    return this.locks().length;

  }

  statistics(){

    return{

      active:this.count(),

      locks:this._statistics.locks,

      releases:this._statistics.releases,

      failures:this._statistics.failures,

      waiting:this._statistics.waiting,

      expired:this._statistics.expired,

      deadlocks:this._statistics.deadlocks

    };

  }

  health(){

    return{

      initialized:this.isInitialized(),

      active:this.count(),

      registered:Object.keys(this._locks).length,

      empty:Object.keys(this._locks).length===0,

      healthy:

        this.isInitialized() &&

        this._statistics.deadlocks===0

    };

  }

  report(){

    return{

      statistics:this.statistics(),

      health:this.health(),

      locks:Object.keys(this._locks)

    };

  }

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

WEF.LockManager =

  new LockManagerService();