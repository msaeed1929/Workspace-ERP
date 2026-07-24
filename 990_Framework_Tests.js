/**
 * =============================================================================
 * Workspace ERP Framework (WEF)
 * =============================================================================
 * File            : 99_Framework_Tests.gs
 * Module          : Framework Test Runner
 * Version         : 3.2.0
 * Author          : Workspace ERP Framework
 * -----------------------------------------------------------------------------
 * Description
 * -----------------------------------------------------------------------------
 * Master test runner for the entire Workspace ERP Framework.
 *
 * Responsibilities
 * ----------------
 * • Initialize test environment
 * • Register test suites
 * • Execute test suites
 * • Measure execution time
 * • Produce execution summary
 * • Return structured results
 * =============================================================================
 */

"use strict";

/*==============================================================================
    Framework Test Namespace
==============================================================================*/

WEF.Tests = (function(){

    /*==========================================================================
        Configuration
    ==========================================================================*/

    const VERSION = "3.2.0";

    /*==========================================================================
        Private Members
    ==========================================================================*/

    let suites = [];

    let results = [];

    let statistics = {};

    let initialized = false;

    let startedAt = null;

    let finishedAt = null;

    /*==========================================================================
        Initialize
    ==========================================================================*/

    function initialize(){

        reset();

        Logger.log("");

        Logger.log("==================================================");

        Logger.log("Workspace ERP Framework Test Runner");

        Logger.log("Version : " + VERSION);

        Logger.log("==================================================");

        startedAt = new Date();

        initialized = true;

        registerDefaultSuites();

        Logger.log(

            "Registered Test Suites : " +

            suites.length

        );

    }

    /*==========================================================================
        Register Default Suites
    ==========================================================================*/

    function registerDefaultSuites(){

        registerSuite(

            "Core",

            "WEF.CoreTests"

        );

        registerSuite(

            "ERP",

            "WEF.ERPTests"

        );

        registerSuite(

            "UI",

            "WEF.UITests"

        );

        registerSuite(

            "Client",

            "WEF.ClientTests"

        );

        registerSuite(

            "Widget",

            "WEF.WidgetTests"

        );

        registerSuite(

            "Integration",

            "WEF.IntegrationTests"

        );

        registerSuite(

            "Performance",

            "WEF.PerformanceTests"

        );

        registerSuite(

            "Security",

            "WEF.SecurityTests"

        );

        registerSuite(

            "Database",

            "WEF.DatabaseTests"

        );

    }

    /*==========================================================================
        Register Suite
    ==========================================================================*/

    function registerSuite(

        name,

        namespace

    ){

        suites.push({

            name : name,

            namespace : namespace

        });

    }

    /*==========================================================================
        Framework Health Check
    ==========================================================================*/

    function healthCheck(){

        const health = {

            namespace :

                typeof WEF !==

                "undefined",

            config :

                typeof WEF.Config !==

                "undefined",

            logger :

                typeof WEF.Logger !==

                "undefined",

            validator :

                typeof WEF.Validator !==

                "undefined",

            environment :

                typeof WEF.Environment !==

                "undefined"

        };

        const passed =

            Object.keys(

                health

            ).every(

                function(key){

                    return health[key];

                }

            );

        Logger.log("");

        Logger.log("Health Check");

        Logger.log("----------------------------");

        Object.keys(

            health

        ).forEach(

            function(key){

                Logger.log(

                    key +

                    " : " +

                    (

                        health[key]

                        ? "PASS"

                        : "FAIL"

                    )

                );

            }

        );

        Logger.log("");

        return {

            passed : passed,

            details : health

        };

    }

    /*==========================================================================
        Before All
    ==========================================================================*/

    function beforeAll(){

        Logger.log(

            "Starting Framework Tests..."

        );

    }

    /*==========================================================================
        After All
    ==========================================================================*/

    function afterAll(){

        Logger.log(

            "Framework Tests Finished."

        );

    }

    /*==========================================================================
        Before Suite
    ==========================================================================*/

    function beforeSuite(name){

        Logger.log("");

        Logger.log("------------------------------------------");

        Logger.log("Running Suite : " + name);

        Logger.log("------------------------------------------");

    }

    /*==========================================================================
        After Suite
    ==========================================================================*/

    function afterSuite(result){

        Logger.log(

            "Result : " +

            result.status

        );

        Logger.log(

            "Duration : " +

            result.duration +

            " ms"

        );

    }

    /*==========================================================================
        Run Suite
    ==========================================================================*/

    function runSuite(suite){

        beforeSuite(

            suite.name

        );

        const start =

            new Date();

        const result = {

            name :

                suite.name,

            namespace :

                suite.namespace,

            status :

                "NOT IMPLEMENTED",

            duration :

                0,

            message :

                "",

            details :

                null

        };

        try{

            const handler =

                suite.namespace

                    .split(".")

                    .reduce(

                        function(obj,key){

                            return obj && obj[key];

                        },

                        this

                    );

            if(

                handler &&

                typeof handler.run ===

                "function"

            ){

                result.details =

                    handler.run();

                result.status =

                    "PASS";

            }

            else{

                result.message =

                    "Suite not implemented.";

            }

        }

        catch(error){

            result.status =

                "FAIL";

            result.message =

                error.message;

            Logger.log(

                "ERROR : " +

                error.message

            );

        }

        result.duration =

            new Date() - start;

        results.push(

            result

        );

        afterSuite(

            result

        );

        return result;

    }

    /*==========================================================================
        Run All Tests
    ==========================================================================*/

    function run(){

        initialize();

        beforeAll();

        const health =

            healthCheck();

        if(

            !health.passed

        ){

            Logger.log(

                "Framework health check failed."

            );

        }

        suites.forEach(

            function(suite){

                runSuite(

                    suite

                );

            }

        );

        finishedAt =

            new Date();

        buildStatistics();

        afterAll();

        printSummary();

        return getResults();

    }

    /*==========================================================================
        Build Statistics
    ==========================================================================*/

    function buildStatistics(){

        statistics = {

            total :

                results.length,

            passed :

                results.filter(

                    function(item){

                        return item.status === "PASS";

                    }

                ).length,

            failed :

                results.filter(

                    function(item){

                        return item.status === "FAIL";

                    }

                ).length,

            skipped :

                results.filter(

                    function(item){

                        return item.status === "NOT IMPLEMENTED";

                    }

                ).length

        };

    }

    /*==========================================================================
        Print Summary
    ==========================================================================*/

    function printSummary(){

        Logger.log("");

        Logger.log("==================================================");

        Logger.log("Framework Test Summary");

        Logger.log("==================================================");

        Logger.log(

            "Suites : " +

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

        Logger.log(

            "Skipped : " +

            statistics.skipped

        );

        Logger.log(

            "Execution Time : " +

            (

                finishedAt -

                startedAt

            ) +

            " ms"

        );

        Logger.log("==================================================");

    }

    /*==========================================================================
        Get Results
    ==========================================================================*/

    function getResults(){

        return {

            framework :

                VERSION,

            startedAt :

                startedAt,

            finishedAt :

                finishedAt,

            duration :

                finishedAt -

                startedAt,

            statistics :

                statistics,

            suites :

                results

        };

    }

    /*==========================================================================
        Reset
    ==========================================================================*/

    function reset(){

        suites = [];

        results = [];

        statistics = {};

        startedAt = null;

        finishedAt = null;
    }

    /*==========================================================================
        Public API
    ==========================================================================*/

    return {

        initialize :

            initialize,

        registerSuite :

            registerSuite,

        healthCheck :

            healthCheck,

        runSuite :

            runSuite,

        run :

            run,

        getResults :

            getResults,

        reset :

            reset

    };

})();

/*==============================================================================
    Global Test Entry Point
==============================================================================*/

function test_Framework(){

    return WEF.Tests.run();

}

/*==============================================================================
    Debug
==============================================================================*/

Logger.log(

    "Workspace ERP Framework Test Runner Loaded"

);