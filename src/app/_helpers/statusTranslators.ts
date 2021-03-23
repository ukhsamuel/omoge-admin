import { Injectable } from '@angular/core';


export class StatusTranslators {


    deliveryStatus(value: string) {
        let status = "";
        switch (value) {
            case "0":
                status = "unverified";
                break;
            
            case "1":
                status = "verified";
                break;
            
            
            case "2":
                status = "enroute";
                break;
            
            
            case "3":
                status = "delivered";
                break;
            
            default:
                status = "invalid status";
                break;
        }
        return status;
    }

    verificationStatus(value) {
        // JSON.stringify(value);

        let status = "";

        if(value == "0"){
            status = "UNVERIFIED";
        }else if(value == "1"){
            status = "VERIFIED";
        }else{
            status = "UNVERIFIED";
        }

        return status;
    }
    activationStatus(value) {
        let status = "";

        if(value == "0"){
            status = "UNACTIVATED";
        }else if(value == "1"){
            status = "ACTIVATED";
        }else{
            status = "UNACTIVATED";
        }

        return status;
    }
}
