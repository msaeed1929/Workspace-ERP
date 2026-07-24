/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 12_Core_Database.gs
 * Version     : 1.0.0
 * Part        : 1 of 8
 * Description : Database Service
 * =============================================================================
 */

'use strict';

class DatabaseService extends BaseService{

constructor(){
super("Database");
this.initialize();
}

initialize(){
super.initialize();
this._spreadsheet=SpreadsheetApp.getActiveSpreadsheet();
this._cache={};
this._batch=[];
this._connected=true;
return this;
}

//=========================================================================
// Connection
//=========================================================================

connect(){
this._spreadsheet=SpreadsheetApp.getActiveSpreadsheet();
this._connected=true;
return this;
}

disconnect(){
this._connected=false;
return this;
}

isConnected(){
return this._connected;
}

spreadsheet(){
if(!this._connected)
throw new Error("Database is not connected.");
return this._spreadsheet;
}

sheet(entityName){

if(!WEF.EntityManager.has(entityName))
throw new Error("Entity '"+entityName+"' is not registered.");

const schema=WEF.Schema.get(entityName);

if(!schema)
throw new Error("Schema '"+entityName+"' not found.");

const sheet=this.spreadsheet().getSheetByName(schema.sheet);

if(!sheet)
throw new Error("Sheet '"+schema.sheet+"' not found.");

return sheet;

}

schema(entityName){

const schema=WEF.Schema.get(entityName);

if(!schema)
throw new Error("Schema '"+entityName+"' not found.");

return schema;

}

entity(entityName){

const entity=WEF.EntityManager.get(entityName);

if(!entity)
throw new Error("Entity '"+entityName+"' not found.");

return entity;

}

//=========================================================================
// Headers
//=========================================================================

headers(entityName){

return this.schema(entityName).fields.map(field=>field.name);

}

headerIndex(entityName){

const map={};

this.headers(entityName).forEach((header,index)=>{

map[header]=index;

});

return map;

}

columnNumber(entityName,field){

const index=this.headerIndex(entityName);

if(index[field]===undefined)
return null;

return index[field]+1;

}

//=========================================================================
// Sheet Information
//=========================================================================

lastRow(entityName){

return this.sheet(entityName).getLastRow();

}

lastColumn(entityName){

return this.sheet(entityName).getLastColumn();

}

dataRange(entityName){

return this.sheet(entityName).getDataRange();

}

hasData(entityName){

return this.lastRow(entityName)>1;

}

//=========================================================================
// Reading Engine
//=========================================================================

rows(entityName){

const sheet=this.sheet(entityName);

const lastRow=sheet.getLastRow();

const lastColumn=sheet.getLastColumn();

if(lastRow<=1)
return [];

return sheet.getRange(2,1,lastRow-1,lastColumn).getValues();

}

toObject(entityName,row){

const headers=this.sheet(entityName)
.getRange(1,1,1,this.lastColumn(entityName))
.getValues()[0];

const obj={};

headers.forEach((header,index)=>{

obj[header]=row[index];

});

return obj;

}

all(entityName){

return this.readAll(entityName);

}

readAll(entityName){

if(this.isCached(entityName))
return this.getCache(entityName);

const rows=this.rows(entityName);

const records=rows.map(row=>

this.toObject(entityName,row)

);

const converted=this.convertRecords(

entityName,

records

);

this.setCache(entityName,converted);

return converted;

}

findAll(entityName){

return this.readAll(entityName);

}

count(entityName){

return this.rows(entityName).length;

}

exists(entityName,id){

const schema=this.schema(entityName);

return this.findById(entityName,id)!==null;

}

findById(entityName,id){

const schema=this.schema(entityName);

const key=schema.key;

const records=this.readAll(entityName);

for(const record of records){

if(record[key]==id)
return record;

}

return null;

}

findOne(entityName,predicate){

const records=this.readAll(entityName);

for(const record of records){

if(predicate(record))
return record;

}

return null;

}

filter(entityName,predicate){

return this.readAll(entityName)

.filter(predicate);

}

//=========================================================================
// Cache Engine
//=========================================================================

cacheKey(entityName){
return "DB_"+entityName;
}

isCached(entityName){
return Object.prototype.hasOwnProperty.call(this._cache,this.cacheKey(entityName));
}

getCache(entityName){
return this._cache[this.cacheKey(entityName)]||null;
}

setCache(entityName,data){
this._cache[this.cacheKey(entityName)]=JSON.parse(JSON.stringify(data));
return data;
}

clearCache(entityName){
if(entityName){
delete this._cache[this.cacheKey(entityName)];
}else{
this._cache={};
}
return this;
}

refresh(entityName){
this.clearCache(entityName);
return this.readAll(entityName);
}

//=========================================================================
// Insert Engine
//=========================================================================

prepareRecord(entityName,data){

const schema=this.schema(entityName);

const record={};

schema.fields.forEach(field=>{

let value=data[field.name];

if(value===undefined||value===null||value==="")
value=field.defaultValue;

record[field.name]=value;

});

return record;

}

toRow(entityName,record){

const headers=this.headers(entityName);

return headers.map(header=>record[header]);

}

insert(entityName,data){

const validator=WEF.Validator;

validator.clear();

const record=this.prepareRecord(entityName,data);

const schema=this.schema(entityName);

schema.fields.forEach(field=>{

if(field.required){

validator.required(

field.name,

record[field.name]

);

}

});

if(validator.hasErrors()){

throw new Error(

JSON.stringify(

validator.getErrors(),

null,

2

)

);

}

const row=this.toRow(entityName,record);

this.sheet(entityName).appendRow(row);

this.clearCache(entityName);

return record;

}

insertMany(entityName,records){

const inserted=[];

records.forEach(record=>{

inserted.push(

this.insert(entityName,record)

);

});

return inserted;

}

//=========================================================================
// Update Engine
//=========================================================================

rowIndexById(entityName,id){

const schema=this.schema(entityName);
const key=schema.key;
const records=this.readAll(entityName);

for(let i=0;i<records.length;i++){

if(records[i][key]==id)
return i+2;

}

return -1;

}

update(entityName,id,data){

const rowIndex=this.rowIndexById(entityName,id);

if(rowIndex<2)
throw new Error("Record not found.");

const existing=this.findById(entityName,id);

const updated=Object.assign({},existing,data);

const row=this.toRow(entityName,updated);

this.sheet(entityName)
.getRange(rowIndex,1,1,row.length)
.setValues([row]);

this.clearCache(entityName);

return updated;

}

updateMany(entityName,records){

const result=[];

records.forEach(record=>{

const schema=this.schema(entityName);

result.push(

this.update(

entityName,

record[schema.key],

record

)

);

});

return result;

}

upsert(entityName,data){

const schema=this.schema(entityName);

const id=data[schema.key];

if(this.exists(entityName,id))
return this.update(entityName,id,data);

return this.insert(entityName,data);

}

//=========================================================================
// Delete Engine
//=========================================================================

delete(entityName,criteria){
  const records=this.all(entityName);
  const headers=this.headers(entityName);
  const sheet=this.sheet(entityName);

  const index=records.findIndex(record=>{
    return Object.keys(criteria).every(key=>record[key]===criteria[key]);
  });

  if(index===-1)
    return false;

  sheet.deleteRow(index+2);
  this.clearCache(entityName);
  return true;
}

deleteMany(entityName,criteriaList){
  let deleted=0;

  for(let i=criteriaList.length-1;i>=0;i--){
    if(this.delete(entityName,criteriaList[i]))
      deleted++;
  }

  return deleted;
}

//=========================================================================
// Truncate Engine
//=========================================================================

truncate(entityName){

const sheet=this.sheet(entityName);

const lastRow=sheet.getLastRow();

if(lastRow>1){

sheet.getRange(

2,

1,

lastRow-1,

sheet.getLastColumn()

).clearContent();

}

this.clearCache(entityName);

return true;

}

//=========================================================================
// Query Engine
//=========================================================================

where(entityName, criteria) {

  const rows = this.readAll(entityName);

  if (!criteria)
    return rows;

  if (typeof criteria === "function")
    return rows.filter(criteria);

  if (typeof criteria === "object") {

    return rows.filter(function(row) {

      return Object.keys(criteria).every(function(key) {

        return row[key] === criteria[key];

      });

    });

  }

  return [];

}

select(entityName,fields){

return this.readAll(entityName).map(record=>{

const obj={};

fields.forEach(field=>{
obj[field]=record[field];
});

return obj;

});

}

orderBy(entityName,field,direction="ASC"){

const records=this.readAll(entityName).slice();

records.sort((a,b)=>{

if(a[field]==b[field]) return 0;

if(direction.toUpperCase()=="DESC")
return a[field]>b[field]?-1:1;

return a[field]>b[field]?1:-1;

});

return records;

}

limit(entityName,limit){

return this.readAll(entityName).slice(0,limit);

}

offset(entityName,offset){

return this.readAll(entityName).slice(offset);

}

paginate(entityName,page,pageSize){

const records=this.readAll(entityName);

const start=(page-1)*pageSize;

return{

page:page,

pageSize:pageSize,

totalRecords:records.length,

totalPages:Math.ceil(records.length/pageSize),

data:records.slice(start,start+pageSize)

};

}

distinct(entityName,field){

return [...new Set(

this.readAll(entityName)

.map(r=>r[field])

)];

}

sum(entityName,field){

return this.readAll(entityName)

.reduce((a,b)=>a+(Number(b[field])||0),0);

}

average(entityName,field){

const records=this.readAll(entityName);

if(records.length===0)
return 0;

return this.sum(entityName,field)/records.length;

}

min(entityName,field){

const values=this.readAll(entityName)

.map(r=>Number(r[field]));

return Math.min(...values);

}

max(entityName,field){

const values=this.readAll(entityName)

.map(r=>Number(r[field]));

return Math.max(...values);

}

//=========================================================================
// Type Conversion Engine
//=========================================================================

convertValue(field,value){

if(value===null||value===undefined||value==="")
return value;

const type=String(field.type||"STRING").toUpperCase();

switch(type){

case "STRING":
case "TEXT":
case "PHONE":
case "CNIC":
case "NTN":
case "STRN":
case "IBAN":
case "EMAIL":
case "URL":
case "SKU":
case "BARCODE":
case "CODE":
return String(value);

case "NUMBER":
case "DECIMAL":
case "CURRENCY":
return Number(value);

case "INTEGER":
return parseInt(value,10);

case "BOOLEAN":

if(typeof value==="boolean")
return value;

if(typeof value==="number")
return value!==0;

const text=String(value).trim().toLowerCase();

return ["true","yes","1","y"].includes(text);

case "DATE":
case "DATETIME":

if(value instanceof Date)
return value;

return new Date(value);

default:
return value;

}

}

convertRecord(entityName,record){

const schema=this.schema(entityName);

const converted={};

schema.fields.forEach(field=>{

converted[field.name]=this.convertValue(

field,

record[field.name]

);

});

return converted;

}

convertRecords(entityName,records){

return records.map(record=>

this.convertRecord(entityName,record)

);

}

//=========================================================================
// Batch & Transaction Engine
//=========================================================================

beginBatch(){
this._batch=[];
return this;
}

batchInsert(entityName,data){
this._batch.push({
operation:"INSERT",
entity:entityName,
data:data
});
return this;
}

batchUpdate(entityName,id,data){
this._batch.push({
operation:"UPDATE",
entity:entityName,
id:id,
data:data
});
return this;
}

batchDelete(entityName,id){
this._batch.push({
operation:"DELETE",
entity:entityName,
id:id
});
return this;
}

commit(){

const lock=LockService.getDocumentLock();

lock.waitLock(WEF.Config.get("LOCK_TIMEOUT")||30000);

try{

const results=[];

this._batch.forEach(item=>{

switch(item.operation){

case "INSERT":
results.push(this.insert(item.entity,item.data));
break;

case "UPDATE":
results.push(this.update(item.entity,item.id,item.data));
break;

case "DELETE":
results.push(this.delete(item.entity,item.id));
break;

}

});

this._batch=[];

return results;

}
finally{

lock.releaseLock();

}

}

rollback(){
this._batch=[];
return true;
}

runTransaction(callback){

const lock=LockService.getDocumentLock();

lock.waitLock(WEF.Config.get("LOCK_TIMEOUT")||30000);

try{

return callback(this);

}
finally{

lock.releaseLock();

}

}

health(){

return{

connected:this.isConnected(),

spreadsheet:this.spreadsheet().getName(),

cacheEntities:Object.keys(this._cache).length,

batchOperations:this._batch.length,

services:{

validator:!!WEF.Validator,

schema:!!WEF.Schema,

entityManager:!!WEF.EntityManager

}

};

}

//=========================================================================
// Statistics
//=========================================================================

statistics(){

return{

connected:this.isConnected(),

cacheEntities:Object.keys(this._cache).length,

batchOperations:this._batch.length,

memoryCache:Object.keys(this._cache),

timestamp:new Date()

};

}

info() {
  
  return{

  service:this.getName(),

  version:this.getVersion(),

  initialized:this.isInitialized(),

  created:this.getCreatedTime(),

  statistics:this.statistics(),

  connected:this._connected,

  spreadsheet:this.spreadsheet().getName(),

  entityManager:!!WEF.EntityManager,

  schemaEngine:!!WEF.Schema

  };
}

}

