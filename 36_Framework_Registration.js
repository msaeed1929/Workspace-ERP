/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 36_Framework_Registration.gs
 * Version     : 3.3.0
 * Description : Central Framework Service Registration
 * Author      : OpenAI + Muhammad Saeed Anser
 * =============================================================================
 */

'use strict';

/**
 * ===========================================================================
 * ERP Services
 * ===========================================================================
 */
function registerERPServices() {

  if (!WEF.ServiceContainer) return;function bootERPApplication() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "ERP",
      "Application",
      new ERPApplication()
    );
  }
}function bootERPModuleManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "ERP",
      "ModuleManager",
      new ERPModuleManager()
    );
  }
}function bootERPMasterData() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "ERP",
      "MasterData",
      new ERPMasterData()
    );
  }
}function bootERPDocumentManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "ERP",
      "DocumentManager",
      new ERPDocumentManager()
    );
  }
}function bootERPNumberSeries() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "ERP",
      "NumberSeries",
      new ERPNumberSeries()
    );
  }
}function bootERPTransactionManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "ERP",
      "TransactionManager",
      new ERPTransactionManager()
    );
  }
}function bootERPAuditTrail() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "ERP",
      "AuditTrail",
      new ERPAuditTrail()
    );
  }
}function bootERPSettingsManager() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "ERP",
      "SettingsManager",
      new ERPSettingsManager()
    );
  }
}function bootERPEventBus() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "ERP",
      "EventBus",
      new ERPEventBus()
    );
  }
}function bootERPTaskScheduler() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "ERP",
      "TaskScheduler",
      new ERPTaskScheduler()
    );
  }
}function bootERPDashboard() {
  if (typeof WEF !== "undefined" && WEF.ServiceContainer) {
    WEF.ServiceContainer.registerModuleService(
      "ERP",
      "Dashboard",
      new ERPDashboard()
    );
  }
}

}

/**
 * ===========================================================================
 * CRM Services
 * ===========================================================================
 */
function registerCRMServices() {

  if (!WEF.ServiceContainer) return;

}

/**
 * ===========================================================================
 * Sales Services
 * ===========================================================================
 */
function registerSalesServices() {

  if (!WEF.ServiceContainer) return;

}

/**
 * ===========================================================================
 * Purchase Services
 * ===========================================================================
 */
function registerPurchaseServices() {

  if (!WEF.ServiceContainer) return;

}

/**
 * ===========================================================================
 * Inventory Services
 * ===========================================================================
 */
function registerInventoryServices() {

  if (!WEF.ServiceContainer) return;

}

/**
 * ===========================================================================
 * Accounting Services
 * ===========================================================================
 */
function registerAccountingServices() {

  if (!WEF.ServiceContainer) return;

}

/**
 * ===========================================================================
 * HR Services
 * ===========================================================================
 */
function registerHRServices() {

  if (!WEF.ServiceContainer) return;

}

/**
 * ===========================================================================
 * Manufacturing Services
 * ===========================================================================
 */
function registerManufacturingServices() {

  if (!WEF.ServiceContainer) return;

}

/**
 * ===========================================================================
 * Project Services
 * ===========================================================================
 */
function registerProjectServices() {

  if (!WEF.ServiceContainer) return;

}