import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import 'rxjs/Rx';

import { AuthenticationService } from '../../_services';
import {RestService} from "../../_services/rest.service";
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import {NgbDatepickerConfig, NgbCalendar, NgbDate, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-addproductbatch',
  templateUrl: './addproductbatch.component.html',
  styleUrls: ['./addproductbatch.component.css']
})
export class AddproductbatchComponent implements OnInit {

	dataForm: FormGroup;
	loading = false;
	submitted = false;
	error = '';
	processing = false;
	inputData = {
		expiry_date: "",
		manufacture_date: "",
		note: "",
		product_id: "",
		quantity: "",
	};
	products: any;

  // End the Closeable Alert
  // This is for the self closing alert
  private _message = new Subject<string>();

  staticAlertClosed = false;
  responseMessage: string;
  messageType:any;
  
  constructor(
        private _loadingBar: SlimLoadingBarService, 
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
  }

    ngOnInit() {
      // Initialize form with Validation rules
        this.dataForm = this.formBuilder.group({
            expiry_date: ['', Validators.required],
            manufacture_date: ['', Validators.required],
            note: [''],
            product_id: ['', Validators.required],
            quantity: ['', Validators.required],
        });
	  	this.getProducts();

    }

	getProducts(){
		this._loadingBar.start();
		this.rest.getProducts().subscribe(response => {
		    this._loadingBar.complete();
		    this.products = response.json().data;
		    console.log(this.products)
		},
		  error => {  
		    this._loadingBar.complete();
		  });
	}

    // convenience getter for easy access to form fields
    get f() { return this.dataForm.controls; }

    onSubmit() {
    	console.log(this.parseDate('8/4/2019'));
    	// console.log(this.inputData.manufacture_date);
        this.submitted = true;
        // stop here if form is invalid
        if (this.dataForm.invalid) {
            return;
        }

        // format date before sending
        this.inputData.manufacture_date = this.format(this.inputData.manufacture_date);
        this.inputData.expiry_date = this.format(this.inputData.expiry_date);

        this.processing = true;
        this.rest.addProductBatch(this.inputData)
            .map(res => res.json())
            .subscribe(
                data => {
                    console.log(data);
                     // send alert
                    this._message.next(`${data.message}`);

                    this.submitted = false;
                    this.processing = false;
                    this.inputData = {
        							expiry_date: "",
        							manufacture_date: "",
        							note: "",
        							product_id: "",
        							quantity: "",
        						};
                },
                error => {
			        // this.inputData.manufacture_date = this.parseDate(this.inputData.manufacture_date);
			        // this.inputData.expiry_date = this.parseDate(this.inputData.expiry_date);
                	
                	console.log(error);
                    this.error = error;
                    this.loading = false;
                    this.processing = false;
                });
    }

    parseDate(value: string): NgbDateStruct {
	    if (value) {
	      const dateParts = value.trim().split('/');
	      if (dateParts.length === 1 && this.isNumber(dateParts[0])) {
	        return {day: this.toInteger(dateParts[0]), month: null, year: null};
	      } else if (dateParts.length === 2 && this.isNumber(dateParts[0]) && this.isNumber(dateParts[1])) {
	        return {day: this.toInteger(dateParts[0]), month: this.toInteger(dateParts[1]), year: null};
	      } else if (dateParts.length === 3 && this.isNumber(dateParts[0]) && this.isNumber(dateParts[1]) && this.isNumber(dateParts[2])) {
	        return {day: this.toInteger(dateParts[0]), month: this.toInteger(dateParts[1]), year: this.toInteger(dateParts[2])};
	      }
	    }
	    return null;
	  }

	/*
		functions for date parsing

	*/

	isNumber(value: any): value is number {
	  return !isNaN(this.toInteger(value));
	}

	isInteger(value: any): value is number {
	  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
	}

	toInteger(value: any): number {
	  return parseInt(`${value}`, 10);
	}

	// format date from bootstrap date plugin
	format(str): string {
		return `${str.day}/${str.month}/${str.year}`;
	}

}
