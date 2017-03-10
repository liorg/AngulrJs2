import { NgModule } from '@angular/core';
//import { BrowserModule } from '@angular/platform-browser';
import { BrowserModule, Title }  from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
//import "ng2-completer";
import {Ng2Webstorage} from 'ng2-webstorage';
import { Ng2CompleterModule } from "ng2-completer";

import { AppComponent }  from './app.component';
import { ClubmemberComponent }  from './clubmember.component';
import { WelcomeComponent } from './home/welcome.component';
import { DisconnectComponent } from './home/disconnect.component';
import { PassangersrComponent } from './Passangers/passangersr.component';
import { PassangersSelectedFilter, passangersDataFilter} from './Passangers/CustomerSelectedFilter.pipe';

import { SummeryComponent } from './Summery/summery.component';
import { SummeryService } from './Summery/summery.service';
import { PrimaryContactComponent } from './Contact/primarycontact.component';
import { ContactService } from './Contact/contact.service';

import { CommentComponent }            from './Order/comment.component';
import { CommentService }            from './Order/comment.service';
import { ConfirmationComponent }            from './Order/confirmation.component';


import { FlightsComponent } from './Flights/flights.component';
import { OrderPostponedComponent, PrefferValidator} from './FlightPostponed/orderPostponed.component';
import { LogComponent} from './Logs/log.component';
import { OrderPostponedService} from './FlightPostponed/orderPostponed.service';
import { FlightsService } from './Flights/flights.service';
import { PassengersBackendService, passengerDetail, flightDetail, MessagingConfig, UiStateStore, UiState, BodyRootService} from './PassengersBackendService.service';
import { FlightsDetailGuard } from './Flights/flights-guard';
import { ChannelService, ChannelConfig, SignalrWindow} from "./channel.service";
import { AccommodationService } from './Accommodation/accommodation.service';
import { AccommodationComponent } from './Accommodation/accommodation.component';
import { PreferenceComponent } from './Accommodation/preference.component';
import { MyDateReq, MyDate, EqualValidator, MyDateOlderDate} from "./customValidation.directive";
import { PassengerService } from './Passangers/passanger.service';
import { reservationDetailsViewCompnent, passangersSelectedOrderFilter} from './reservationDetailsView.component';
import { TransportTaxiComponent} from './Transport/transportTaxi.component';
import { TransportationComponent} from './Transport/transportation.component';
import { headerWizardStepComponent} from './headerWizardStep.component';
import { footerWizardStepComponent} from './footerWizardStep.component';
import { DialogPassangerDirective, PassangerComponent } from './Passangers/passanger.component';

import { TaxiService } from './Transport/taxi.service';
import { DialogComponent, DialogAnchorDirective} from './DialogComponent.Component';
import { loaderComponent} from './loader.component';
import 'web-animations-js'

let channelConfig = new ChannelConfig();
channelConfig.url = "/signalr";
channelConfig.hubName = "LockHub";


let messagingConfig = new MessagingConfig();
messagingConfig.UNANDLE_EXCEPTION = "Unhandle Exception";
messagingConfig.REFRESH = "Refersh You Site Again";
messagingConfig.MSG_TYPE_DEFUALT = "NONE";
messagingConfig.MSG_PREFER_HOTEL = "The hotel is intended for preferred customers. Are you sure you want to choose this hotel?";
messagingConfig.LOGIC_TITLE = "Warning";
messagingConfig.MSG_TYPE_HOTEL_PREFFER = "HOTEL_PREFFER";
messagingConfig.MSG_TYPE_REFRESH_SITE = "REFRESH_SITE";
messagingConfig.TITLE_SCREEN = "ELעלALאל &mdash; Passengers On Delayed Flight";
messagingConfig.MSG_TYPE_WARNING = "WARNING_AND_CONTINUE";
messagingConfig.TITE_EXCEED_TOTAL_BUS = "BUS Problem";
messagingConfig.MSG_TYPE_ROUTE_BUS = "ROUTE_BUS";
messagingConfig.MSG_TYPE_SEARCH = "SEARCH";
messagingConfig.TITLE_SEARCH_SCREEN = "Search Field Warning";
messagingConfig.DESC_SEARCH_SCREEN = "You Must Enter Last Name Or Ticket Number Or PNR";
messagingConfig.NOTIFY_SEARCH_SCREEN = "No Passengers Were Founded. Please Try Again";
messagingConfig.DESC_CONNECTIONLESS = "Comnnection has been Losted , Refresh Page Again";
messagingConfig.TITLE_CONNECTIONLESS = "Comnnection has been Losted";
messagingConfig.TIME_RETRY_CONNECTION = 8000; 
messagingConfig.MSG_TYPE_FROCELOAD = "FROCE LOAD";
messagingConfig.TIME_HOURS_CHECKOUT = 24; 

