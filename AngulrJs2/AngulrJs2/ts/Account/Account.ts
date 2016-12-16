/// <reference path="../common/index.d.ts" />
//import { WebApi } from  "../common/xrm-webapi";
//import Xrmwebapi = require("../Common/xrm-webapi");
import {Logger} from "./Logger";
namespace Malam.Weizman {
    export  class Account {
        static onLoad(): void {
        
            Logger.writeLog("hi");
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
        }
    }

}

Malam.Weizman.Account.onLoad();

