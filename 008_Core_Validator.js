08_Core_Validator.js
1
100%
/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 08_Core_Validator.gs
 * Version     : 1.0.0
 * Part        : 1 of 5
 * Description : Enterprise Validation Engine
 * Author      : OpenAI + Muhammad Saeed Anser
 * =============================================================================
 */

'use strict';

class ValidatorService extends BaseService {

  constructor() {

    super("Validator");

    this.initialize();

  }

  //=========================================================================
  // Initialization
  //=========================================================================

  initialize() {

    super.initialize();

    this.clear();

    return this;

  }

  //=========================================================================
  // Error Engine
  //=========================================================================

  clear() {

    this._errors = [];

    this._context = null;

    return this;

  }

  addError(field, message, code = null) {

    this._errors.push({

      field: field,

      message: message,

      code: code,

      timestamp: new Date()

    });

    return this;

  }

  fail(field, message, code = null) {

    this.addError(field, message, code);

    return false;

  }

  success() {

    return true;

  }

  hasErrors() {

    return this._errors.length > 0;

  }

  getErrors() {

    return [...this._errors];

  }

  getFirstError() {

    return this._errors.length
      ? this._errors[0]
      : null;

  }

  count() {

    return this._errors.length;

  }

  //=========================================================================
  // Validation Context
  //=========================================================================

  setContext(context) {

    this._context = context;

    return this;

  }

  getContext() {

    return this._context;

  }

  //=========================================================================
  // Internal Helpers
  //=========================================================================

  _isNull(value) {

    return value === null || value === undefined;

  }

  _isBlank(value) {

    return this._isNull(value) ||

      String(value).trim() === "";

  }

  _toNumber(value) {

    return Number(value);

  }

  //=========================================================================
  // Basic Validation
  //=========================================================================

  required(field, value) {

    if (this._isBlank(value)) {

      return this.fail(

        field,

        field + " is required."

      );

    }

    return this.success();

  }

  empty(value) {

    return this._isBlank(value);

  }

  string(field, value) {

    if (this._isNull(value))
      return this.success();

    if (typeof value !== "string") {

      return this.fail(

        field,

        field + " must be text."

      );

    }

    return this.success();

  }

  boolean(field, value) {

    if (this._isNull(value))
      return this.success();

    if (typeof value !== "boolean") {

      return this.fail(

        field,

        field + " must be boolean."

      );

    }

    return this.success();

  }

  object(field, value) {

    if (this._isNull(value))
      return this.success();

    if (

      typeof value !== "object" ||

      Array.isArray(value)

    ) {

      return this.fail(

        field,

        field + " must be an object."

      );

    }

    return this.success();

  }

  array(field, value) {

    if (this._isNull(value))
      return this.success();

    if (!Array.isArray(value)) {

      return this.fail(

        field,

        field + " must be an array."

      );

    }

    return this.success();

  }

    //=========================================================================
  // Numeric Validation
  //=========================================================================

  number(field, value) {

    if (this._isBlank(value))
      return this.success();

    if (isNaN(value)) {

      return this.fail(
        field,
        field + " must be numeric."
      );

    }

    return this.success();

  }

  integer(field, value) {

    if (this._isBlank(value))
      return this.success();

    if (!Number.isInteger(Number(value))) {

      return this.fail(
        field,
        field + " must be an integer."
      );

    }

    return this.success();

  }

  decimal(field, value) {

    if (this._isBlank(value))
      return this.success();

    if (isNaN(value)) {

      return this.fail(
        field,
        field + " must be decimal."
      );

    }

    return this.success();

  }

  positive(field, value) {

    if (this._isBlank(value))
      return this.success();

    value = Number(value);

    if (isNaN(value) || value <= 0) {

      return this.fail(
        field,
        field + " must be greater than zero."
      );

    }

    return this.success();

  }

  negative(field, value) {

    if (this._isBlank(value))
      return this.success();

    value = Number(value);

    if (isNaN(value) || value >= 0) {

      return this.fail(
        field,
        field + " must be less than zero."
      );

    }

    return this.success();

  }

  amount(field, value) {

    if (this._isBlank(value))
      return this.success();

    if (isNaN(value)) {

      return this.fail(
        field,
        field + " must be a valid amount."
      );

    }

    return this.success();

  }

