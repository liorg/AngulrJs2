System.register(['core-js/es6', 'core-js/es7/reflect'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    return {
        setters:[
            function (_1) {},
            function (_2) {}],
        execute: function() {
            require('zone.js/dist/zone');
            if (process.env.ENV === 'production') {
            }
            else {
                // Development
                Error['stackTraceLimit'] = Infinity;
                require('zone.js/dist/long-stack-trace-zone');
            }
        }
    }
});

//# sourceMappingURL=polyfills.js.map
