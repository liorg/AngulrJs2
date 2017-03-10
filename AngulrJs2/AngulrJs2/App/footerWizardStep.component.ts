import { Inject,Component, ChangeDetectionStrategy, Input, Output, OnInit, OnDestroy, Renderer, ElementRef, EventEmitter, AfterViewInit, OnChanges, Injectable, Pipe, PipeTransform} from '@angular/core';
import { Router, ActivatedRoute }    from '@angular/router';
import { BrowserModule, Title  }  from '@angular/platform-browser';
import { MessagingConfig,PassengersBackendService, passengerDetail, flightDetail, contextPassangers, UiStateStore, UiState, BodyRootService} from './PassengersBackendService.service';
import { Subscription }              from 'rxjs/Subscription';
import { Result }                    from './Result.Model'
import { Observable } from 'rxjs/Observable';

@Component({
    moduleId: "App/",
    selector: 'app-footer',
    templateUrl: 'footerWizardStep.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class footerWizardStepComponent implements OnInit, OnDestroy {

    @Input()
    canSave: boolean = false;

    @Input()
    canPrev: boolean = false;

    @Output() onNext = new EventEmitter<any>(null);

    @Output() onPrev = new EventEmitter();

    setBackClass() {
        //debugger;
        let classes = {
            'back': true,
            'disabled': this.canPrev,
       
        };
        return classes;
    }

    setCanSave(): boolean{
       // debugger;
        return this.canSave;
    }
    prev(): void {
       // debugger;
        this.onPrev.emit();
    }

    next(event$): void {
        debugger;
        this.onNext.emit({ get_event: event$ });
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

    ngOnInit(): void {

    }

    ngOnDestroy() {
        // this.sub.unsubscribe();
    }


}
