"use strict";
/// <reference path="../common/index.d.ts" />
//import { WebApi } from  "../common/xrm-webapi";
//import Xrmwebapi = require("../Common/xrm-webapi");
var Logger_1 = require("./Logger");
var Malam;
(function (Malam) {
    var Weizman;
    (function (Weizman) {
        var Account = (function () {
            function Account() {
            }
            Account.onLoad = function () {
                debugger;
                Logger_1.Logger.writeLog("hi");
                //alert('=1=');
                //Xrmwebapi.WebApi.retrieve("accounts", Xrm.Page.data.entity.getId().replace("{", "").replace("}", ""), "$select=name")
                //    .then(
                //    (account) => {
                //        alert('=2=');
                //        console.log(account["name"]);
                //    },
                //    (error) => {
                //        alert('=3=');
                //        console.log(error);
                //    }
                //    );
            };
            return Account;
        }());
        Weizman.Account = Account;
    })(Weizman = Malam.Weizman || (Malam.Weizman = {}));
})(Malam || (Malam = {}));
debugger;
Malam.Weizman.Account.onLoad();
