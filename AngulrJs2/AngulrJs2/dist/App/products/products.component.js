System.register(['@angular/core', './product.service'], function(exports_1, context_1) {
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
    var core_1, product_service_1;
    var ProductsComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (product_service_1_1) {
                product_service_1 = product_service_1_1;
            }],
        execute: function() {
            ProductsComponent = (function () {
                function ProductsComponent(_productService) {
                    this._productService = _productService;
                    this.productTitle = 'Acme Product Management';
                }
                ProductsComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this._productService.getProducts()
                        .subscribe(function (products) { return _this.products = products; }, function (error) { return _this.errorMessage = error; });
                };
                ProductsComponent = __decorate([
                    core_1.Component({
                        selector: 'pm-app',
                        templateUrl: 'products.component.html',
                        moduleId: "app/products/" // fully resolved filename; defined at module load time
                    }), 
                    __metadata('design:paramtypes', [product_service_1.ProductService])
                ], ProductsComponent);
                return ProductsComponent;
            }());
            exports_1("ProductsComponent", ProductsComponent);
        }
    }
});

//# sourceMappingURL=products.component.js.map
