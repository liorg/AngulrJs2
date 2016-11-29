System.register(['@angular/core', '@angular/platform-browser', '@angular/router', '@angular/http', './app.component', './home/welcome.component', './products/products.component', './FlightPostponed/passangers.component', './products/product.service'], function(exports_1, context_1) {
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
    var core_1, platform_browser_1, router_1, http_1, app_component_1, welcome_component_1, products_component_1, passangers_component_1, product_service_1;
    var AppModule;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (platform_browser_1_1) {
                platform_browser_1 = platform_browser_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (app_component_1_1) {
                app_component_1 = app_component_1_1;
            },
            function (welcome_component_1_1) {
                welcome_component_1 = welcome_component_1_1;
            },
            function (products_component_1_1) {
                products_component_1 = products_component_1_1;
            },
            function (passangers_component_1_1) {
                passangers_component_1 = passangers_component_1_1;
            },
            function (product_service_1_1) {
                product_service_1 = product_service_1_1;
            }],
        execute: function() {
            AppModule = (function () {
                function AppModule() {
                }
                AppModule = __decorate([
                    core_1.NgModule({
                        imports: [platform_browser_1.BrowserModule, http_1.HttpModule, router_1.RouterModule.forRoot([
                                { path: 'welcome', component: welcome_component_1.WelcomeComponent },
                                { path: 'products', component: products_component_1.ProductsComponent },
                                { path: 'passangers', component: passangers_component_1.PassangersComponent },
                                { path: '', redirectTo: 'welcome', pathMatch: 'full' },
                                { path: '**', redirectTo: 'welcome', pathMatch: 'full' }
                            ])],
                        declarations: [app_component_1.AppComponent, products_component_1.ProductsComponent, welcome_component_1.WelcomeComponent, passangers_component_1.PassangersComponent],
                        bootstrap: [app_component_1.AppComponent],
                        providers: [
                            product_service_1.ProductService
                        ]
                    }), 
                    __metadata('design:paramtypes', [])
                ], AppModule);
                return AppModule;
            }());
            exports_1("AppModule", AppModule);
        }
    }
});

//# sourceMappingURL=app.module.js.map
