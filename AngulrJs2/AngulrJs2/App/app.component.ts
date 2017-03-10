/// <reference path="./globals.d.ts" />
/// <reference path="./jquery.d.ts" />
import { Inject, Component, OnInit, OnDestroy, Renderer, ElementRef, EventEmitter
    , ViewContainerRef, ViewChild, ComponentFactoryResolver, ComponentRef

} from '@angular/core';
import { Result } from './Result.Model';
import { ProfileDetail } from './ProfileDetail.Model';
import { MessagingConfig, PassengersBackendService, passengerDetail, flightDetail, contextPassangers, UiStateStore, UiState, BodyRootService, errMessage} from './PassengersBackendService.service';
import { DialogAnchorDirective, DialogComponent} from './DialogComponent.Component';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
@Component({
    moduleId: "App/",
    selector: 'pm-app',
    templateUrl: 'profile.component.html',
    entryComponents: [DialogComponent]
})
export class AppComponent //implements OnInit, OnDestroy
{
    @ViewChild(DialogAnchorDirective) dialogAnchor: DialogAnchorDirective;

    userTitle: string = '...';
    errorMessage: string = "please wait...";
    loginDateDay: string = "";
    loginDateHour: string = "";
    loginDateMonth: string = "";
    loginDateNum: string = "";
    loginDateYear: string = "";
    profileModel: Result<ProfileDetail>;
    showAlert: boolean = false;
    continueChange = new EventEmitter<any>();

    testDialogBox() {
        this.dialogAnchor.createDialog(this.continueChange, "some title", 'some type', "test !!", false, Object.assign(DialogComponent));
    }

    openaAlertBox(errorMessage: errMessage): void {
        this.dialogAnchor.createDialog(this.continueChange, errorMessage.desc, errorMessage.msgType, errorMessage.title, errorMessage.isLogic, Object.assign(DialogComponent));
    }

    constructor(private resolver: ComponentFactoryResolver,
        private _bodyRootService: BodyRootService,
        private renderer: Renderer,
        private elRef: ElementRef,
        private _passengersBackendService: PassengersBackendService,
        @Inject("messaging.config") private messagingConfig: MessagingConfig
    ) {
        this.profileModel = profileUser;
        this.userTitle = profileUser.model.name;
        this.userTitle = this.profileModel.model.name;
        this.loginDateDay = this.profileModel.model.loginDateDay;
        this.loginDateHour = this.profileModel.model.loginDateHour;
        this.loginDateMonth = this.profileModel.model.loginDateMonth;
        this.loginDateNum = this.profileModel.model.loginDateNum;
        this.loginDateYear = this.profileModel.model.loginDateYear;
        debugger;
       //setInterval(function () {
       //     let track = _passengersBackendService.CurrentTrackDateTime;
       //     _passengersBackendService.getDeltaTrack(track).subscribe((tracking) => {
       //         debugger;
       //         if (!tracking.isErr) {
       //             //_passengersBackendService.saveDeltaChangedHelper(tracking.model);
       //             _passengersBackendService.CurrentTrackDateTime = new Date();
       //         }
       //         else {
                  
       //         }
       //     }, (err) => {
       //         debugger;
       //         console.log(err);
       //     })

       // },1000);

        _passengersBackendService.isDisconected$.subscribe((isdisconnect) => {
            console.log(isdisconnect);

            if (isdisconnect) {
                let bodyRootRef = this._bodyRootService;
                let messagingConfigRef = this.messagingConfig;
                let passengersBackendServiceRef = this._passengersBackendService;

                setTimeout(function () {
                    debugger;
                    let track = passengersBackendServiceRef.CurrentTrackDateTime;
                    if (track === null) {
                        bodyRootRef.errorScreen.next({
                            hasErr: true,
                            isLogic: false,
                            title: messagingConfigRef.TITLE_CONNECTIONLESS,
                            desc: messagingConfigRef.DESC_CONNECTIONLESS + "[track === null]",
                            msgType: messagingConfigRef.MSG_TYPE_FROCELOAD
                        });
                        passengersBackendServiceRef.resetCache();
                        return;
                    }
                    passengersBackendServiceRef.getDeltaTrack(track).subscribe((tracking) => {
                        if (!tracking.isErr) {
                            passengersBackendServiceRef.saveDeltaChangedHelper(tracking.model);
                        }
                        else {
                            bodyRootRef.errorScreen.next({
                                hasErr: true,
                                isLogic: false,
                                title: messagingConfigRef.TITLE_CONNECTIONLESS,
                                desc: messagingConfigRef.DESC_CONNECTIONLESS + "[getDeltaTrack has error]",
                                msgType: messagingConfigRef.MSG_TYPE_FROCELOAD
                            });
                            passengersBackendServiceRef.resetCache();
                            return;

                        }
                        passengersBackendServiceRef.startChannel();

                    }, (err) => {
                        debugger;
                        console.log(err);
                        passengersBackendServiceRef.resetCache();
                        bodyRootRef.errorScreen.next({
                            hasErr: true,
                            isLogic: false,
                            title: messagingConfigRef.TITLE_CONNECTIONLESS,
                            desc: messagingConfigRef.DESC_CONNECTIONLESS + "[getDeltaTrack unandle Exception!!!]",
                            msgType: messagingConfigRef.MSG_TYPE_FROCELOAD
                        });

                    });

                }, this.messagingConfig.TIME_RETRY_CONNECTION);
            }
        },//isDisconected$.subscribe failed
            (err) => {
                this._passengersBackendService.resetCache();
                this._bodyRootService.errorScreen.next({
                    hasErr: true,
                    isLogic: false,
                    title: messagingConfig.UNANDLE_EXCEPTION,
                    desc: messagingConfig.REFRESH,
                    msgType: this.messagingConfig.MSG_TYPE_REFRESH_SITE
                });
            });

        this.renderer.setElementClass(this.elRef.nativeElement.offsetParent, 'modal-shown', false);

        _bodyRootService.inactiveScreen$.subscribe((isInactive) => {
            renderer.setElementClass(this.elRef.nativeElement.offsetParent, 'inactive', isInactive);
        });

        _bodyRootService.errorScreen$.subscribe((errorMessage: errMessage) => {
            if (errorMessage.hasErr)
                this.openaAlertBox(errorMessage);
        });

        this.continueChange.subscribe((msgType) => {
            _bodyRootService.errorHanlderScreen.next(msgType);
        });
    }
}
