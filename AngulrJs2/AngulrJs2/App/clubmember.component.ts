import { Inject,Component, ChangeDetectionStrategy, Input, Output, OnInit, OnDestroy, Renderer, ElementRef, EventEmitter, AfterViewInit, OnChanges, Injectable, Pipe, PipeTransform} from '@angular/core';
import { Router, ActivatedRoute }    from '@angular/router';
import { BrowserModule, Title  }  from '@angular/platform-browser';
import { MessagingConfig,PassengersBackendService, passengerDetail, flightDetail, contextPassangers, UiStateStore, UiState, BodyRootService} from './PassengersBackendService.service';
import { Subscription }              from 'rxjs/Subscription';
import { Result }                    from './Result.Model'
import { Observable } from 'rxjs/Observable';

@Component({
    moduleId: "App/",
    selector: 'app-member',
    template: `
     <span      [ngClass]="setClass()" ></span>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClubmemberComponent  {
    /*
    TOP – סגול כהה
    PL – סגול בהיר
    GOLD- זהב
    SL - כסף
    FRQ – כחול

    */
    @Input()
    member: string;

 
    setClass() {
        //debugger;
       
        let classes = {
            'membership': true,
            'none': this.member == "" || this.member == null ,
            'gold': this.member == "GLD",
            'silver': this.member == "SLV",
            'platinum': this.member == "PLT",
            'top_platinum': this.member == "TOP",
            'kneset': this.member == "FRQ",
       
        };
        return classes;
    }
    
    constructor(private renderer: Renderer,
        private elRef: ElementRef,
        private _router: Router,
        private _route: ActivatedRoute,
        private _passengersBackendService: PassengersBackendService,
        private _uiStateStore: UiStateStore,
        @Inject("messaging.config") private messagingConfig: MessagingConfig
    ) {

    }

    


}
