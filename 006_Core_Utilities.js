/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 006_Core_Utilities.gs
 * Version     : 3.2.0
 * Description : Common Utility Library
 * Author      : OpenAI + Muhammad Saeed Anser
 * =============================================================================
 */

'use strict';

WEF.Utilities = {};

/* ============================================================================
 * STRING UTILITIES
 * ==========================================================================*/
WEF.Utilities.String = Object.freeze({

  isEmpty(value) {
    return value === null || value === undefined || String(value).trim() === "";
  },

  trim(value) {
    return String(value || "").trim();
  },

  upper(value) {
    return String(value || "").toUpperCase();
  },

  lower(value) {
    return String(value || "").toLowerCase();
  },

  capitalize(value) {

      value = String(value || "").trim();

      if (!value) return "";

      return value.charAt(0).toUpperCase() +
            value.slice(1);

  },

  slug(value) {

    return String(value || "")
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/\s+/g, "-");

  }

});

/* ============================================================================
 * NUMBER UTILITIES
 * ==========================================================================*/

WEF.Utilities.Number = Object.freeze({

  isNumeric(value) {

      return value !== null &&
            value !== "" &&
            !isNaN(Number(value));

  },

  round(value, digits = 2) {

    return Number(Number(value).toFixed(digits));

  },

  random(min, max) {

    return Math.floor(Math.random() * (max - min + 1)) + min;

  }

});

/* ============================================================================
 * DATE UTILITIES
 * ==========================================================================*/

WEF.Utilities.Date = Object.freeze({

  today() {

    return new Date();

  },

  timestamp() {

    return new Date().getTime();

  },

  todayString() {

    return this.format(new Date());

  },

  now() {

    return Utilities.formatDate(
      new Date(),
      WEF.Environment.getTimeZone(),
      WEF.Config.get("DATETIME_FORMAT")
    );

  },

  format(date, pattern) {

    return Utilities.formatDate(
      new Date(date),
      WEF.Environment.getTimeZone(),
      pattern || WEF.Config.get("DATE_FORMAT")
    );

  },

  addDays(date, days) {

    const d = new Date(date);

    d.setDate(d.getDate() + days);

    return d;

  },

  addMonths(date, months) {

    const d = new Date(date);

    d.setMonth(d.getMonth() + months);

    return d;

  },

  addYears(date, years) {

    const d = new Date(date);

    d.setFullYear(d.getFullYear() + years);

    return d;

  },

  diffDays(date1, date2) {

    return Math.floor(

      (new Date(date2) - new Date(date1))

      / 86400000

    );

  },

  startOfMonth(date) {

    const d = new Date(date);

    return new Date(d.getFullYear(), d.getMonth(), 1);

  },

  endOfMonth(date) {

    const d = new Date(date);

    return new Date(d.getFullYear(), d.getMonth() + 1, 0);

  },

  isToday(date) {

    return this.format(date) === this.format(new Date());

  }

});

/* ============================================================================
 * ARRAY UTILITIES
 * ==========================================================================*/

WEF.Utilities.Array = Object.freeze({

  unique(array) {

    return [...new Set(array)];

  },

  first(array) {

    return array[0];

  },

  last(array) {

    return array[array.length - 1];

  },

  isEmpty(array) {

      return !Array.isArray(array) || array.length === 0;

  },

  sum(array) {

    return array.reduce((a, b) => a + b, 0);

  },

  pluck(array, key) {

    return array.map(item => item[key]);

  }

});

/* ============================================================================
 * OBJECT UTILITIES
 * ==========================================================================*/

WEF.Utilities.Object = Object.freeze({

  clone(object) {

    return JSON.parse(JSON.stringify(object));

  },

  deepClone(object) {

    return JSON.parse(JSON.stringify(object));

  },

  keys(object) {

    return Object.keys(object);

  },

  values(object) {

    return Object.values(object);

  },

  has(object, key) {

    return Object.prototype.hasOwnProperty.call(object, key);

  },

  merge(obj1, obj2) {

    return Object.assign({}, obj1, obj2);

  },

  isEmpty(object) {

      return !object ||
            Object.keys(object).length === 0;

  },

});

/* ============================================================================
 * UUID UTILITIES
 * ==========================================================================*/

WEF.Utilities.UUID = Object.freeze({

  generate() {

    return Utilities.getUuid();

  },

  short() {

    return Utilities.getUuid()

      .replace(/-/g, "")

      .substring(0, 8)

      .toUpperCase();

  },

  isUUID(value) {

    return WEF.Utilities.Validation.isUUID(value);

  }

});

/* ============================================================================
 * SYSTEM UTILITIES
 * ==========================================================================*/

WEF.Utilities.System = Object.freeze({

  sleep(milliseconds) {

    Utilities.sleep(milliseconds);

  },

  uuid() {

    return Utilities.getUuid();

  }

});

/* ============================================================================
 * SHEET UTILITIES
 * ==========================================================================*/

WEF.Utilities.Sheet = Object.freeze({

  exists(sheetName) {

    return WEF.Environment
      .getSpreadsheet()
      .getSheetByName(sheetName) !== null;

  },

  get(sheetName) {

    return WEF.Environment
      .getSpreadsheet()
      .getSheetByName(sheetName);

  },

  list() {

      return WEF.Environment
                .getSpreadsheet()
                .getSheets();

  },

  names() {

      return this.list().map(function(sheet){

          return sheet.getName();

      });

  },

  active() {

      return WEF.Environment
                .getSpreadsheet()
                .getActiveSheet();

}

});

/* ============================================================================
 * VALIDATION UTILITIES
 * ==========================================================================*/

WEF.Utilities.Validation = Object.freeze({

  isEmail(value) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  },

  isPhone(value) {

    return /^[0-9+\-\s()]+$/.test(value);

  },

  isURL(value) {

    return /^https?:\/\/.+/i.test(value);

  },

  isUUID(value) {

    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

  },

  isDate(value) {

    return !isNaN(Date.parse(value));

  },

  isBoolean(value) {

    return typeof value === "boolean";

  }

});

function test_Utilities() {

  Logger.log(WEF.Utilities.String.capitalize("workspace erp"));

  Logger.log(WEF.Utilities.String.slug("Purchase Order Form"));

  Logger.log(WEF.Utilities.Number.round(125.4589));

  Logger.log(WEF.Utilities.Date.now());

  Logger.log(WEF.Utilities.Date.addDays(new Date(), 5));

  Logger.log(WEF.Utilities.Array.unique([1,2,2,3,3]));

  Logger.log(WEF.Utilities.Object.clone({name:"WEF"}));

  Logger.log(WEF.Utilities.Validation.isEmail("admin@test.com"));

  Logger.log(WEF.Utilities.UUID.generate());

  Logger.log(WEF.Utilities.UUID.short());

  Logger.log(WEF.Utilities.Sheet.exists("Dashboard"));

  Logger.log(WEF.Utilities.Date.todayString());

  Logger.log(WEF.Utilities.Date.timestamp());

  Logger.log(WEF.Utilities.Sheet.list().length);

  Logger.log(WEF.Utilities.Sheet.names());

  Logger.log(WEF.Utilities.Sheet.active().getName());

}

Object.freeze(WEF.Utilities);