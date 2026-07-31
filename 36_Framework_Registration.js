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

  if (!WEF.ServiceContainer) return;

  WEF.ServiceContainer.registerModuleService(
    "ERP",
    "Application",
    new ERPApplication()
  );

  WEF.ServiceContainer.registerModuleService(
    "ERP",
    "ModuleManager",
    new ERPModuleManager()
  );

  WEF.ServiceContainer.registerModuleService(
    "ERP",
    "MasterData",
    new ERPMasterData()
  );

  WEF.ServiceContainer.registerModuleService(
    "ERP",
    "DocumentManager",
    new ERPDocumentManager()
  );

  WEF.ServiceContainer.registerModuleService(
    "ERP",
    "NumberSeries",
    new ERPNumberSeries()
  );

  WEF.ServiceContainer.registerModuleService(
    "ERP",
    "TransactionManager",
    new ERPTransactionManager()
  );

  WEF.ServiceContainer.registerModuleService(
    "ERP",
    "AuditTrail",
    new ERPAuditTrail()
  );

  WEF.ServiceContainer.registerModuleService(
    "ERP",
    "SettingsManager",
    new ERPSettingsManager()
  );

  WEF.ServiceContainer.registerModuleService(
    "ERP",
    "EventBus",
    new ERPEventBus()
  );

  WEF.ServiceContainer.registerModuleService(
    "ERP",
    "TaskScheduler",
    new ERPTaskScheduler()
  );

  WEF.ServiceContainer.registerModuleService(
    "ERP",
    "Dashboard",
    new ERPDashboard()
  );

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