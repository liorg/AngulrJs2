import { Component } from '@angular/core';
declare var __moduleName: string;
@Component({
    templateUrl: 'welcome.component.html',
    moduleId: "app/home/"   // fully resolved filename; defined at module load time
})
export class WelcomeComponent {
    public pageTitle: string = 'Welcome!!!';
}
