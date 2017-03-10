import { Inject,Component, Input, Output, Renderer, ElementRef, EventEmitter, AfterViewInit, OnChanges, OnInit, OnDestroy, trigger,
    state, animate, transition, style, ViewContainerRef, ComponentFactoryResolver, ComponentRef,
    Directive } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { BrowserModule, Title  }  from '@angular/platform-browser';
//https://plnkr.co/edit/GmOUPtXYpzaY81qJjbHp?p=preview
//https://www.lucidchart.com/techblog/2016/07/19/building-angular-2-components-on-the-fly-a-dialog-box-example/

@Directive({
    selector: '[dialogAnchor]'
})

export class DialogAnchorDirective {

    continueChange = new EventEmitter<any>();

    constructor(
        private elementRef: ElementRef, private renderer: Renderer,
        @Inject(DOCUMENT) private document,
        private viewContainer: ViewContainerRef,
        private componentFactoryResolver: ComponentFactoryResolver
    ) {
    }

    createDialog(cc: EventEmitter<any>, errMsg: string, msgType: string, errTitle: string, isWarning: boolean,
        dialogComponent: { new (): DialogComponent }): ComponentRef<DialogComponent> {
        debugger;
        let body = this.document.getElementsByTagName('body')[0];
        if (!body.classList.contains('modal-shown')) {
            this.renderer.setElementClass(body, 'modal-shown', true);
        }
        else
            return;
        this.viewContainer.clear();
        let dialogComponentFactory = this.componentFactoryResolver.resolveComponentFactory(dialogComponent);
        let dialogComponentRef = this.viewContainer.createComponent(dialogComponentFactory);
        dialogComponentRef.instance.ErrorMessageIsVisible = true;
        dialogComponentRef.instance.IsWarning = isWarning;
        dialogComponentRef.instance.ErrorMsg = errMsg;
        dialogComponentRef.instance.ErrorTitle = errTitle;
        dialogComponentRef.instance.close.subscribe(() => {
            dialogComponentRef.instance.ErrorMessageIsVisible = false;
            this.renderer.setElementClass(body, 'modal-shown', false);
            dialogComponentRef.instance.ErrorMessageIsVisible = false;
            setTimeout(function () {
                dialogComponentRef.destroy();
            }, 300);
        });

        dialogComponentRef.instance.continue.subscribe(() => {
            let body = this.document.getElementsByTagName('body')[0];
            this.renderer.setElementClass(body, 'modal-shown', false);
            dialogComponentRef.instance.ErrorMessageIsVisible = false;
            setTimeout(function () {
                dialogComponentRef.destroy();
                debugger;
                cc.emit(msgType);

            }, 300);
        });
        return dialogComponentRef;
    }
}

@Component({
    moduleId: "App/",
    selector: 'app-error-message',
    templateUrl: 'DialogComponent.html',
    animations: [
        trigger('visibilityChanged', [
            state('shown', style({ opacity: 1 })),
            state('hidden', style({ opacity: 0 })),
            transition('* => *', animate('.300s'))
        ])
    ],
})
export class DialogComponent implements OnInit, OnDestroy {
    @Input()
    ErrorMsg: string;

    @Input()
    ErrorTitle: string;

    @Input()
    IsWarning: boolean;

    @Input()
    set ErrorMessageIsVisible(b: boolean) {
        if (b)
            this.visibility = 'shown';
        else
            this.visibility = 'hidden';

    }

    ngOnInit(): void {

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

    public visibility: string = 'hidden';

    constructor(private renderer: Renderer,
        private elRef: ElementRef
    ) {

    }

    close = new EventEmitter();

    onClickedExit() {
        this.close.emit('event');
    }

    continue = new EventEmitter();

    onContinueExit() {
        this.continue.emit('event');
    }
}
