/// <reference path="./globals.d.ts" />
///<reference path="./jquery.d.ts" />
///<reference path="./Application.d.ts" />
import { Title }     from '@angular/platform-browser'
//import { Injectable, Inject, Directive, EventEmitter, Input, Output} from '@angular/core';
import { FormControl, NgControl, FormBuilder, FormGroup, Validators, Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';
import { Input, Output, Inject, EventEmitter, Directive, forwardRef, Attribute, ViewEncapsulation, Component, AfterViewInit, OnInit, Renderer, ElementRef, OnDestroy, ChangeDetectorRef, Injectable, Pipe, PipeTransform} from '@angular/core';


//http://stackoverflow.com/questions/34546447/bind-an-input-with-type-datetime-local-to-a-date-property-in-angular-2
//http://plnkr.co/edit/BK6q5dTenMwxSRq3f8JX?p=preview
@Directive({
    selector: 'input[type=datetime-local]',
    //events: ['dateChange'],
    host: {
        '[value]': '_date',
        '(change)': 'onDateChange($event.target.value)'
        //'(blur)': 'onDateBlur($event.target.value)'
    }
})
export class MyDate {
    private _date: string;
    @Input() set date(d: Date) {
        this._date = this.toDateString(d);
        console.log(this._date);

    }
    @Output() dateChange: EventEmitter<Date>;

    constructor(public formControl: NgControl) {
        this.date = new Date();
        this.dateChange = new EventEmitter();
    }

    private toDateString(date: Date): string {
        let dateTmp = new Date();
        if (date == null)
            return null;

        else if (date instanceof Date) {
            dateTmp = date;
        }

        else {
            let dd = <any>date;
            dateTmp = new Date(dd);
        }
        return (dateTmp.getFullYear().toString() + '-' + ("0" + (dateTmp.getMonth() + 1)).slice(-2) + '-' + ("0" + (dateTmp.getDate())).slice(-2))
            + 'T' + dateTmp.toTimeString().slice(0, 5);
    }

    private parseDateString(date: string): Date {
        if (date == null || date == "") return null;
        date = date.replace('T', '-');
        var parts = date.split('-');
        var time = "00:00";
        if (parts.length < 3) {
            date = new Date().toString();
        }
        if (parts.length > 3) {
            //  timeParts = parts[3].split(':');
            time = parts[3];
        }
        let timeParts = time.split(':');
        // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
        return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]), parseInt(timeParts[0]), parseInt(timeParts[1])); // Note: months are 0-based

    }

    private onDateChange(value: string): void {
        if (value != this._date) {
            var parsedDate = this.parseDateString(value);
            if (parsedDate == null) {
                //   return;
                this.dateChange.emit(null);
                return;
            }
            // check if date is valid first
            if (parsedDate.getTime() != NaN) {
                this._date = value;
                this.dateChange.emit(parsedDate);
            }
        }
    }


}

//http://stackoverflow.com/questions/33866824/angular2-control-validation-on-blur
@Directive({
    selector: '[validate-onblur]',
    //events: ['dateChange'],
    host: {
        '(focus)': 'onFocus($event.target.value)',
        '(blur)': 'onBlur($event.target.value)'
    }
})
export class MyDateReq {

    constructor(public formControl: NgControl) {
    }

    onFocus(value) {
        if (value != null && value != "") {
            let fieldControl = this.formControl;
            if (fieldControl.errors != null) {
                delete fieldControl.errors['customDateRequired'];
            }
            if (fieldControl.errors != null && !Object.keys(fieldControl.errors).length) {
                fieldControl.control.setErrors(null);
            }

        }
        else {
            this.formControl.control.setErrors({ customDateRequired: true });
        }
        this.formControl.control.markAsTouched(true);
        //this.formControl.control.markAsUntouched(false);
    }

    private onBlur(value: string): void {
        if (value != null && value != "") {
            let fieldControl = this.formControl;
            if (fieldControl.errors != null) {
                delete fieldControl.errors['customDateRequired'];
            }
            if (fieldControl.errors != null && !Object.keys(fieldControl.errors).length) {
                fieldControl.control.setErrors(null);
            }

        }
        else {
            this.formControl.control.setErrors({ customDateRequired: true });
        }
        this.formControl.control.markAsTouched(true);
    }
}


//https://scotch.io/tutorials/how-to-implement-a-custom-validator-directive-confirm-password-in-angular-2
@Directive({
    selector: '[validateEqual][formControlName],[validateEqual][formControl],[validateEqual][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => EqualValidator), multi: true }
    ]
})
export class EqualValidator implements Validator {
    constructor(
        @Attribute('validateEqual') public validateEqual: string,
        @Attribute('reverse') public reverse: string
    ) { }

