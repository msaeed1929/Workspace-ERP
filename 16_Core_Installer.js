/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File        : 16_Core_Installer.gs
 * Version     : 1.0.0
 * Description : Framework Installation Service
 * Author      : Muhammad Saeed Anser + OpenAI
 * =============================================================================
 */

'use strict';

class InstallerService extends BaseService{

  constructor(){

    super("Installer");

    this._spreadsheet=null;
    this._installed=false;

    this._systemSheets=[
      "_Metadata",
      "_MigrationHistory",
      "_Settings",
      "_Logs",
      "_System"
    ];

    this.initialize();

  }

  initialize(){

    super.initialize();

    this._spreadsheet=SpreadsheetApp.getActiveSpreadsheet();

    this._installed=this.isInstalled();

    return this;

  }

  //=========================================================================
  // Spreadsheet
  //=========================================================================

  spreadsheet(){

    return this._spreadsheet;

  }

  //=========================================================================
  // Installation Status
  //=========================================================================

  isInstalled(){

    return this.exists("_System");

  }

  status(){

    return{

      installed:this.isInstalled(),

      spreadsheet:this.spreadsheet().getName(),

      version:this.getVersion()

    };

  }

  verify(){

    const missing=[];

    this._systemSheets.forEach(name=>{

      if(!this.exists(name))
        missing.push(name);

    });

    return{

      valid:missing.length===0,

      missing:missing

    };

  }

  //=========================================================================
  // Sheet Helpers
  //=========================================================================

  exists(sheetName){

    return this.spreadsheet()
      .getSheetByName(sheetName)!==null;

  }

  sheet(sheetName){

    return this.spreadsheet()
      .getSheetByName(sheetName);

  }

  createSheet(sheetName){

    if(this.exists(sheetName))
      return this.sheet(sheetName);

    return this.spreadsheet()
      .insertSheet(sheetName);

  }

  deleteSheet(sheetName){

    if(!this.exists(sheetName))
      return false;

    this.spreadsheet().deleteSheet(

      this.sheet(sheetName)

    );

    return true;

  }

  systemSheets(){

    return this._systemSheets.slice();

  }

  createSystemSheets(){

    this._systemSheets.forEach(sheet=>{

      this.createSheet(sheet);

    });

    return this;

  }

  removeSystemSheets(){

    this._systemSheets.forEach(sheet=>{

      if(this.exists(sheet))
        this.deleteSheet(sheet);

    });

    return this;

  }

  //=========================================================================
  // Installation Lifecycle
  //=========================================================================

  install(){

    const lock=LockService.getScriptLock();

    lock.waitLock(30000);

    try{

      const verify=this.verify();

      if(verify.valid){

        return{

          success:true,

          message:"Framework already installed."

        };

      }

      this.bootstrap();

      return{

        success:true,

        message:"Framework installed successfully."

      };

    }

    finally{

      lock.releaseLock();

    }

  }

  reinstall(){

    const lock=LockService.getScriptLock();

    lock.waitLock(30000);

    try{

      this.uninstall(true);

      this.install();

      return{

        success:true,

        message:"Framework reinstalled successfully."

      };

    }

    finally{

      lock.releaseLock();

    }

  }

  uninstall(force=false){

    if(!force){

      throw new Error(
        "Use uninstall(true) to confirm uninstall."
      );

    }

    this.removeSystemSheets();

    this._installed=false;

    return{

      success:true,

      message:"Framework removed successfully."

    };

  }

  repair(){

    const lock=LockService.getScriptLock();

    lock.waitLock(30000);

    try{

      const report=this.verify();

      report.missing.forEach(sheet=>{

        switch(sheet){

          case "_Metadata":
            this.installMetadata();
            break;

          case "_MigrationHistory":
            this.installMigrationHistory();
            break;

          case "_Settings":
            this.installSettings();
            break;

          case "_Logs":
            this.installLogs();
            break;

          case "_System":
            this.installSystem();
            break;

        }

      });

      return{

        success:true,

        repaired:report.missing.length

      };

    }

    finally{

      lock.releaseLock();

    }

  }

  upgrade(){

    return{

      success:true,

      current:this.getVersion(),

      latest:this.getVersion(),

      upgradeRequired:false

    };

  }
  //=========================================================================
  // Installation Engine
  //=========================================================================

  installMetadata(){

    const sheet=this.createSheet("_Metadata");

    sheet.clear();

    sheet.getRange(1,1,1,6).setValues([[
      "Entity",
      "Module",
      "Sheet",
      "PrimaryKey",
      "Fields",
      "Created"
    ]]);

    return this;

  }

