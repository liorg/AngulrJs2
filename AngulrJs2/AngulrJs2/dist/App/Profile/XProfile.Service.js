System.register(['@angular/core', '@angular/http', 'rxjs/Observable', 'rxjs/add/operator/do', 'rxjs/add/operator/catch', 'rxjs/add/operator/map'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, http_1, Observable_1;
    var XProfileService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            },
            function (_1) {},
            function (_2) {},
            function (_3) {}],
        execute: function() {
            XProfileService = (function () {
                function XProfileService(_http) {
                    this._http = _http;
                    //private _productUrl = 'Demo/products/products.json';
                    this._prfileUrl = 'api/CRM/GetCurrentProfile';
                }
                XProfileService.prototype.getProfile = function () {
                    return this._http.get(this._prfileUrl)
                        .map(function (response) { return response.json(); })
                        .do(function (data) {
                        debugger;
                        if (data.isErr) {
                            Observable_1.Observable.throw(data.desc);
                        }
                        console.log('All: ' + JSON.stringify(data));
                    })
                        .catch(this.handleError);
                };
                XProfileService.prototype.handleError = function (error) {
                    // in a real world app, we may send the server to some remote logging infrastructure
                    // instead of just logging it to the console
                    console.error(error);
                    return Observable_1.Observable.throw(error.json().error || 'Server error');
                };
                XProfileService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], XProfileService);
                return XProfileService;
            }());
            exports_1("XProfileService", XProfileService);
        }
    }
});

//# sourceMappingURL=XProfile.Service.js.map