WEF.Database=new DatabaseService();

/**
 * =============================================================================
 * TEST
 * =============================================================================
 */

function test_Database() {

WEF.Kernel.boot();

WEF.Schema.initialize();

WEF.EntityManager.initialize();

WEF.Database.initialize();

WEF.EntityManager.clear();

WEF.Schema.clear();

WEF.EntityManager.register({
name:"Customer",
sheet:"Customers",
key:"CustomerID"
});

WEF.EntityManager.addField("Customer",{
name:"CustomerID",
primaryKey:true
});

WEF.EntityManager.addField("Customer",{
name:"CustomerName"
});

WEF.Schema.register("Customer");

WEF.Schema.sync("Customer");

const sheet=WEF.Database.sheet("Customer");

sheet.clearContents();

sheet.getRange(1,1,1,2).setValues([[
"CustomerID",
"CustomerName"
]]);

WEF.Database.truncate("Customer");

WEF.Database.beginBatch();

WEF.Database.batchInsert("Customer",{
CustomerID:"CUS001",
CustomerName:"ABC Traders"
});

WEF.Database.batchInsert("Customer",{
CustomerID:"CUS002",
CustomerName:"XYZ Textile"
});

WEF.Database.batchInsert("Customer",{
CustomerID:"CUS003",
CustomerName:"Royal Fabrics"
});

Logger.log("========== Pending Batch ==========");

Logger.log(WEF.Database.statistics());

WEF.Database.commit();

Logger.log("========== After Commit ==========");

Logger.log(WEF.Database.readAll("Customer"));

WEF.Database.runTransaction(db=>{

db.update("Customer","CUS002",{
CustomerName:"XYZ Textile Pvt Ltd"
});

db.insert("Customer",{
CustomerID:"CUS004",
CustomerName:"New Customer"
});

});

Logger.log("========== After Transaction ==========");

Logger.log(WEF.Database.readAll("Customer"));

Logger.log("========== Health ==========");

Logger.log(WEF.Database.health());

Logger.log("========== Statistics ==========");

Logger.log(WEF.Database.statistics());

Logger.log("========== Service Info ==========");

Logger.log(WEF.Database.info());

}