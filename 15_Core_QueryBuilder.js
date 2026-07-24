/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 15_Core_QueryBuilder.gs
 * Version     : 1.0.0
 * Description : Fluent Query Builder
 * =============================================================================
 */

'use strict';

class QueryBuilder extends BaseService{

  constructor(entityName){

    super("QueryBuilder");

    if(!entityName)
      throw new Error("Entity name is required.");

    this._entityName=entityName;

    this.reset();

    this.initialize();

  }

  //=========================================================================
  // Initialize
  //=========================================================================

  initialize(){

    super.initialize();

    return this;

  }

  reset(){

    this._conditions=[];

    this._orders=[];

    this._selected=null;

    this._limit=null;

    this._offset=0;

    this._distinct=false;

    return this;

  }

  //=========================================================================
  // Framework
  //=========================================================================

  entity(){

    return this._entityName;

  }

  database(){

    return WEF.Database;

  }

  schema(){

    return WEF.Schema.get(this._entityName);

  }

  repository(){

    if(WEF.Repository.has(this._entityName))
      return WEF.Repository.get(this._entityName);

    return null;

  }

  records(){

    return this.database().readAll(
      this._entityName
    );

  }

  key(){

    return this.schema().key;

  }

  clone(){

    const qb=new QueryBuilder(
      this._entityName
    );

    qb._conditions=
      WEF.Utilities.Object.clone(this._conditions);

    qb._orders=
      WEF.Utilities.Object.clone(this._orders);

    qb._selected=this._selected
      ?this._selected.slice()
      :null;

    qb._limit=this._limit;

    qb._offset=this._offset;

    qb._distinct=this._distinct;

    return qb;

  }

  //=========================================================================
  // Selection
  //=========================================================================

  select(fields){

    if(!Array.isArray(fields))
      fields=[fields];

    this._selected=fields;

    return this;

  }

  distinct(){

    this._distinct=true;

    return this;

  }

  //=========================================================================
  // Filtering
  //=========================================================================

  where(field,operator,value){

    if(arguments.length===2){

      value=operator;

      operator="=";

    }

    this._conditions.push({

      type:"AND",

      field:field,

      operator:operator,

      value:value

    });

    return this;

  }

  orWhere(field,operator,value){

    if(arguments.length===2){

      value=operator;

      operator="=";

    }

    this._conditions.push({

      type:"OR",

      field:field,

      operator:operator,

      value:value

    });

    return this;

  }

  whereIn(field,values){

    this._conditions.push({

      type:"AND",

      field:field,

      operator:"IN",

      value:values

    });

    return this;

  }

  whereNotIn(field,values){

    this._conditions.push({

      type:"AND",

      field:field,

      operator:"NOT IN",

      value:values

    });

    return this;

  }

  whereNull(field){

    return this.where(field,"=",null);

  }

  whereNotNull(field){

    return this.where(field,"!=",null);

  }

  //=========================================================================
  // Sorting
  //=========================================================================

  orderBy(field,direction="ASC"){

    this._orders.push({

      field:field,

      direction:String(direction).toUpperCase()

    });

    return this;

  }

  latest(field){

    return this.orderBy(field,"DESC");

  }

  oldest(field){

    return this.orderBy(field,"ASC");

  }

  //=========================================================================
  // Limiting
  //=========================================================================

  limit(value){

    this._limit=Math.max(0,Number(value));

    return this;

  }

  take(value){

    return this.limit(value);

  }

  offset(value){

    this._offset=Math.max(0,Number(value));

    return this;

  }

  skip(value){

    return this.offset(value);

  }

  //=========================================================================
  // Execution
  //=========================================================================

  get(){

    let records=this.records().slice();

    records=this.applyConditions(records);

    records=this.applySorting(records);

    records=this.applyOffset(records);

    records=this.applyLimit(records);

    records=this.applySelect(records);

    records=this.applyDistinct(records);

    return records;

  }

  getAll(){

    return this.get();

  }

  fetch(){

    return this.get();

  }

  execute(){

    return this.get();

  }

  first(){

    const records=this.limit(1).get();

    return records.length
      ?records[0]
      :null;

  }

  last(){

    const records=this.get();

    return records.length
      ?records[records.length-1]
      :null;

  }

  isEmpty(){

    return this.count()===0;

  }

  isNotEmpty(){

    return this.count()>0;

  }

  count(){

    return this.get().length;

  }

  exists(){

    return this.count()>0;

  }

  //=========================================================================
  // Aggregate
  //=========================================================================

