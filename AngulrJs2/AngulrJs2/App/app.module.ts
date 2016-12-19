import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

import { ProfileComponent } from './profile/Profile.Component';
//import { Result } from './profile/Result.Model';
//import { ProfileDetail } from './profile/ProfileDetail.Model';

import { AppComponent } from './app.component';
import { WelcomeComponent } from './home/welcome.component';
import { ProductsComponent } from './products/products.component';
import { PassangersComponent } from './FlightPostponed/passangers.component';
import { ProductService } from './products/product.service';
import { XProfileService } from './profile/XProfile.service';

@NgModule({
    imports: [BrowserModule, HttpModule, RouterModule.forRoot([
        { path: 'welcome', component: WelcomeComponent },
        { path: 'login', component: ProfileComponent },
        { path: 'products', component: ProductsComponent },
        { path: 'passangers', component: PassangersComponent },
        { path: '', redirectTo: 'welcome', pathMatch: 'full' },
        { path: '**', redirectTo: 'welcome', pathMatch: 'full' }
    ])],
    declarations: [
        ProfileComponent, AppComponent, WelcomeComponent, ProductsComponent, PassangersComponent
    ],
    providers: [
        ProductService, XProfileService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