    private get isReverse() {
        if (!this.reverse) return false;
        return this.reverse === 'true' ? true : false;
    }

    validate(sourceControl: AbstractControl): { [key: string]: any } {
        // self value 
        if (sourceControl === null)
            return null;
        let val = sourceControl.value;
        if (val === null || val == "")
            return null;
        var currentCompare = new Date(val);
        // control vlaue
        let target = sourceControl.root.get(this.validateEqual);
        if (target === null || target.value === null || target.value == "")
            return null;

        var targetCompare = new Date(target.value);
        // value not equal
        // if (e && val !== e.value && !this.isReverse) {
        if (currentCompare < targetCompare && !this.isReverse) {
            return {
                greaterEqual: true
            }
        }

        // value equal and reverse
        // if (e && val === e.value && this.isReverse) {
        if (currentCompare < targetCompare && this.isReverse) {
            if (target.errors != null) {
                delete target.errors['greaterEqual'];
            }
            if (target.errors != null && !Object.keys(target.errors).length) {
                target.setErrors(null);
            }
        }

        // value not equal and reverse
        // if (e && val !== e.value && this.isReverse) {
        if (currentCompare > targetCompare && this.isReverse) {
            target.setErrors({ greaterEqual: true });
        }
        return null;
    }
}


@Directive({
    selector: '[validate-olderDate]',
    //selector: '[validate-olderDate][formControlName]',
    //events: ['dateChange'],
    host: {
        '(focus)': 'onFocus($event.target.value)',
        '(blur)': 'onBlur($event.target.value)'
    }
    //,
    // providers: [
    //    { provide: NG_VALIDATORS, useExisting: forwardRef(() => MyDateOlderDate), multi: true }
    //]
})
export class MyDateOlderDate {//implements Validator {

    constructor(public formControl: NgControl) {
    }

    validate(sourceControl: AbstractControl): { [key: string]: any } {
        // self value 
        debugger;
        if (sourceControl === null)
            return null;
        let val = sourceControl.value;
        if (val === null || val == "")
            return null;
     
        let d = this.parseDateString(val);
        if (d != null) {
            var someDate = new Date();
            if (d >= someDate) {
                //is valid
                let fieldControl = this.formControl;

                if (fieldControl.errors != null) {
                    delete fieldControl.errors['olderDate'];
                }
                if (fieldControl.errors != null && !Object.keys(fieldControl.errors).length) {
                    fieldControl.control.setErrors(null);
                }
            }
            else {
                this.formControl.control.setErrors({ olderDate: true });
            }

        }
        else {
            this.formControl.control.setErrors({ olderDate: true });
        }

        return null;
    }

    onFocus(value) {
        //debugger;
        let d = this.parseDateString(value);

        if (d != null) {
            var someDate = new Date();
            //let d = new Date(value);
            //let min = d.getMinutes() + d.getTimezoneOffset();
            //d.setMinutes(min);

            if (d >= someDate) {
                //is valid
                let fieldControl = this.formControl;

                if (fieldControl.errors != null) {
                    delete fieldControl.errors['olderDate'];
                }
                if (fieldControl.errors != null && !Object.keys(fieldControl.errors).length) {
                    fieldControl.control.setErrors(null);
                }
            }
            else {
                this.formControl.control.setErrors({ olderDate: true });
            }

        }
        else {
            this.formControl.control.setErrors({ olderDate: true });
        }
        this.formControl.control.markAsTouched(true);
        //  this.formControl.control.markAsUntouched(false);
    }

    private onBlur(value: string): void {
       // debugger;
        let d = this.parseDateString(value);
        if (d != null) {
            var someDate = new Date();
            if (d >= someDate) {
                //let min = d.getMinutes() + d.getTimezoneOffset();
                //d.setMinutes(min);
                let fieldControl = this.formControl;
                if (fieldControl.errors != null)
                    delete fieldControl.errors['olderDate'];

                if (fieldControl.errors != null && !Object.keys(fieldControl.errors).length)
                    fieldControl.control.setErrors(null);
            }
            else this.formControl.control.setErrors({ olderDate: true });
        }
        else {
            this.formControl.control.setErrors({ olderDate: true });
        }
        this.formControl.control.markAsTouched(true);
    }


    private parseDateString(date: string): Date {
        if (date == null || date == "") return null;
        date = date.replace('T', '-');
        var parts = date.split('-');
        var time = "00:00";
        if (parts.length < 3) {
            date = new Date().toString();
        }
        if (parts.length > 3) {
            //  timeParts = parts[3].split(':');
            time = parts[3];
        }
        let timeParts = time.split(':');
        // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
        return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]), parseInt(timeParts[0]), parseInt(timeParts[1])); // Note: months are 0-based

    }
}


