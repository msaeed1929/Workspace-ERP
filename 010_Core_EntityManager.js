/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 10_Core_EntityManager.gs
 * Version     : 1.0.0
 * Part        : 1 of 5
 * Description : Dynamic Entity Registry
 * =============================================================================
 */

'use strict';

class EntityManagerService extends BaseService{

constructor(){
super("EntityManager");
this.initialize();
}

initialize(){
super.initialize();
this._entities={};
return this;
}

//=========================================================================
// Internal
//=========================================================================

_clone(object){
return JSON.parse(JSON.stringify(object));
}

_exists(name){
return Object.prototype.hasOwnProperty.call(this._entities,name);
}

has(name){
return this.exists(name);
}

//=========================================================================
// Entity Registration
//=========================================================================

register(definition){

if(!definition)
throw new Error("Entity definition is required.");

if(!definition.name)
throw new Error("Entity name is required.");

if(this._exists(definition.name))
throw new Error("Entity '"+definition.name+"' already exists.");

const entity=this._clone(definition);

entity.fields=entity.fields||[];
entity.relationships=entity.relationships||[];
entity.actions=entity.actions||[];
entity.created=new Date();

this._entities[entity.name]=entity;

if(typeof WEF.Metadata!=="undefined"){
WEF.Metadata.registerEntity(entity.name,{
module:entity.module||"",
sheet:entity.sheet||"",
key:entity.key||"",
name:entity.name
});
}

return this;

}

unregister(name){
delete this._entities[name];
return this;
}

update(name,definition){

if(!this._exists(name))
throw new Error("Entity '"+name+"' not found.");

Object.assign(
  this._entities[name],
  this._clone(definition)
  );

  return this;

}

get(name){

if(!this._exists(name))
return null;

return this._clone(this._entities[name]);

}

exists(name){
return this._exists(name);
}

list(){
return Object.keys(this._entities);
}

count(){
return this.list().length;
}

//=========================================================================
// Field Management
//=========================================================================

addField(entityName,field){

const entity=this._entities[entityName];

if(!entity)
throw new Error("Entity '"+entityName+"' not found.");

if(!field.name)
throw new Error("Field name is required.");

field.type=field.type||"STRING";
field.required=field.required||false;
field.primaryKey=field.primaryKey||false;
field.unique=field.unique||false;
field.defaultValue=field.defaultValue??null;
field.readOnly=field.readOnly||false;
field.visible=field.visible!==false;
field.searchable=field.searchable||false;
field.sortable=field.sortable||false;
field.filterable=field.filterable||false;
field.created=new Date();

if(this.fieldExists(entityName,field.name))
throw new Error(
"Field '"+field.name+"' already exists."
);

entity.fields.push(this._clone(field));

return this;

}

getFields(entityName){

const entity=this._entities[entityName];

if(!entity)
return [];

return this._clone(entity.fields);

}

getField(entityName,fieldName){

const entity=this._entities[entityName];

if(!entity)
return null;

const field=entity.fields.find(f=>f.name===fieldName);

return field?this._clone(field):null;

}

fieldExists(entityName,fieldName){

return this.getField(entityName,fieldName)!==null;

}

removeField(entityName,fieldName){

const entity=this._entities[entityName];

if(!entity)
return this;

entity.fields=entity.fields.filter(f=>f.name!==fieldName);

return this;

}

primaryKey(entityName){

const entity=this._entities[entityName];

if(!entity)
return null;

const field=entity.fields.find(f=>f.primaryKey);

return field?field.name:null;

}

requiredFields(entityName){

const entity=this._entities[entityName];

if(!entity)
return [];

return entity.fields
.filter(f=>f.required)
.map(f=>f.name);

}

searchableFields(entityName){

const entity=this._entities[entityName];

if(!entity)
return [];

return entity.fields
.filter(f=>f.searchable)
.map(f=>f.name);

}

//=========================================================================
// Relationship Management
//=========================================================================

addRelationship(entityName,relationship){

const entity=this._entities[entityName];

if(!entity)
throw new Error("Entity '"+entityName+"' not found.");

if(!relationship.name)
throw new Error("Relationship name is required.");

relationship.type=relationship.type||"OneToMany";
relationship.entity=relationship.entity||"";
relationship.localKey=relationship.localKey||"";
relationship.foreignKey=relationship.foreignKey||"";
relationship.cascadeDelete=relationship.cascadeDelete||false;
relationship.cascadeUpdate=relationship.cascadeUpdate||false;
relationship.required=relationship.required||false;
relationship.created=new Date();

if(this.relationshipExists(
entityName,
relationship.name
))
throw new Error(
"Relationship '"+relationship.name+"' already exists."
);

entity.relationships.push(this._clone(relationship));

return this;

}

getRelationships(entityName){

const entity=this._entities[entityName];

if(!entity)
return [];

return this._clone(entity.relationships);

}

getRelationship(entityName,relationshipName){

const entity=this._entities[entityName];

if(!entity)
return null;

const relationship=entity.relationships.find(r=>r.name===relationshipName);

return relationship?this._clone(relationship):null;

}

relationshipExists(entityName,relationshipName){

return this.getRelationship(entityName,relationshipName)!==null;

}

removeRelationship(entityName,relationshipName){

const entity=this._entities[entityName];

if(!entity)
return this;

entity.relationships=entity.relationships.filter(r=>r.name!==relationshipName);

return this;

}

//=========================================================================
// Child Entities
//=========================================================================

childEntities(entityName){

const entity=this._entities[entityName];

if(!entity)
return [];

return entity.relationships.map(r=>r.entity);

}

//=========================================================================
// Parent Entities
//=========================================================================

parentEntities(entityName){

const parents=[];

Object.values(this._entities).forEach(entity=>{

entity.relationships.forEach(rel=>{

if(rel.entity===entityName){

parents.push(entity.name);

}

});

});

return parents;

}

//=========================================================================
// Entity Behaviors
//=========================================================================

setBehavior(entityName,behavior){

const entity=this._entities[entityName];

if(!entity)
throw new Error("Entity '"+entityName+"' not found.");

entity.behavior=Object.assign({

autoNumber:false,
softDelete:true,
audit:true,
approval:false,
workflow:false,
attachments:false,
comments:false,
history:true,
timestamps:true,
ownerTracking:true

},behavior||{});

return this;

}

getBehavior(entityName){

const entity=this._entities[entityName];

if(!entity)
return null;

return this._clone(entity.behavior||{});

}

//=========================================================================
// Entity Events
//=========================================================================

registerEvent(entityName,eventName,callback){

const entity=this._entities[entityName];

if(!entity)
throw new Error("Entity '"+entityName+"' not found.");

if(!entity.events)
entity.events={};

entity.events[eventName]=callback;

return this;

}

triggerEvent(entityName,eventName,payload){

const entity=this._entities[entityName];

if(!entity)
return null;

if(!entity.events)
return null;

if(typeof entity.events[eventName]!=="function")
return null;

return entity.events[eventName](payload);

}

//=========================================================================
// Entity Actions
//=========================================================================

addAction(entityName,action){

const entity=this._entities[entityName];

if(!entity)
throw new Error("Entity '"+entityName+"' not found.");

if(!entity.actions.includes(action))
entity.actions.push(action);

return this;

}

getActions(entityName){

const entity=this._entities[entityName];

if(!entity)
return [];

return this._clone(entity.actions);

}

hasAction(entityName,action){

const entity=this._entities[entityName];

if(!entity)
return false;

return entity.actions.includes(action);

}

//=========================================================================
// Entity CRUD Metadata
//=========================================================================

create(entityName,data){

if(!this.exists(entityName))
throw new Error("Entity '"+entityName+"' not found.");

return{
operation:"CREATE",
entity:entityName,
data:this._clone(data||{}),
timestamp:new Date()
};

}

read(entityName,id){

if(!this.exists(entityName))
throw new Error("Entity '"+entityName+"' not found.");

return{
operation:"READ",
entity:entityName,
id:id
};

}

updateRecord(entityName,id,data){

if(!this.exists(entityName))
throw new Error("Entity '"+entityName+"' not found.");

return{
operation:"UPDATE",
entity:entityName,
id:id,
data:this._clone(data||{}),
timestamp:new Date()
};

}

deleteRecord(entityName,id){

if(!this.exists(entityName))
throw new Error("Entity '"+entityName+"' not found.");

return{
operation:"DELETE",
entity:entityName,
id:id,
timestamp:new Date()
};

}

//=========================================================================
// Search
//=========================================================================

find(entityName,criteria){

if(!this.exists(entityName))
throw new Error("Entity '"+entityName+"' not found.");

return{
entity:entityName,
criteria:this._clone(criteria||{})
};

}

findById(entityName,id){

return this.read(entityName,id);

}

//=========================================================================
// Validation
//=========================================================================

validate(entityName,data){

const entity=this.get(entityName);

if(!entity)
throw new Error("Entity '"+entityName+"' not found.");

const validator=WEF.Validator;

validator.clear();

entity.fields.forEach(field=>{

if(field.required){

validator.required(

field.name,

data[field.name]

);

}

});

return{

valid:!validator.hasErrors(),

errors:validator.getErrors()

};

}

//=========================================================================
// Definition Export / Import
//=========================================================================

exportDefinition(entityName){

return this.get(entityName);

}

importDefinition(definition){

this.register(definition);

return this;

}

clear(){

this._entities={};

return this;

}

//=========================================================================
// Statistics
//=========================================================================

statistics(){

const entities=this.list();

let fieldCount=0;
let relationshipCount=0;
let actionCount=0;

entities.forEach(name=>{

const entity=this.get(name);

fieldCount+=entity.fields.length;
relationshipCount+=entity.relationships.length;
actionCount+=entity.actions.length;

});

return{

entities:this.count(),
fields:fieldCount,
relationships:relationshipCount,
actions:actionCount

};

}

//=========================================================================
// Information
//=========================================================================

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

/**
 * ============================================================================
 * Register Service
 * ============================================================================
 */

WEF.EntityManager=new EntityManagerService();

WEF.ServiceRegistry.register(
"EntityManager",
WEF.EntityManager
);

function test_EntityManager_Part5(){

  WEF.Kernel.boot();

  const em=WEF.EntityManager;

  em.initialize();

  em.clear();

  em.register({
    name:"Customer",
    module:"Sales",
    sheet:"Customers",
    key:"CustomerID"
  });

  em.addField("Customer",{
    name:"CustomerID",
    required:true,
    primaryKey:true
  });

  em.addField("Customer",{
    name:"CustomerName",
    required:true
  });

  em.addAction("Customer","Create");

  Logger.log(em.create("Customer",{
    CustomerID:"CUS000001",
    CustomerName:"ABC Traders"
  }));

  Logger.log(em.find("Customer",{
    CustomerName:"ABC Traders"
  }));

  Logger.log(em.validate("Customer",{
    CustomerID:"CUS000001"
  }));

  Logger.log(em.statistics());

  Logger.log(em.info());

}