  quantity(field, value) {

    if (this._isBlank(value))
      return this.success();

    value = Number(value);

    if (isNaN(value) || value < 0) {

      return this.fail(
        field,
        field + " must be zero or greater."
      );

    }

    return this.success();

  }

  percentage(field, value) {

    if (this._isBlank(value))
      return this.success();

    value = Number(value);

    if (isNaN(value) || value < 0 || value > 100) {

      return this.fail(
        field,
        field + " must be between 0 and 100."
      );

    }

    return this.success();

  }

  //=========================================================================
  // Length Validation
  //=========================================================================

  min(field, value, minimum) {

    if (this._isBlank(value))
      return this.success();

    value = Number(value);

    if (value < minimum) {

      return this.fail(
        field,
        field + " must be at least " + minimum + "."
      );

    }

    return this.success();

  }

  max(field, value, maximum) {

    if (this._isBlank(value))
      return this.success();

    value = Number(value);

    if (value > maximum) {

      return this.fail(
        field,
        field + " must not exceed " + maximum + "."
      );

    }

    return this.success();

  }

  between(field, value, minimum, maximum) {

    if (this._isBlank(value))
      return this.success();

    value = Number(value);

    if (value < minimum || value > maximum) {

      return this.fail(
        field,
        field + " must be between " +
        minimum +
        " and " +
        maximum +
        "."
      );

    }

    return this.success();

  }

  minLength(field, value, length) {

    if (this._isBlank(value))
      return this.success();

    if (String(value).length < length) {

      return this.fail(
        field,
        field + " must contain at least " +
        length +
        " characters."
      );

    }

    return this.success();

  }

  maxLength(field, value, length) {

    if (this._isBlank(value))
      return this.success();

    if (String(value).length > length) {

      return this.fail(
        field,
        field + " must not exceed " +
        length +
        " characters."
      );

    }

    return this.success();

  }

  exactLength(field, value, length) {

    if (this._isBlank(value))
      return this.success();

    if (String(value).length !== length) {

      return this.fail(
        field,
        field + " must contain exactly " +
        length +
        " characters."
      );

    }

    return this.success();

  }

  //=========================================================================
  // Format Validation
  //=========================================================================