@NgModule({
    imports: [
        Ng2CompleterModule,
        Ng2Webstorage,
        BrowserModule, HttpModule, ReactiveFormsModule, FormsModule, RouterModule.forRoot([
            { path: 'Welcome', component: WelcomeComponent },
            { path: 'Disconnect', component: DisconnectComponent },
            { path: 'Logge', component: LogComponent },
            { path: 'Comment/:id/:oid', component: CommentComponent },
            //{ path: 'Confirmation/:id/:oid', component: ConfirmationComponent },
            { path: 'Confirmation/:id', component: ConfirmationComponent },
            { path: 'Accom/:id/:oid', component: AccommodationComponent },
            { path: 'Flight/:id', canActivate: [FlightsDetailGuard], component: FlightsComponent },
            { path: 'Passangers/:id/:oid', component: PassangersrComponent },
            { path: 'Passangers/:id', component: PassangersrComponent },
            { path: 'FlightPostponed/:id/:oid', component: OrderPostponedComponent },
            { path: 'Preference/:id/:oid', component: PreferenceComponent },
            { path: 'Contact/:id/:oid', component: PrimaryContactComponent },
            { path: 'Summery/:id/:oid', component: SummeryComponent },
            { path: 'Taxi/:id/:oid/:isdispatch', component: TransportTaxiComponent },
            { path: 'Transportation/:id/:oid/:isdispatch', component: TransportationComponent },
            { path: '', redirectTo: 'Welcome', pathMatch: 'full' },
            { path: '**', redirectTo: 'Welcome', pathMatch: 'full' },
        ])],
    declarations: [AppComponent, WelcomeComponent, PassangersrComponent,
        OrderPostponedComponent, FlightsComponent,
        PassangersSelectedFilter, passangersDataFilter,
        passangersSelectedOrderFilter, AccommodationComponent, PreferenceComponent,
        reservationDetailsViewCompnent, headerWizardStepComponent, loaderComponent,
        DialogComponent, DialogAnchorDirective, DialogPassangerDirective, PassangerComponent,
        TransportTaxiComponent, footerWizardStepComponent, EqualValidator,
        PrefferValidator, MyDate, MyDateReq, MyDateOlderDate, TransportationComponent, SummeryComponent,
        LogComponent, ClubmemberComponent, ConfirmationComponent, CommentComponent, DisconnectComponent,
        PrimaryContactComponent
    ],
    entryComponents: [DialogComponent],
    bootstrap: [AppComponent],
    providers:
    [
        Title, BodyRootService,
        FlightsService, FlightsDetailGuard, PassengerService, PassengersBackendService, OrderPostponedService,
        ChannelService, UiStateStore, AccommodationService, TaxiService, SummeryService, CommentService,ContactService,
        { provide: SignalrWindow, useValue: window },
        { provide: 'channel.config', useValue: channelConfig },
        { provide: 'messaging.config', useValue: messagingConfig }
    ]
})
export class AppModule { }
