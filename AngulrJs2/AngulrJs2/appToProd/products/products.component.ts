import { Component, OnInit } from '@angular/core';
import { ProductService } from './product.service';

@Component({
    selector: 'pm-app',
    templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit  {
    productTitle: string = 'Acme Product Management';
    errorMessage: string;

    products: any[];
    
    constructor(private _productService: ProductService) {

    }
    ngOnInit(): void {
        this._productService.getProducts()
            .subscribe(products => this.products = products,
            error => this.errorMessage = <any>error);
    }
}
