/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 11_Core_SchemaEngine.gs
 * Version     : 1.0.0
 * Part        : 1 of 6
 * Description : Schema Registry Engine
 * =============================================================================
 */

'use strict';

class SchemaEngineService extends BaseService{

constructor(){
super("SchemaEngine");
this.initialize();
}

initialize(){
super.initialize();
this._schemas={};
return this;
}

//=========================================================================
// Internal
//=========================================================================

_clone(obj){
return JSON.parse(JSON.stringify(obj));
}

_exists(name){
return Object.prototype.hasOwnProperty.call(this._schemas,name);
}

has(entityName){
return this.exists(entityName);
}

//=========================================================================
// Schema Registration
//=========================================================================

register(entityName){

if(!entityName)
throw new Error("Entity name is required.");

if(this._exists(entityName))
return this;

const entity=WEF.EntityManager.get(entityName);

if(!entity)
throw new Error("Entity '"+entityName+"' is not registered.");

this._schemas[entityName]={
entity:entity.name,
sheet:entity.sheet,
key:entity.key,
fields:this._clone(entity.fields),
relationships:this._clone(entity.relationships),
version:WEF.Config.version(),
created:new Date(),
lastSync:null
};

return this;

}

unregister(entityName){

delete this._schemas[entityName];

return this;

}

exists(entityName){

return this._exists(entityName);

}

get(entityName){

if(!this.exists(entityName))
return null;

return this._clone(this._schemas[entityName]);

}

list(){

return Object.keys(this._schemas);

}

count(){

return this.list().length;

}

//=========================================================================
// Sheet Management
//=========================================================================

spreadsheet(){
return SpreadsheetApp.getActiveSpreadsheet();
}

sheetExists(sheetName){
return this.spreadsheet().getSheetByName(sheetName)!==null;
}

getSheet(sheetName){
return this.spreadsheet().getSheetByName(sheetName);
}

createSheet(sheetName){

if(this.sheetExists(sheetName))
return this.getSheet(sheetName);

const sheet=this.spreadsheet().insertSheet(sheetName);

return sheet;

}

deleteSheet(sheetName){

const sheet=this.getSheet(sheetName);

if(sheet)
this.spreadsheet().deleteSheet(sheet);

return this;

}

//=========================================================================
// Header Management
//=========================================================================

createHeaders(entityName){

const schema=this.get(entityName);

if(!schema)
throw new Error("Schema '"+entityName+"' not found.");

const sheet=this.createSheet(schema.sheet);

const headers=schema.fields.map(f=>f.name);

sheet.getRange(1,1,1,headers.length).setValues([headers]);

return this;

}

freezeHeader(entityName){

const schema=this.get(entityName);

if(!schema)
return this;

const sheet=this.getSheet(schema.sheet);

sheet.setFrozenRows(1);

return this;

}

applyFilter(entityName){

const schema=this.get(entityName);

if(!schema)
return this;

const sheet=this.getSheet(schema.sheet);

const lastColumn=schema.fields.length;

if(lastColumn>0){

const range=sheet.getRange(1,1,1,lastColumn);

if(sheet.getFilter())
sheet.getFilter().remove();

range.createFilter();

}

return this;

}

autoResize(entityName){

const schema=this.get(entityName);

if(!schema)
return this;

const sheet=this.getSheet(schema.sheet);

const lastColumn=schema.fields.length;

for(let c=1;c<=lastColumn;c++){

sheet.autoResizeColumn(c);

}

return this;

}

applyHeaderStyle(entityName){

const schema=this.get(entityName);

if(!schema)
return this;

const sheet=this.getSheet(schema.sheet);

const lastColumn=schema.fields.length;

const range=sheet.getRange(1,1,1,lastColumn);

range
.setBackground("#0B5394")
.setFontColor("#FFFFFF")
.setFontWeight("bold")
.setHorizontalAlignment("center");

return this;

}

//=========================================================================
// Synchronize
//=========================================================================

sync(entityName){

const schema=this.get(entityName);

if(!schema)
throw new Error("Schema '"+entityName+"' not found.");

this.createHeaders(entityName);
this.format(entityName);

schema.lastSync=new Date();

return this;

}

//=========================================================================
// Schema Migration
//=========================================================================

getHeaders(entityName){

const schema=this.get(entityName);

if(!schema)
throw new Error("Schema '"+entityName+"' not found.");

const sheet=this.getSheet(schema.sheet);

if(!sheet)
return [];

const lastColumn=sheet.getLastColumn();

if(lastColumn===0)
return [];

return sheet.getRange(1,1,1,lastColumn).getValues()[0];

}

missingFields(entityName){

const schema=this.get(entityName);

if(!schema)
throw new Error("Schema '"+entityName+"' not found.");

const headers=this.getHeaders(entityName);

return schema.fields.filter(field=>!headers.includes(field.name));

}

extraColumns(entityName){

const schema=this.get(entityName);

if(!schema)
throw new Error("Schema '"+entityName+"' not found.");

const headers=this.getHeaders(entityName);

return headers.filter(header=>
!schema.fields.some(field=>field.name===header)
);

}

addMissingColumns(entityName){

const schema=this.get(entityName);

if(!schema)
throw new Error("Schema '"+entityName+"' not found.");

const sheet=this.getSheet(schema.sheet);

const headers=this.getHeaders(entityName);

const missing=this.missingFields(entityName);

missing.forEach(field=>{

const column=headers.length+1;

sheet.getRange(1,column).setValue(field.name);

headers.push(field.name);

});

return missing.length;

}

validateHeaders(entityName){

const missing=this.missingFields(entityName);

const extra=this.extraColumns(entityName);

return{

valid:missing.length===0,

missing:missing.map(f=>f.name),

extra:extra

};

}

migrate(entityName){

const schema=this.get(entityName);

if(!schema)
throw new Error("Schema '"+entityName+"' not found.");

if(!this.sheetExists(schema.sheet)){

this.sync(entityName);

return{

created:true,
added:schema.fields.length,
missing:[],
extra:[]

};

}

const added=this.addMissingColumns(entityName);

this.format(entityName);

schema.lastSync=new Date();

return{

created:false,
added:added,
validation:this.validateHeaders(entityName)

};

}

//=========================================================================
// Field Formatting Engine
//=========================================================================

applyFieldFormats(entityName){

const schema=this.get(entityName);

if(!schema)
throw new Error("Schema '"+entityName+"' not found.");

const sheet=this.getSheet(schema.sheet);

schema.fields.forEach((field,index)=>{

const column=index+1;
const range=sheet.getRange(2,column,Math.max(sheet.getMaxRows()-1,1),1);

switch(String(field.type||"STRING").toUpperCase()){

case "NUMBER":
range.setNumberFormat("#,##0.00");
break;

case "INTEGER":
range.setNumberFormat("0");
break;

case "CURRENCY":
range.setNumberFormat("#,##0.00");
break;

case "PERCENT":
range.setNumberFormat("0.00%");
break;

case "DATE":
range.setNumberFormat("dd/MM/yyyy");
break;

case "DATETIME":
range.setNumberFormat("dd/MM/yyyy HH:mm:ss");
break;

case "TIME":
range.setNumberFormat("HH:mm:ss");
break;

case "BOOLEAN":
range.insertCheckboxes();
break;

default:
range.setNumberFormat("@");

}

});

return this;

}

//=========================================================================
// Required Field Highlight
//=========================================================================

highlightRequiredFields(entityName){

const schema=this.get(entityName);

if(!schema)
return this;

const sheet=this.getSheet(schema.sheet);

schema.fields.forEach((field,index)=>{

if(field.required){

sheet.getRange(1,index+1)
.setBackground("#C00000")
.setFontColor("#FFFFFF")
.setFontWeight("bold");

}

});

return this;

}

//=========================================================================
// Auto Column Width
//=========================================================================

setDefaultWidths(entityName){

const schema=this.get(entityName);

if(!schema)
return this;

const sheet=this.getSheet(schema.sheet);

schema.fields.forEach((field,index)=>{

const column=index+1;

switch(String(field.type||"STRING").toUpperCase()){

case "DATE":
case "DATETIME":
sheet.setColumnWidth(column,140);
break;

case "BOOLEAN":
sheet.setColumnWidth(column,90);
break;

case "NUMBER":
case "INTEGER":
case "CURRENCY":
case "PERCENT":
sheet.setColumnWidth(column,120);
break;

default:
sheet.setColumnWidth(column,180);

}

});

return this;

}

//=========================================================================
// Apply Complete Layout
//=========================================================================

format(entityName){

this.applyHeaderStyle(entityName);
this.freezeHeader(entityName);
this.applyFilter(entityName);
this.autoResize(entityName);
this.applyFieldFormats(entityName);
this.highlightRequiredFields(entityName);
this.setDefaultWidths(entityName);

return this;

}

//=========================================================================
// Schema Versioning
//=========================================================================

setVersion(entityName,version){

const schema=this._schemas[entityName];

if(!schema)
throw new Error("Schema '"+entityName+"' not found.");

schema.version=version;

return this;

}

getVersion(entityName){

const schema=this._schemas[entityName];

return schema?schema.version:null;

}

touch(entityName){

const schema=this._schemas[entityName];

if(schema)
schema.lastSync=new Date();

return this;

}

//=========================================================================
// Snapshot
//=========================================================================

snapshot(entityName){

const schema=this.get(entityName);

if(!schema)
throw new Error("Schema '"+entityName+"' not found.");

return{
entity:schema.entity,
sheet:schema.sheet,
version:schema.version,
fields:this._clone(schema.fields),
relationships:this._clone(schema.relationships),
created:schema.created,
lastSync:schema.lastSync,
snapshotDate:new Date()
};

}

compare(snapshot){

const current=this.get(snapshot.entity);

if(!current)
throw new Error("Schema '"+snapshot.entity+"' not found.");

const currentFields=current.fields.map(f=>f.name);
const oldFields=snapshot.fields.map(f=>f.name);

return{
added:currentFields.filter(f=>!oldFields.includes(f)),
removed:oldFields.filter(f=>!currentFields.includes(f)),
changed:this.getVersion(snapshot.entity)!==snapshot.version
};

}

//=========================================================================
// Export / Import
//=========================================================================

exportSchema(entityName){

return JSON.stringify(this.snapshot(entityName),null,2);

}

importSchema(json){

const schema=typeof json==="string"?JSON.parse(json):json;

this._schemas[schema.entity]=this._clone(schema);

return this;

}

//=========================================================================
// Statistics
//=========================================================================

statistics(){

let schemaCount=0;
let fieldCount=0;
let relationshipCount=0;

Object.keys(this._schemas).forEach(name=>{

schemaCount++;

fieldCount+=this._schemas[name].fields.length;

relationshipCount+=this._schemas[name].relationships.length;

});

return{
schemas:schemaCount,
fields:fieldCount,
relationships:relationshipCount
};

}

clear(){

this._schemas={};

return this;

}

info(){

return{

service:this.getName(),

version:this.getVersion(),

created:this.getCreatedTime(),

initialized:this.isInitialized(),

statistics:this.statistics()

};

}

}