  email(field,value){
    if(this._isBlank(value)) return this.success();
    const regex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!regex.test(String(value).trim())){
      return this.fail(field,field+" is not a valid email address.");
    }
    return this.success();
  }

  phone(field,value){
    if(this._isBlank(value)) return this.success();
    const regex=/^(\+?\d{1,4})?[-\s()]?(\d[-\s()]?){7,15}$/;
    if(!regex.test(String(value).trim())){
      return this.fail(field,field+" is not a valid phone number.");
    }
    return this.success();
  }

  url(field,value){
    if(this._isBlank(value)) return this.success();
    const regex=/^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i;
    if(!regex.test(String(value).trim())){
      return this.fail(field,field+" is not a valid URL.");
    }
    return this.success();
  }

  date(field,value){
    if(this._isBlank(value)) return this.success();
    const d=new Date(value);
    if(isNaN(d.getTime())){
      return this.fail(field,field+" is not a valid date.");
    }
    return this.success();
  }

  time(field,value){
    if(this._isBlank(value)) return this.success();
    const regex=/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/;
    if(!regex.test(String(value).trim())){
      return this.fail(field,field+" is not a valid time.");
    }
    return this.success();
  }

  dateTime(field,value){
    return this.date(field,value);
  }

  regex(field,value,expression,message){
    if(this._isBlank(value)) return this.success();
    if(!expression.test(String(value))){
      return this.fail(field,message||field+" format is invalid.");
    }
    return this.success();
  }

  //=========================================================================
  // Pakistan Validation
  //=========================================================================

  cnic(field,value){
    if(this._isBlank(value)) return this.success();
    const regex=/^\d{5}-\d{7}-\d$/;
    if(!regex.test(String(value).trim())){
      return this.fail(field,field+" is not a valid CNIC.");
    }
    return this.success();
  }

  ntn(field,value){
    if(this._isBlank(value)) return this.success();
    const regex=/^\d{7,8}$/;
    if(!regex.test(String(value).trim())){
      return this.fail(field,field+" is not a valid NTN.");
    }
    return this.success();
  }

  strn(field,value){
    if(this._isBlank(value)) return this.success();
    const regex=/^\d{12,15}$/;
    if(!regex.test(String(value).trim())){
      return this.fail(field,field+" is not a valid STRN.");
    }
    return this.success();
  }

  iban(field,value){
    if(this._isBlank(value)) return this.success();
    const regex=/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/;
    if(!regex.test(String(value).replace(/\s+/g,""))){
      return this.fail(field,field+" is not a valid IBAN.");
    }
    return this.success();
  }

  currency(field,value){
    if(this._isBlank(value)) return this.success();
    const regex=/^[A-Z]{3}$/;
    if(!regex.test(String(value).trim())){
      return this.fail(field,field+" must be a valid ISO currency code.");
    }
    return this.success();
  }

  //=========================================================================
  // Comparison Validation
  //=========================================================================

  equals(field,value,compareValue,message){
    if(this._isBlank(value)) return this.success();
    if(value!==compareValue){
      return this.fail(field,message||field+" does not match.");
    }
    return this.success();
  }

  notEquals(field,value,compareValue,message){
    if(this._isBlank(value)) return this.success();
    if(value===compareValue){
      return this.fail(field,message||field+" must be different.");
    }
    return this.success();
  }

  //=========================================================================
  // Collection Validation
  //=========================================================================

  inList(field,value,list){
    if(this._isBlank(value)) return this.success();
    if(!Array.isArray(list)||!list.includes(value)){
      return this.fail(field,field+" contains an invalid value.");
    }
    return this.success();
  }

  notInList(field,value,list){
    if(this._isBlank(value)) return this.success();
    if(Array.isArray(list)&&list.includes(value)){
      return this.fail(field,field+" already exists.");
    }
    return this.success();
  }

  //=========================================================================
  // String Validation
  //=========================================================================

  startsWith(field,value,prefix){
    if(this._isBlank(value)) return this.success();
    if(!String(value).startsWith(prefix)){
      return this.fail(field,field+" must start with '"+prefix+"'.");
    }
    return this.success();
  }

  endsWith(field,value,suffix){
    if(this._isBlank(value)) return this.success();
    if(!String(value).endsWith(suffix)){
      return this.fail(field,field+" must end with '"+suffix+"'.");
    }
    return this.success();
  }

  contains(field,value,text){
    if(this._isBlank(value)) return this.success();
    if(!String(value).includes(text)){
      return this.fail(field,field+" must contain '"+text+"'.");
    }
    return this.success();
  }

  //=========================================================================
  // Date Validation
  //=========================================================================

  futureDate(field,value){
    if(this._isBlank(value)) return this.success();
    const d=new Date(value);
    if(isNaN(d.getTime())||d<=new Date()){
      return this.fail(field,field+" must be a future date.");
    }
    return this.success();
  }

  pastDate(field,value){
    if(this._isBlank(value)) return this.success();
    const d=new Date(value);
    if(isNaN(d.getTime())||d>=new Date()){
      return this.fail(field,field+" must be a past date.");
    }
    return this.success();
  }

  //=========================================================================
  // ERP Business Validation
  //=========================================================================

  creditLimit(field,amount,limit){
    amount=Number(amount);
    limit=Number(limit);
    if(isNaN(amount)||isNaN(limit)){
      return this.fail(field,"Credit limit validation failed.");
    }
    if(amount>limit){
      return this.fail(field,"Credit limit exceeded.");
    }
    return this.success();
  }

  stockAvailable(field,requiredQty,availableQty){
    requiredQty=Number(requiredQty);
    availableQty=Number(availableQty);
    if(requiredQty>availableQty){
      return this.fail(field,"Insufficient stock available.");
    }
    return this.success();
  }

  duplicateCode(field,code,existingCodes){
    if(Array.isArray(existingCodes)&&existingCodes.includes(code)){
      return this.fail(field,"Duplicate code detected.");
    }
    return this.success();
  }

  unique(field,value,list){
    if(!Array.isArray(list)) return this.success();
    const count=list.filter(v=>v===value).length;
    if(count>1){
      return this.fail(field,field+" must be unique.");
    }
    return this.success();
  }

  //=========================================================================
  // Entity Validation
  //=========================================================================

  validateObject(schema,data){
    this.clear();
    if(!schema||!data) return this.fail("_system","Schema or data is missing.");

    Object.keys(schema).forEach(field=>{
      const rules=schema[field];
      const value=data[field];

      Object.keys(rules).forEach(rule=>{
        const option=rules[rule];

        switch(rule){

          case "required":
            if(option) this.required(field,value);
            break;

          case "email":
            if(option) this.email(field,value);
            break;

          case "number":
            if(option) this.number(field,value);
            break;

          case "integer":
            if(option) this.integer(field,value);
            break;

          case "positive":
            if(option) this.positive(field,value);
            break;

          case "amount":
            if(option) this.amount(field,value);
            break;

          case "maxLength":
            this.maxLength(field,value,option);
            break;

          case "minLength":
            this.minLength(field,value,option);
            break;

        }

      });

    });

    return !this.hasErrors();

  }

  validateEntity(entityName,data){

    if (
        !WEF.EntityManager ||
        typeof WEF.EntityManager.getSchema !== "function"
    ) {
        return this.fail(
          "_system",
          "EntityManager is not initialized."
        );
      }

    const schema=WEF.EntityManager.getSchema(entityName);

    if(!schema){
      return this.fail(
        "_system",
        "Schema not found for entity '"+entityName+"'."
      );
    }

    return this.validateObject(schema,data);

  }

  //=========================================================================
  // Custom Validation Rules
  //=========================================================================

  registerRule(name,callback){

    this._rules = this._rules || Object.create(null);

    this._rules[name]=callback;

  }

  runRule(name,...args){

    if(
      !this._rules||
      !this._rules[name]
    ){
      return this.fail(
        "_system",
        "Validation rule '"+name+"' not found."
      );
    }

    return this._rules[name](...args);

  }

  //=========================================================================
  // Error Helpers
  //=========================================================================

  getErrorsByField(field){

    return this._errors.filter(
      e=>e.field===field
    );

  }

  toJSON(){

    return JSON.stringify(
      this._errors,
      null,
      2
    );

  }

  summary(){

    return{

      valid:!this.hasErrors(),

      errorCount:this.count(),

      firstError:this.getFirstError(),

      errors:this.getErrors()

    };

  }

  //=========================================================================
  // Information
  //=========================================================================

  statistics(){

    return{

      errors:this.count(),

      rules: this._rules
        ? Object.keys(this._rules).length
        : 0,

      frameworkVersion: WEF.Info.version,
      frameworkBuild: WEF.Info.build,
      environment: WEF.Config.get("ENVIRONMENT"),

      valid:!this.hasErrors()

    };

  }

  info() {

    return {

      service: this.getName(),

      version: this.getVersion(),

      initialized: this.isInitialized(),

      frameworkVersion: WEF.Info.version,

      frameworkBuild: WEF.Info.build,

      environment: WEF.Config.get("ENVIRONMENT"),

      errors: this.count(),

      hasErrors: this.hasErrors(),

      context: this._context,

      statistics: this.statistics()

    };

  }

}