  sum(field){

    return this.get().reduce((sum,row)=>{

      return sum+(Number(row[field])||0);

    },0);

  }

  average(field){

    const rows=this.get();

    if(rows.length===0)
      return 0;

    return this.sum(field)/rows.length;

  }

  min(field){

    const rows=this.get();

    if(rows.length===0)
      return null;

    return Math.min(

      ...rows.map(r=>Number(r[field]))

    );

  }

  max(field){

    const rows=this.get();

    if(rows.length===0)
      return null;

    return Math.max(

      ...rows.map(r=>Number(r[field]))

    );

  }

  //=========================================================================
  // Internal Engine
  //=========================================================================

  applyConditions(records){

    if(this._conditions.length===0)
      return records;

    return records.filter(record=>{

      let result=null;

      this._conditions.forEach(condition=>{

        const current=this.evaluate(

          record,

          condition

        );

        if(result===null){

          result=current;

          return;

        }

        if(condition.type==="AND")
          result=result&&current;
        else
          result=result||current;

      });

      return result;

    });

  }

  evaluate(record,condition){

    const value=record[condition.field];

    const expected=condition.value;

    switch(condition.operator){

      case "=":

        return value==expected;

      case "!=":

        return value!=expected;

      case ">":

        return value>expected;

      case "<":

        return value<expected;

      case ">=":

        return value>=expected;

      case "<=":

        return value<=expected;

      case "IN":

        return expected.includes(value);

      case "NOT IN":

        return !expected.includes(value);

      default:

        return false;

    }

  }

  applySorting(records){

    if(this._orders.length===0)
      return records;

    records.sort((a,b)=>{

      for(const order of this._orders){

        if(a[order.field]==b[order.field])
          continue;

        if(order.direction==="ASC")
          return a[order.field]>b[order.field]?1:-1;

        return a[order.field]<b[order.field]?1:-1;

      }

      return 0;

    });

    return records;

  }

  applyOffset(records){

    return records.slice(this._offset);

  }

  applyLimit(records){

    if(this._limit===null)
      return records;

    return records.slice(0,this._limit);

  }

  applySelect(records){

    if(!this._selected)
      return records;

    return records.map(record=>{

      const obj={};

      this._selected.forEach(field=>{

        obj[field]=record[field];

      });

      return obj;

    });

  }

  applyDistinct(records){

    if(!this._distinct)
      return records;

    const unique=[];

    const seen=new Set();

    records.forEach(record=>{

      const key=JSON.stringify(record);

      if(!seen.has(key)){

        seen.add(key);

        unique.push(record);

      }

    });

    return unique;

  }

  //=========================================================================
  // Pagination
  //=========================================================================

  paginate(page,size){

    page=Math.max(1,Number(page)||1);

    size=Math.max(1,Number(size)||10);

    const total=this.count();

    const pages=Math.ceil(total/size);

    const data=this.clone()
      .offset((page-1)*size)
      .limit(size)
      .get();

    return{

      page:page,

      pageSize:size,

      total:total,

      totalPages:pages,

      data:data

    };

  }

  //=========================================================================
  // Helpers
  //=========================================================================

  pluck(field){

    return this.get().map(record=>record[field]);

  }

  value(field){

    const row=this.first();

    return row?row[field]:null;

  }

  keys(){

    const row=this.first();

    return row?Object.keys(row):[];

  }

  toArray(){

    return this.get();

  }

  toJson(){

    return JSON.stringify(

      this.get(),

      null,

      2

    );

  }

  clear(){

    return this.reset();

  }

  //=========================================================================
  // Information
  //=========================================================================

  statistics(){

    return{

      entity:this._entityName,

      rows:this.count(),

      conditions:this._conditions.length,

      orders:this._orders.length,

      selected:this._selected
        ?this._selected.length
        :0,

      limit:this._limit,

      offset:this._offset,

      distinct:this._distinct

    };

  }

  info(){

    return{

      service:this.getName(),

      version:this.getVersion(),

      initialized:this.isInitialized(),

      entity:this._entityName,

      created:this.getCreatedTime(),

      statistics:this.statistics()

    };

  }

}

/**
 * ============================================================================
 * Query Builder Factory
 * ============================================================================
 */

WEF.QueryBuilder={

  table(entityName){

    return new QueryBuilder(entityName);

  },

  entity(entityName){

    return new QueryBuilder(entityName);

  },

  query(entityName){

    return new QueryBuilder(entityName);

  }

};