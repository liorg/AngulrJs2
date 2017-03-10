///<reference path=".././jquery.d.ts" />
///<reference path=".././Application.d.ts" />
/// <reference path=".././globals.d.ts" />
import { style, ViewContainerRef, ComponentFactoryResolver, ComponentRef,
    ChangeDetectionStrategy, Input, Output, Inject, EventEmitter, Directive, forwardRef,
    Attribute, ViewEncapsulation, Component, AfterViewInit, OnInit, Renderer,
    ElementRef, OnDestroy, ChangeDetectorRef, Injectable, Pipe, PipeTransform,
    trigger, state, animate, transition} from '@angular/core';

import { DOCUMENT } from '@angular/platform-browser';

import { Http, Headers } from "@angular/http";
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription }       from 'rxjs/Subscription';
import { MessagingConfig, PassengersBackendService, passengerDetail, flightDetail,
    contextPassangers, UiStateStore, UiState, BodyRootService} from '../PassengersBackendService.service';
import { Observable } from 'rxjs/Observable';

import { Result }                    from '../Result.Model'
import { ProfileDetail }            from '../ProfileDetail.Model';
import { PassengerService }         from './passanger.service';
import {  passengerExtra } from './orderFlightPostponedRequest.Model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';



@Directive({
    selector: '[dialogPassangerAnchor]'
})
export class DialogPassangerDirective {

    continueChange = new EventEmitter<any>();

    constructor(
        private elementRef: ElementRef, private renderer: Renderer,
        @Inject(DOCUMENT) private document,
        private viewPassangerContainer: ViewContainerRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        @Inject("messaging.config") private messagingConfig: MessagingConfig

    ) {
    }

    createDialog(flightViewDetail: flightDetail, passenger: passengerDetail,
        passangerComponent: { new (): PassangerComponent }): ComponentRef<PassangerComponent> {
        debugger;
        let body = this.document.getElementsByTagName('body')[0];
        if (!body.classList.contains('modal-shown')) {
            this.renderer.setElementClass(body, 'modal-shown', true);
        }
        else
            return;
        this.viewPassangerContainer.clear();

        let passangerComponentFactory = this.componentFactoryResolver.resolveComponentFactory(passangerComponent);
        let dialogPassangerComponentRef = this.viewPassangerContainer.createComponent(passangerComponentFactory);
        dialogPassangerComponentRef.instance.passenger = passenger;
        dialogPassangerComponentRef.instance.FlightViewDetail = flightViewDetail;
        dialogPassangerComponentRef.instance.IsVisible = true;
        dialogPassangerComponentRef.instance.close.subscribe(() => {
            dialogPassangerComponentRef.instance.IsVisible = false;
            let body = this.document.getElementsByTagName('body')[0];
            this.renderer.setElementClass(body, 'modal-shown', false);
            setTimeout(function () {
                debugger;
                dialogPassangerComponentRef.destroy();


            }, 300);
        });
        return dialogPassangerComponentRef;
    }
}

@Component({
    moduleId: "app/Passangers/",
    selector: 'pm-passanger',
    templateUrl: 'passanger.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('visibilityChanged', [
            state('shown', style({ opacity: 1 })),
            state('hidden', style({ opacity: 0 })),
            transition('* => *', animate('.300s'))
        ])
    ]
})

export class PassangerComponent implements AfterViewInit, OnInit, OnDestroy {
    // debugger;
    @Input()
    passenger: passengerDetail;
    @Input()
    FlightViewDetail: flightDetail;

   // passengerExtraDetail: passengerExtra;

    @Input()
    set IsVisible(b: boolean) {
        if (b)
            this.visibility = 'shown';
        else
            this.visibility = 'hidden';

    }

    public visibility: string = 'hidden';

    passengerExtra: BehaviorSubject<passengerExtra>;
    passengerExtra$: Observable<passengerExtra>;



    constructor(
        private http: Http,
        private _cd: ChangeDetectorRef,
        private _route: ActivatedRoute,
        private renderer: Renderer, private elementRef: ElementRef,
        private _router: Router,
        private _passengersBackendService: PassengersBackendService,
        private _bodyRootService: BodyRootService,
        private _passengerService: PassengerService,
        @Inject("messaging.config") private messagingConfig: MessagingConfig
    ) {
        debugger;
        this.passengerExtra = new BehaviorSubject(
            <passengerExtra>{ id: '', className: '' });
        this.passengerExtra$ = this.passengerExtra.asObservable();
    
    }

    ngOnInit(): void {
        if (this.passenger == null || this.passenger.id == null || this.passenger.id == '') {
            return;
        }
        this._passengerService.getExtraPassenger(this.passenger.id).subscribe(
            (result) => {
                debugger;
                if (result.isErr) {
                    //this._bodyRootService.errorScreen.next({
                    //    hasErr: result.isErr,
                    //    isLogic: !result.isErrUnandleException,
                    //    title: result.titleErr,
                    //    desc: result.desc,
                    //    msgType: this.messagingConfig.MSG_TYPE_DEFUALT
                    //});
                    return;
                }
                this.passengerExtra.next(result.model);
               // this.passengerExtraDetail = result.model;

            },
            error => {
                debugger;
                //this._bodyRootService.errorScreen.next({
                //    hasErr: true,
                //    isLogic: false,
                //    title: this.messagingConfig.UNANDLE_EXCEPTION,
                //    desc: error,
                //    msgType: this.messagingConfig.MSG_TYPE_DEFUALT
                //});
            });
    }

    close = new EventEmitter();

    onClickedExit() {
        this.close.emit('event');
    }

    ngAfterViewInit(): void {
        $(document).bind(
            'touchmove',
            function (e) {
                e.preventDefault();
            }
        );
    }


    ngOnDestroy() {
        $(document).unbind(
            'touchmove'
        );
    }

}