/**
 * =============================================================================
 * Register Validator
 * =============================================================================
 */

WEF.Validator = new ValidatorService();

WEF.Validator.initialize();

/**
 * Register Validator Service
 */
function registerValidatorService() {

  if (!WEF.ServiceRegistry.has("Validator")) {

    WEF.ServiceRegistry.register(
      "Validator",
      WEF.Validator
    );

  }

  if (
    WEF.ServiceContainer &&
    typeof WEF.ServiceContainer.registerModuleService === "function"
  ) {

    WEF.ServiceContainer.registerModuleService(
      "Core",
      "Validator",
      WEF.Validator
    );

  }

}

/**
 * =============================================================================
 * TEST
 * =============================================================================
 */

function test_Validator() {

  WEF.Kernel.boot();

  Logger.log("===== VALIDATOR =====");

  Logger.log(WEF.Validator.isInitialized());

  WEF.Validator.clear();

  Logger.log(WEF.Validator.required("Customer", ""));

  Logger.log(WEF.Validator.required("Customer", "ABC Traders"));

  Logger.log(WEF.Validator.email("Email", "abc@gmail.com"));

  Logger.log(WEF.Validator.email("Email", "abc@gmail"));

  Logger.log(WEF.Validator.number("CreditLimit", 150));

  Logger.log(WEF.Validator.boolean("Active", true));

  Logger.log(WEF.Validator.hasErrors());

  Logger.log(WEF.Validator.count());

  Logger.log(WEF.Validator.getErrors());

  Logger.log(WEF.Validator.statistics());

  Logger.log(WEF.Validator.info());

  Logger.log(WEF.Validator.summary());

  Logger.log(WEF.Validator.toJSON());

}