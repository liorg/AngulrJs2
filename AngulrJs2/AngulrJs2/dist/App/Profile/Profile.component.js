System.register(['@angular/core', './XProfile.service'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, XProfile_service_1;
    var ProfileComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (XProfile_service_1_1) {
                XProfile_service_1 = XProfile_service_1_1;
            }],
        execute: function() {
            ProfileComponent = (function () {
                function ProfileComponent(_profileService) {
                    this._profileService = _profileService;
                    this.userTitle = '...';
                    this.errorMessage = "please wait...";
                    this.loginDateDay = "?";
                    this.loginDateHour = "?";
                    this.loginDateMonth = "?";
                    this.loginDateNum = "?";
                    this.loginDateYear = "?";
                }
                ProfileComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    debugger;
                    this._profileService.getProfile()
                        .subscribe(function (profile) {
                        debugger;
                        _this.profileModel = profile;
                        _this.userTitle = _this.profileModel.model.name;
                    }, function (error) {
                        debugger;
                        _this.errorMessage = error;
                    });
                };
                ProfileComponent = __decorate([
                    core_1.Component({
                        moduleId: "app/Profile/",
                        selector: 'pm-app',
                        templateUrl: 'Profile.component.html'
                    }), 
                    __metadata('design:paramtypes', [XProfile_service_1.XProfileService])
                ], ProfileComponent);
                return ProfileComponent;
            }());
            exports_1("ProfileComponent", ProfileComponent);
        }
    }
});

//# sourceMappingURL=Profile.component.js.map