  installMigrationHistory(){

    const sheet=this.createSheet("_MigrationHistory");

    sheet.clear();

    sheet.getRange(1,1,1,6).setValues([[
      "Migration",
      "Version",
      "Status",
      "ExecutedBy",
      "ExecutedAt",
      "Remarks"
    ]]);

    return this;

  }

  installSettings(){

    const sheet=this.createSheet("_Settings");

    sheet.clear();

    sheet.getRange(1,1,1,3).setValues([[
      "Key",
      "Value",
      "Description"
    ]]);

    const settings=[

      [
        "FrameworkVersion",
        this.getVersion(),
        "Installed Framework Version"
      ],

      [
        "InstalledOn",
        new Date(),
        "Installation Date"
      ],

      [
        "SpreadsheetId",
        SpreadsheetApp.getActiveSpreadsheet().getId(),
        "Spreadsheet Identifier"
      ],

      [
        "SpreadsheetName",
        SpreadsheetApp.getActiveSpreadsheet().getName(),
        "Spreadsheet Name"
      ],

      [
        "TimeZone",
        Session.getScriptTimeZone(),
        "Project Time Zone"
      ],

      [
        "Locale",
        Session.getActiveUserLocale(),
        "Project Locale"
      ]

    ];

    sheet.getRange(
      2,
      1,
      settings.length,
      settings[0].length
    ).setValues(settings);

    return this;

  }

  installLogs(){

    const sheet=this.createSheet("_Logs");

    sheet.clear();

    sheet.getRange(1,1,1,6).setValues([[
      "Timestamp",
      "Level",
      "Service",
      "User",
      "Message",
      "Details"
    ]]);

    return this;

  }

  installSystem(){

    const sheet=this.createSheet("_System");

    sheet.clear();

    sheet.getRange(1,1,2,2).setValues([

      [
        "Property",
        "Value"
      ],

      [
        "Framework",
        "Workspace ERP Framework"
      ]

    ]);

    sheet.getRange(3,1,9,2).setValues([

      [
        "Version",
        this.getVersion()
      ],

      [
        "Installed",
        new Date()
      ],

      [
        "InstalledBy",
        Session.getActiveUser().getEmail()||"Unknown"
      ],

      [
        "LastUpgrade",
        "-"
      ],

      [
        "Spreadsheet",
        this.spreadsheet().getName()
      ],

      [
        "SpreadsheetId",
        this.spreadsheet().getId()
      ],

      [
        "Developer",
        "Muhammad Saeed Anser"
      ],

      [
        "Status",
        "Installed"
      ],

      [
        "Framework",
        "Workspace ERP Framework"
      ]

    ]);

    return this;

  }

  seedFramework(){

    this.installMetadata();

    this.installMigrationHistory();

    this.installSettings();

    this.installLogs();

    this.installSystem();

    return this;

  }

  installFramework(){

    this.installMetadata();

    this.installMigrationHistory();

    this.installSettings();

    this.installLogs();

    this.installSystem();

  }

  registerFramework(){

    if(WEF.Metadata)
      WEF.Metadata.initialize();

    if(WEF.Migration)
      WEF.Migration.initialize();

    if(WEF.EntityManager)
      WEF.EntityManager.initialize();

    if(WEF.Schema)
      WEF.Schema.initialize();

    if(WEF.Database)
      WEF.Database.initialize();

    if(WEF.Repository)
      WEF.Repository.initialize();

    return this;

  }

  bootstrap(){

    this.installFramework();

    this.registerFramework();

    return this;

  }
    //=========================================================================
  // Health & Reporting
  //=========================================================================

  health(){

    const verification=this.verify();

    return{

      installed:this.isInstalled(),

      valid:verification.valid,

      missing:verification.missing.length,

      systemSheets:this.systemSheets().length,

      spreadsheet:this.spreadsheet().getName()

    };

  }

  statistics(){

    return{

      installed:this.isInstalled(),

      systemSheets:this.systemSheets().length,

      frameworkSheets:this.systemSheets(),

      spreadsheet:this.spreadsheet().getName(),

      version:this.getVersion()

    };

  }

  report(){

    return{

      framework:"Workspace ERP Framework",

      version:this.getVersion(),

      spreadsheet:this.spreadsheet().getName(),

      verification:this.verify(),

      health:this.health(),

      statistics:this.statistics()

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

//=============================================================================
// Register Service
//=============================================================================

WEF.Installer=new InstallerService();