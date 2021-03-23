import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import 'rxjs/Rx';
import { map} from 'rxjs/operators';
import { AuthenticationService } from '../../_services';
import {RestService} from "../../_services/rest.service";
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-request-pickup',
  templateUrl: './request-pickup.component.html',
  styleUrls: ['./request-pickup.component.css']
})
export class RequestPickupComponent implements OnInit {
	dataForm: FormGroup;
	loading = false;
	loadingBatches = false;
	submitted = false;
	error = '';
	processing = false;
	inputData = {
		product_id: "",
		batch_id: "",
		requested_to: "",
		quantity: "",
		type: "1"
	};
	products: any;
	middlemen: any;
	productsBatches: any;

  // End the Closeable Alert
  // This is for the self closing alert
  private _message = new Subject<string>();

  staticAlertClosed = false;
  responseMessage: string;
  messageType:any;

	// pattern for email validatiom
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  manufacturers: any;

  constructor(
  		private rest: RestService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService
      ) 
      { 
        // set up Alert
        setTimeout(() => (this.staticAlertClosed = true), 20000);

        this._message.subscribe(message => (this.responseMessage = message));
        this._message.pipe(debounceTime(5000)).subscribe(() => (this.responseMessage = null));
        console.log(this.authenticationService.currentUserValue)
        if(this.authenticationService.currentUserValue.user.role == 'middleman'){
          this.inputData.type = '2';
          this.getMiddlemanAssignment();
        }else{
          this.inputData.type = '1';
          this.getMiddlemen();
        }
      }


    ngOnInit() {
      this.getProducts();
      // Initialize form with Validation rules
        this.dataForm = this.formBuilder.group({
            product_id: ['', Validators.required],
            batch_id: ['', Validators.required],
            quantity: ['', Validators.required],
            requested_to: ['', Validators.required]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.dataForm.controls; }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.dataForm.invalid) {
            return;
        }

        console.log(this.inputData);

        this.processing = true;
        // this.rest.requestPickup(this.inputData)
        //     .map(res => res.json())
        //     .subscribe(
        //         data => {
        //             console.log(data);
        //             this._message.next(`${data.message}`);

        //             this.submitted = false;
        //             this.processing = false;
        //               if(data.status == "00"){
        //                 this.messageType = 'success';
        //                 this._message.next(`${data.message}`);
	      //               this.inputData ={
				// 						product_id: "",
				// 						batch_id: "",
				// 						requested_to: "",
				// 						quantity: "",
				// 						type: "1"
				// 					};
        //               }else{
        //                 data.message = this.rest.processErrorMessages(data.message);
        //                 this.messageType = 'danger';
        //                 this._message.next(`${data.message}`);
        //               }
        //         },
        //         error => {
        //         	console.log(error);
        //             this.error = error;
        //             this.loading = false;
        //             this.processing = false;
        //         });
    }

    getProducts(){
      this.rest.getProducts().subscribe(response => {
          this.products = response.json().data;
          console.log(this.products)
      },
        error => {  

        });
    }

    getManufacturerProducts(id){
      this.rest.getmManufacturerProducts(id).subscribe(response => {
          this.products = response.json().data;
          console.log(this.products)
      },
        error => {  

        });
    }

    loadProductBatches(){

    	// console.log(this.inputData.product_id)
    	let data = {product_id: this.inputData.product_id}
    	if(this.inputData.product_id){
        this.loadingBatches = true;
        this.rest.getProductBatches(data).subscribe(response => {
            this.loadingBatches = false;
            this.productsBatches = response.json().data;
        },
          error => {  
            this.loadingBatches = false;

          });
    }
    }

    getMiddlemen(){
      this.rest.getMiddlemen().subscribe(response => {
          this.middlemen = response.json().data;
          console.log(this.middlemen)
      },
        error => {  

        });
    }

    getMiddlemanAssignment(){
      this.rest.getMiddlemanAssignment().subscribe(response => {
          this.manufacturers = response.json().data;
          console.log(this.manufacturers)
      },
        error => {  

        });
    }


}
