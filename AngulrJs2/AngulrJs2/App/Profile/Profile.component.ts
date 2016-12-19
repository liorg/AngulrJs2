import { Component, OnInit } from '@angular/core';
import { XProfileService } from './XProfile.service';
import { Result } from './Result.Model';
import { ProfileDetail } from './ProfileDetail.Model';

@Component({
    moduleId: "app/Profile/" ,   // fully resolved filename; defined at module load time
    selector: 'pm-app',
    templateUrl: 'Profile.component.html'
   
})
export class ProfileComponent implements OnInit  {
   
    userTitle: string = '...';
    errorMessage: string = "please wait...";
    loginDateDay: string = "?";
    loginDateHour: string = "?";
    loginDateMonth: string = "?";
    loginDateNum: string = "?";
    loginDateYear: string = "?";
    profileModel: Result<ProfileDetail>;
    
    constructor(private _profileService: XProfileService) {
    }

    ngOnInit(): void {
        debugger;
        this._profileService.getProfile()
            .subscribe(profile => {
                debugger;
                this.profileModel = profile;
                this.userTitle = this.profileModel.model.name;
              
            },
            error => {
                debugger;
                this.errorMessage = <any>error;
            });
    }
}
