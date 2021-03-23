import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';



@Injectable({
    providedIn: 'root'
  })
  export class UtilsService {

    constructor(
		private toastService: ToastrService,
    ) { }


    showToast(type,msg) {
	// this.toastService.show('I am a standard toast');

        console.log(type)
        if(type == 'success'){
            this.toastService.success(msg);
        }else if(type == 'danger'){
            this.toastService.error(msg);
        }else if(type == 'warning'){
            this.toastService.warning(msg);
        }else if(type == 'info'){
            this.toastService.info(msg);
        }
	}
      
   
	processErrorMessages(str) {
        // console.log(str[0])
	    var s = "";

		if(str && str.constructor === Object || str.constructor === Array){
			for (var i in str) {
			   s += str[i].msg + ", ";
			}
		}else{
			s = str;
        }
        
        s = s.replace(/,\s*$/, "");

	    return s;
	}
  }