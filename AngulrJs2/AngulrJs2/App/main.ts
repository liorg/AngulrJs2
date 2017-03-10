// main entry point /// <reference path="../../typings/shim.d.ts" />
/// <reference path="../typings/index.d.ts" />
/// <reference path="./globals.d.ts" />


import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppModule } from './app.module';
import 'web-animations-js';
//if (process != null && process.env!=null &&  process.env.ENV === 'production') {
//    enableProdMode();
//}
platformBrowserDynamic().bootstrapModule(AppModule);