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
