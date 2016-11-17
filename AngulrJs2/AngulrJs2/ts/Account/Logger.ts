import {Stam} from "./Stam";

export class Logger {
        static writeLog(text: string): void {
            console.log(text);
       
            Stam.Run(text);
            alert(text);
        }
    }
