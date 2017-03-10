
import {Inject,ChangeDetectionStrategy, Component, Input, Output, OnInit, OnDestroy, Renderer, ElementRef, EventEmitter, AfterViewInit, OnChanges, Injectable, Pipe, PipeTransform} from '@angular/core';
import { Router, ActivatedRoute }    from '@angular/router';
import { BrowserModule, Title  }  from '@angular/platform-browser';
import { MessagingConfig,PassengersBackendService, passengerDetail, flightDetail, contextPassangers, UiStateStore, UiState, BodyRootService} from './PassengersBackendService.service';
import { Subscription }              from 'rxjs/Subscription';
import { Result }                    from './Result.Model'
import { Observable } from 'rxjs/Observable';

@Pipe({
    name: 'passangersSelectedOrderFilter', pure: false
})
@Injectable()
export class passangersSelectedOrderFilter implements PipeTransform {
    transform(passengers: Observable<passengerDetail[]>, value: boolean): any {
        if (passengers != null) {
            return passengers.map((d: passengerDetail[]) => d.filter(passenger => passenger.isSelected == true));
        }
        return new Observable<passengerDetail[]>();

    }
}
@Component({
    moduleId: "App/",
    selector: 'reservation-details-view',
    templateUrl: 'reservationDetailsView.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class reservationDetailsViewCompnent implements OnInit, OnDestroy
{


    @Output()
    onShow = new EventEmitter<boolean>(false);

    private sub: Subscription;
    @Input()
    currentOrder: string;

    @Input()
    filghtId: string;
    
    @Input()
    set isShow(show: boolean) {
        //debugger;
        this.hideShowDialog(show);
       
    }

    isLoading: boolean = true;

    hideShowDialog(show: boolean): void {
        this._bodyRootService.setInactive(show);
        this._renderer.setElementClass(this.elementRef.nativeElement.firstChild, 'active', show);
        this.onShow.emit(show);
    }
    
    constructor(private renderer: Renderer,
        private elementRef: ElementRef,
        private _router: Router,
        private _route: ActivatedRoute,
        private _bodyRootService: BodyRootService,
        private _passengersBackendService: PassengersBackendService,
        private _uiStateStore: UiStateStore,
        private _renderer: Renderer,
        @Inject("messaging.config") private messagingConfig: MessagingConfig
    ) {
      
    

        this._uiStateStore.uiState.subscribe((uistate) => {
            this.isLoading = uistate.actionOngoing;
            console.log(uistate.message);
            console.log(uistate.actionOngoing);
            console.log(uistate.isErr);
            if (uistate.isErr) {
                _bodyRootService.errorScreen.next({
                    hasErr: true,
                    isLogic: false,
                    title: this.messagingConfig.UNANDLE_EXCEPTION,
                    desc: uistate.message,
                    msgType: this.messagingConfig.MSG_TYPE_DEFUALT
                });
            }
        });
        
    }

    ngOnInit(): void {
        this.sub = this._route.params.subscribe(
            params => {
               //wait when row params finished
              //  this.setPassangers(this.filghtId, this.currentOrder);
            });
    }
    
    editList_click(): void {
        debugger;
        this._bodyRootService.setInactive(false);
        this._passengersBackendService.notifySelectedPassngersCurrentOrder(true);
        this._router.navigate(['/Passangers', this.filghtId, this.currentOrder]);

    }

    close_click(): void {
        this.hideShowDialog(false);
    }

    ngOnDestroy() {
       this.sub.unsubscribe();
    }
}
