// main entry point /// <reference path="../../typings/shim.d.ts" />
/// <reference path="../typings/index.d.ts" />
System.register(['@angular/platform-browser-dynamic', './app.module'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var platform_browser_dynamic_1, app_module_1;
    return {
        setters:[
            function (platform_browser_dynamic_1_1) {
                platform_browser_dynamic_1 = platform_browser_dynamic_1_1;
            },
            function (app_module_1_1) {
                app_module_1 = app_module_1_1;
            }],
        execute: function() {
            //if (process != null && process.env!=null &&  process.env.ENV === 'production') {
            //    enableProdMode();
            //}
            platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule);
        }
    }
});

//# sourceMappingURL=main.js.map
