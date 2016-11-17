(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./Logger":2}],2:[function(require,module,exports){
"use strict";
var Stam_1 = require("./Stam");
var Logger = (function () {
    function Logger() {
    }
    Logger.writeLog = function (text) {
        console.log(text);
        Stam_1.Stam.Run(text);
        alert(text);
    };
    return Logger;
}());
exports.Logger = Logger;

},{"./Stam":3}],3:[function(require,module,exports){
"use strict";
var Stam = (function () {
    function Stam() {
    }
    Stam.Run = function (text) {
        console.log(text);
        alert(text);
    };
    return Stam;
}());
exports.Stam = Stam;

},{}]},{},[1]);
