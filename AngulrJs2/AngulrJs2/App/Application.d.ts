interface ApplicationUI {
    bindRealTimeClock(): void;
    bindDateSelector(): void;
    bindOnBlurIvent(): void;
    // bindCheckPassengerButton(): void;
    // bindNewReservationButton(): void;
    bindViewPassengerDetails(): void;
    //bindHamburgerButton(): void;
    bindScrollFunctions(): void;
    //extend
    bindLoadUI(): void;
    showButton(button: any): void;
    hideButton(button: any, speed: number): void;
    new_reservation: any;
    details_reservation: any;
    add_reservation: any;
    defaultSpeed: number;
    //part 3
    bindFormWizardFlightOptions(): void;
    bindFormWizardPreference(): void;
    bindFormWizardAccomodation(): void;
    startSecondAnimation(): void;
    startFirstAnimation(): void;
    ParseDateTime(str:string):string
    initCalendarsPicker(): void;

}

declare var Application: ApplicationUI;