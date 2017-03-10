import { Component, Input, Output, OnInit, OnDestroy, Renderer, ElementRef, EventEmitter, AfterViewInit, OnChanges, Injectable, Pipe, PipeTransform} from '@angular/core';
import { Router, ActivatedRoute }    from '@angular/router';
import { BrowserModule, Title  }  from '@angular/platform-browser';
import { PassengersBackendService, passengerDetail, flightDetail, contextPassangers, UiStateStore, UiState, BodyRootService} from './PassengersBackendService.service';
import { Subscription }              from 'rxjs/Subscription';
import { Result }                    from './Result.Model'
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'loader-data',
    moduleId: "App/",
    templateUrl: 'loader.html',
})
export class loaderComponent  {
    //@Input()
    //isLoading: boolean ;
}