WEF.Schema=new SchemaEngineService();

WEF.ServiceRegistry.register(
"SchemaEngine",
WEF.Schema
);

/**
 * =============================================================================
 * Test
 * =============================================================================
 */

/**
 * =============================================================================
 * TEST
 * =============================================================================
 */

function test_SchemaEngine() {

WEF.Kernel.boot();

WEF.EntityManager.initialize();

WEF.Schema.initialize();

WEF.EntityManager.clear();

WEF.Schema.clear();

WEF.EntityManager.register({

name:"Customer",

module:"Sales",

sheet:"Customers",

key:"CustomerID"

});

WEF.EntityManager.addField("Customer",{

name:"CustomerID",

type:"STRING",

required:true,

primaryKey:true

});

WEF.EntityManager.addField("Customer",{

name:"CustomerName",

type:"STRING",

required:true

});

WEF.EntityManager.addField("Customer",{

name:"Phone",

type:"STRING"

});

WEF.EntityManager.addField("Customer",{

name:"Email",

type:"STRING"

});

WEF.EntityManager.addField("Customer",{

name:"CreditLimit",

type:"NUMBER"

});

Logger.log("========== CREATE SCHEMA ==========");

Logger.log(

WEF.Schema.register("Customer"),
WEF.Schema.sync("Customer")

);

Logger.log("========== EXISTS ==========");

Logger.log(

WEF.Schema.exists("Customer")

);

Logger.log("========== HAS ==========");

Logger.log(

WEF.Schema.has("Customer")

);

Logger.log("========== GET SCHEMA ==========");

Logger.log(

WEF.Schema.get("Customer")

);

Logger.log("========== FIELD NAMES ==========");

Logger.log("========== VALIDATION ==========");

Logger.log("========== SNAPSHOT ==========");

Logger.log(

WEF.Schema.snapshot("Customer")

);

Logger.log("========== STATISTICS ==========");

Logger.log(

WEF.Schema.statistics()

);

Logger.log("========== INFO ==========");

Logger.log(

WEF.Schema.info()

);

}