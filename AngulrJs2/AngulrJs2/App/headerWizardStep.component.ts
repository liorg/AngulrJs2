import { Inject,ChangeDetectionStrategy, Component, Input, Output, OnInit, OnDestroy, Renderer, ElementRef, EventEmitter, AfterViewInit, OnChanges, Injectable, Pipe, PipeTransform} from '@angular/core';
import { Router, ActivatedRoute }    from '@angular/router';
import { BrowserModule, Title  }  from '@angular/platform-browser';
import { MessagingConfig,PassengersBackendService, passengerDetail, flightDetail, contextPassangers, UiStateStore, UiState, BodyRootService} from './PassengersBackendService.service';
import { Subscription }              from 'rxjs/Subscription';
import { Result }                    from './Result.Model'
import { Observable } from 'rxjs/Observable';

@Component({
    moduleId: "App/",
    selector: 'app-header',
    templateUrl: 'headerWizardStep.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class headerWizardStepComponent implements OnInit, OnDestroy {
    @Input()
    Step: number;

    private sub: Subscription;

    @Input()
    titleStep: string;

    @Input()
    currentOrder: string;

    @Input()
    isShowHamburger: boolean;
    

    @Input()
    filghtId: string;

    ngClassStep1() {
        let classes = {
            active: this.Step >= 1,
            current: false
        };
        return classes;
    }

    ngClassStep2() {
        let classes = {
            active: this.Step > 2,
            current: this.Step == 2
        };
        return classes;
    }

    ngClassStep3() {
        let classes = {
            active: this.Step > 3,
            current: this.Step == 3
        };
        return classes;
    }

    ngClassStep4() {
        let classes = {
            active: this.Step > 4,
            current: this.Step == 4
        };
        return classes;
    }

    ngClassStep5() {
        let classes = {
            active: this.Step > 5,
            current: this.Step == 5
        };
        return classes;
    }

    ngClassStep6() {
        let classes = {
            active: this.Step > 6,
            current: this.Step == 6
        };
        return classes;
    }
    ngClassStep7() {
        let classes = {
            active: this.Step > 7,
            current: this.Step == 7
        };
        return classes;
    }


    @Output() onNext = new EventEmitter();

    @Output() onPrev = new EventEmitter();

    FlightViewDetail: flightDetail;

    prev(): void {
        this.onPrev.emit();
    }

    next(): void {
        this.onNext.emit();
    }
   
    hamburger_click(): void {
         debugger;
        //if (this.isShowHamburger == false) {
            this.isShowHamburger = true;
       
       // }
       // else {
        //    this.isShowHamburger = false;
       // }
    }
    showDialogHandler(b: boolean): void {
        debugger;
        if(b==false)
            this.isShowHamburger = b;
    }
    constructor(private renderer: Renderer,
        private elRef: ElementRef,
        private _router: Router,
        private _route: ActivatedRoute,
        private _passengersBackendService: PassengersBackendService,
        private _uiStateStore: UiStateStore,
        @Inject("messaging.config") private messagingConfig: MessagingConfig
    ) {
        _passengersBackendService.flight$.subscribe((fli) => {
            this.FlightViewDetail = fli;
        });
    }

    ngOnInit(): void {
        this.sub = this._route.params.subscribe(
            params => {
                this.setPassangers(this.filghtId, this.currentOrder);
            });
    }

    setPassangers(num: string, order: string): void {
        this._passengersBackendService.loadSessionStore(num, order);
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }


}
