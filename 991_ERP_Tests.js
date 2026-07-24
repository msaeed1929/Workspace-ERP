/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File            : 991_ERP_Tests.gs
 * Module          : ERP Test Suite
 * Version         : 3.2.0
 * =============================================================================
 */

"use strict";

/*==============================================================================
    ERP Test Suite
==============================================================================*/

WEF.ERPTests = (function(){

    /*==========================================================================
        Configuration
    ==========================================================================*/

    const VERSION = "3.2.0";

    /*==========================================================================
        Private Members
    ==========================================================================*/

    let assertions = [];

    let statistics = {};

    /*==========================================================================
        Reset
    ==========================================================================*/

    function reset(){

        assertions = [];

        statistics = {

            total : 0,

            passed : 0,

            failed : 0

        };

    }

    /*==========================================================================
        Assert
    ==========================================================================*/

    function assert(

        testName,

        condition,

        expected,

        actual

    ){

        const passed = !!condition;

        assertions.push({

            test : testName,

            status : passed ? "PASS" : "FAIL",

            expected : expected,

            actual : actual

        });

        statistics.total++;

        if(passed){

            statistics.passed++;

        }else{

            statistics.failed++;

        }

        Logger.log(

            (passed ? "PASS : " : "FAIL : ") +

            testName

        );

    }

    /*==========================================================================
        ERP Application
    ==========================================================================*/

    function testApplication(){

        assert(

            "ERP Application Exists",

            typeof WEF.Application !== "undefined",

            true,

            typeof WEF.Application !== "undefined"

        );

    }

    /*==========================================================================
        Module Manager
    ==========================================================================*/

    function testModuleManager(){

        assert(

            "Module Manager Exists",

            typeof WEF.ModuleManager !== "undefined",

            true,

            typeof WEF.ModuleManager !== "undefined"

        );

    }

    /*==========================================================================
        Master Data
    ==========================================================================*/

    function testMasterData(){

        assert(

            "Master Data Exists",

            typeof WEF.MasterData !== "undefined",

            true,

            typeof WEF.MasterData !== "undefined"

        );

    }

    /*==========================================================================
        Document Manager
    ==========================================================================*/

    function testDocumentManager(){

        assert(

            "Document Manager Exists",

            typeof WEF.DocumentManager !== "undefined",

            true,

            typeof WEF.DocumentManager !== "undefined"

        );

    }

    /*==========================================================================
        Number Series
    ==========================================================================*/

    function testNumberSeries(){

        assert(

            "Number Series Exists",

            typeof WEF.NumberSeries !== "undefined",

            true,

            typeof WEF.NumberSeries !== "undefined"

        );

    }

    /*==========================================================================
        Transaction Manager
    ==========================================================================*/

    function testTransactionManager(){

        assert(

            "Transaction Manager Exists",

            typeof WEF.TransactionManager !== "undefined",

            true,

            typeof WEF.TransactionManager !== "undefined"

        );

    }

    /*==========================================================================
        Audit Trail
    ==========================================================================*/

    function testAuditTrail(){

        assert(

            "Audit Trail Exists",

            typeof WEF.AuditTrail !== "undefined",

            true,

            typeof WEF.AuditTrail !== "undefined"

        );

    }

    /*==========================================================================
        Settings Manager
    ==========================================================================*/

    function testSettingsManager(){

        assert(

            "Settings Manager Exists",

            typeof WEF.SettingsManager !== "undefined",

            true,

            typeof WEF.SettingsManager !== "undefined"

        );

    }

    /*==========================================================================
        ERP Event Bus
    ==========================================================================*/

    function testEventBus(){

        assert(

            "ERP Event Bus Exists",

            typeof WEF.ERPEventBus !== "undefined",

            true,

            typeof WEF.ERPEventBus !== "undefined"

        );

    }

    /*==========================================================================
        ERP Task Scheduler
    ==========================================================================*/

    function testTaskScheduler(){

        assert(

            "ERP Task Scheduler Exists",

            typeof WEF.TaskScheduler !== "undefined",

            true,

            typeof WEF.TaskScheduler !== "undefined"

        );

    }

    /*==========================================================================
        ERP Dashboard
    ==========================================================================*/

    function testDashboard(){

        assert(

            "ERP Dashboard Exists",

            typeof WEF.Dashboard !== "undefined",

            true,

            typeof WEF.Dashboard !== "undefined"

        );

    }

    /*==========================================================================
        Print Summary
    ==========================================================================*/

    function printSummary(){

        Logger.log("");

        Logger.log("========== ERP TEST SUMMARY ==========");

        Logger.log(

            "Total Assertions : " +

            statistics.total

        );

        Logger.log(

            "Passed : " +

            statistics.passed

        );

        Logger.log(

            "Failed : " +

            statistics.failed

        );

        Logger.log("======================================");

        Logger.log("");

    }

    /*==========================================================================
        Run
    ==========================================================================*/

    function run(){

        Logger.log("");

        Logger.log("========== ERP FRAMEWORK TESTS ==========");

        reset();

        testApplication();

        testModuleManager();

        testMasterData();

        testDocumentManager();

        testNumberSeries();

        testTransactionManager();

        testAuditTrail();

        testSettingsManager();

        testEventBus();

        testTaskScheduler();

        testDashboard();

        printSummary();

        return {

            suite : "ERP",

            version : VERSION,

            status :

                statistics.failed === 0

                    ? "PASS"

                    : "FAIL",

            assertions : statistics.total,

            passed : statistics.passed,

            failed : statistics.failed,

            results : assertions

        };

    }

    /*==========================================================================
        Public API
    ==========================================================================*/

    return {

        run : run,

        reset : reset

    };

})();

/*==============================================================================
    Test Entry Point
==============================================================================*/

function test_ERP(){

    return WEF.ERPTests.run();

}

/*==============================================================================
    Debug
==============================================================================*/

Logger.log(

    "Workspace ERP Tests Loaded"

);