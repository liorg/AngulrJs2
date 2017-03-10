///<reference path="./jquery.d.ts" />

import {Injectable, Inject} from "@angular/core";
import { Subject } from "rxjs/Subject";
import { Title }     from '@angular/platform-browser'
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
/**
 * When SignalR runs it will add functions to the global $ variable 
 * that you use to create connections to the hub. However, in this
 * class we won't want to depend on any global variables, so this
 * class provides an abstraction away from using $ directly in here.
 */
export class SignalrWindow extends Window {
    $: any;
}

export enum ConnectionState {
    Connecting = 1,
    Connected = 2,
    Reconnecting = 3,
    Disconnected = 4
}

export class ChannelConfig {
    url: string;
    hubName: string;
    channel: string;
}

export class passangerLocked {
    passangerid: string;
    isLocked: boolean;
    orderid: string;
    allowAdd: boolean;
    allowEdit: boolean;
    expireOrder?: Date;
}

export class userHandle {
    userid: string;
    name: string;
    flightid: string;
    uniqueTranId: string;
    passangers: passangerLocked[];
}

export class SessionStatus {
    state: number;
    trackid: string;
    timestamp: Date;
    users: userHandle[];

}

class ChannelSubject {
    channel: string;
    subject: Subject<SessionStatus>;
}

/**
 * ChannelService is a wrapper around the functionality that SignalR
 * provides to expose the ideas of channels and events. With this service
 * you can subscribe to specific channels (or groups in signalr speak) and
 * use observables to react to specific events sent out on those channels.
 */
@Injectable()
export class ChannelService {

    /**
     * starting$ is an observable available to know if the signalr 
     * connection is ready or not. On a successful connection this
     * stream will emit a value.
     */
    starting$: Observable<any>;

    /**
     * connectionState$ provides the current state of the underlying
     * connection as an observable stream.
     */
    connectionState$: Observable<ConnectionState>;

    /**
     * error$ provides a stream of any error messages that occur on the 
     * SignalR connection
     */
    error$: Observable<string>;

    // These are used to feed the public observables 
    //
    private connectionStateSubject = new Subject<ConnectionState>();
    private startingSubject = new Subject<any>();
    private errorSubject = new Subject<any>();
    titleName: string;
    // These are used to track the internal SignalR state 
    //
    private hubConnection: any;
    private hubProxy: any;

    // An internal array to track what channel subscriptions exist 
    //
    //private subjects = new Array<ChannelSubject>();

    private subjectSessionStatus = new Subject<SessionStatus>();
    $subjectSessionStatus :Observable<SessionStatus>;

    constructor(
        private _titleService: Title,
        @Inject(SignalrWindow) private window: SignalrWindow,
        @Inject("channel.config") private channelConfig: ChannelConfig
    )
    {
        if (this.window.$ === undefined || this.window.$.hubConnection === undefined) {
            throw new Error("The variable '$' or the .hubConnection() function are not defined...please check the SignalR scripts have been loaded properly");
        }
        this.$subjectSessionStatus = this.subjectSessionStatus.asObservable();
        // Set up our observables
        this.titleName = _titleService.getTitle();
        this.connectionState$ = this.connectionStateSubject.asObservable();
        this.error$ = this.errorSubject.asObservable();
        this.starting$ = this.startingSubject.asObservable();

        this.hubConnection = this.window.$.hubConnection();
        this.hubConnection.url = channelConfig.url;
        this.hubProxy = this.hubConnection.createHubProxy(channelConfig.hubName);

        // Define handlers for the connection state events
        //
        this.hubConnection.stateChanged((state: any) => {
            let newState = ConnectionState.Connecting;
            switch (state.newState) {
                case this.window.$.signalR.connectionState.connecting:
                    newState = ConnectionState.Connecting;
                    break;
                case this.window.$.signalR.connectionState.connected:
                    newState = ConnectionState.Connected;
                    break;
                case this.window.$.signalR.connectionState.reconnecting:
                    newState = ConnectionState.Reconnecting;
                    break;
                case this.window.$.signalR.connectionState.disconnected:
                    newState = ConnectionState.Disconnected;
                    break;
            }
            let connectionName = ConnectionState[newState];
           // this._titleService.setTitle(connectionName + " " + this.titleName);
            // Push the new state on our subject
            this.connectionStateSubject.next(newState);
        });

        // Define handlers for any errors
        //
        this.hubConnection.error((error: any) => {
            // Push the error on our subject
            //
            this.errorSubject.next(error);
        });

        this.hubProxy.on("getNotify", (channel: string, ev: SessionStatus) => {
            //console.log(`onEvent - ${channel} channel`, ev);
            debugger;
            // This method acts like a broker for incoming messages. We 
            //  check the interal array of subjects to see if one exists
            //  for the channel this came in on, and then emit the event
            //  on it. Otherwise we ignore the message.
            this.subjectSessionStatus.next(ev);
        });

    }

    /**
     * Start the SignalR connection. The starting$ stream will emit an 
     * event if the connection is established, otherwise it will emit an
     * error.
     */
    start(): void {
        // Now we only want the connection started once, so we have a special
        //  starting$ observable that clients can subscribe to know know if
        //  if the startup sequence is done.
        //
        // If we just mapped the start() promise to an observable, then any time
        //  a client subscried to it the start sequence would be triggered
        //  again since it's a cold observable.
        //
        this.hubConnection.start()
            .done(() => {
                this.startingSubject.next();
            })
            .fail((error: any) => {
                this.startingSubject.error(error);
            });
    }
   
    publish(ev: SessionStatus): void {
        this.hubProxy.invoke("Publish", ev);
    }

    ping(): void {
        //debugger;
        this.hubProxy.invoke("Ping").done(() => {
          //  debugger;
            console.log(`Successfully subscribed to  channel`);
        })
            .fail((error: any) => {
             //   debugger;
            });
    }
 

}