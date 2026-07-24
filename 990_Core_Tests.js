/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File            : 990_Core_Tests.gs
 * Module          : Core Framework Test Suite
 * Version         : 3.2.0
 * =============================================================================
 */

"use strict";

/*==============================================================================
    Core Test Suite
==============================================================================*/

WEF.CoreTests = (function(){

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
        Namespace Tests
    ==========================================================================*/

    function testNamespace(){

        assert(

            "WEF Namespace Exists",

            typeof WEF !== "undefined",

            true,

            typeof WEF !== "undefined"

        );

    }

    /*==========================================================================
        Kernel Tests
    ==========================================================================*/

    function testKernel(){

        assert(

            "Kernel Exists",

            typeof WEF.Kernel !== "undefined",

            true,

            typeof WEF.Kernel !== "undefined"

        );

    }

    /*==========================================================================
        Config Tests
    ==========================================================================*/

    function testConfig(){

        assert(

            "Config Exists",

            typeof WEF.Config !== "undefined",

            true,

            typeof WEF.Config !== "undefined"

        );

        assert(

            "Config.get()",

            typeof WEF.Config.get === "function",

            "function",

            typeof WEF.Config.get

        );

        assert(

            "Config.has()",

            typeof WEF.Config.has === "function",

            "function",

            typeof WEF.Config.has

        );

        assert(

            "Config.all()",

            typeof WEF.Config.all === "function",

            "function",

            typeof WEF.Config.all

        );

    }

    /*==========================================================================
        Constants Tests
    ==========================================================================*/

    function testConstants(){

        assert(

            "Constants Exists",

            typeof WEF.Constants !== "undefined",

            true,

            typeof WEF.Constants !== "undefined"

        );

    }

    /*==========================================================================
        Environment Tests
    ==========================================================================*/

    function testEnvironment(){

        assert(

            "Environment Exists",

            typeof WEF.Environment !== "undefined",

            true,

            typeof WEF.Environment !== "undefined"

        );

        assert(

            "Environment.refresh()",

            typeof WEF.Environment.refresh === "function",

            "function",

            typeof WEF.Environment.refresh

        );

        assert(

            "Environment.info()",

            typeof WEF.Environment.info === "function",

            "function",

            typeof WEF.Environment.info

        );

        assert(

            "Environment.isInitialized()",

            WEF.Environment.isInitialized(),

            true,

            WEF.Environment.isInitialized()

        );

        assert(

            "Environment.getSpreadsheet()",

            WEF.Environment.getSpreadsheet() !== null,

            true,

            WEF.Environment.getSpreadsheet() !== null

        );

    }

    /*==========================================================================
        Utilities Tests
    ==========================================================================*/

    function testUtilities(){

        assert(

            "Utilities Exists",

            typeof WEF.Utilities !== "undefined",

            true,

            typeof WEF.Utilities !== "undefined"

        );

    }

    /*==========================================================================
        Logger Tests
    ==========================================================================*/

    function testLogger(){

        assert(

            "Logger Exists",

            typeof WEF.Logger !== "undefined",

            true,

            typeof WEF.Logger !== "undefined"

        );

        assert(

            "Logger.info()",

            typeof WEF.Logger.info === "function",

            "function",

            typeof WEF.Logger.info

        );

        assert(

            "Logger.error()",

            typeof WEF.Logger.error === "function",

            "function",

            typeof WEF.Logger.error

        );

    }

    /*==========================================================================
        Validator Tests
    ==========================================================================*/

    function testValidator(){

        assert(

            "Validator Exists",

            typeof WEF.Validator !== "undefined",

            true,

            typeof WEF.Validator !== "undefined"

        );

    }

    /*==========================================================================
        Metadata Tests
    ==========================================================================*/

    function testMetadata(){

        assert(

            "Metadata Exists",

            typeof WEF.Metadata !== "undefined",

            true,

            typeof WEF.Metadata !== "undefined"

        );

    }

    /*==========================================================================
        Print Summary
    ==========================================================================*/

    function printSummary(){

        Logger.log("");

        Logger.log("========== CORE TEST SUMMARY ==========");

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

        Logger.log("=======================================");

        Logger.log("");

    }

    /*==========================================================================
        Run
    ==========================================================================*/

    function run(){

        Logger.log("");

        Logger.log("========== CORE FRAMEWORK TESTS ==========");

        reset();

        testNamespace();

        testKernel();

        testConfig();

        testConstants();

        testEnvironment();

        testUtilities();

        testLogger();

        testValidator();

        testMetadata();

        printSummary();

        return {

            suite : "Core",

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
    Debug
==============================================================================*/

Logger.log(

    "Workspace ERP Core Tests Loaded"

);

/*==============================================================================
    Test Entry Point
==============================================================================*/

function test_Core(){

    return WEF.CoreTests.run();

}