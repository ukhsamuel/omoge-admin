/// <reference types="@types/googlemaps" />

import { ElementRef, NgZone, Component, OnInit, ViewChild } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import 'rxjs/Rx';

import { AuthenticationService } from '../../_services';
import {RestService} from "../../_services/rest.service";
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';

import { MapsAPILoader } from '@agm/core';


@Component({
  selector: 'app-request-delivery',
  templateUrl: './request-delivery.component.html',
  styleUrls: ['./request-delivery.component.css']
})
export class RequestDeliveryComponent implements OnInit {
	dataForm: FormGroup;
	dataForm2: FormGroup;
	loading = false;
	loadingBatches = false;
	submitted = false;
	submitted2 = false;
	error = '';
	processing = false;
	inputData = {
		agent_id: "",
		requested_to: "",
		delivery_address: "",
		delivery_phone_no: "",
		type: "1"
	};
	inputData2 = {
		product_id: "",
		batch_id: "",
		quantity: "",
		product_name: "",
		batch_code: "",
		per_box: "",
		boxes: [],
	};
	products: any;
	middlemen: any;
	productsBatches: any;

	public latitude: number;
	public longitude: number;
	public delivery_address: FormControl;
	public zoom: number;

	@ViewChild("search")
	public searchElementRef: ElementRef;


  // End the Closeable Alert
  // This is for the self closing alert
  private _message = new Subject<string>();

  staticAlertClosed = false;
  responseMessage: string;
  messageType:any;
  agents: any;
  selectedProducts = [];

	// pattern for email validatiom
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

  constructor(
        private rest: RestService,
        private formBuilder: FormBuilder,
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone,
        private authenticationService: AuthenticationService) { 
	    // set up Alert
	    setTimeout(() => (this.staticAlertClosed = true), 20000);

	    this._message.subscribe(message => (this.responseMessage = message));
	    this._message.pipe(debounceTime(5000)).subscribe(() => (this.responseMessage = null));
	}

  ngOnInit() {
      this.initMap();
      this.getAgents();
      this.getProducts();
  	  this.getMiddlemen();
      // Initialize form with Validation rules
        this.dataForm = this.formBuilder.group({
            agent_id: ['', Validators.required],
            delivery_address: ['', Validators.required],
            delivery_phone_no: [''],
        });
      // Initialize form with Validation rules
        this.dataForm2 = this.formBuilder.group({
            product_id: ['', Validators.required],
            batch_id: ['', Validators.required],
            quantity: ['', Validators.required],
            per_box: ['', Validators.required],
        });
  }

	initMap() {
		//create search FormControl
		this.delivery_address = new FormControl();

		//load Places Autocomplete
		this.mapsAPILoader.load().then(() => {
		  let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
		    types: ["address"]
		  });
		  autocomplete.addListener("place_changed", () => {
		    this.ngZone.run(() => {
		      //get the place result
		      let place: google.maps.places.PlaceResult = autocomplete.getPlace();

		      //verify result
		      if (place.geometry === undefined || place.geometry === null) {
		        return;
		      }

		      //set latitude, longitude and zoom
		      this.latitude = place.geometry.location.lat();
		      this.longitude = place.geometry.location.lng();
		      this.zoom = 14;
		    });
		  });
		});
	}


    // convenience getter for easy access to form fields
    get f() { return this.dataForm.controls; }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.dataForm.invalid)
          return;

        if(this.selectedProducts.length < 1)
          return;

        console.log(this.inputData);
        let d = {detail : this.inputData, products: this.selectedProducts};
        this.processing = true;
        this.rest.requestDelivery(d)
            .map(res => res.json())
            .subscribe(
                data => {
                    console.log(data);
                     // send alert
                    this._message.next(`${data.message}`);

                    this.submitted = false;
                    this.processing = false;
                      if(data.status == "00"){
                        this.messageType = 'success';
                        this._message.next(`${data.message}`);
                        this.latitude = undefined;
                        this.longitude = undefined;
                        this.selectedProducts = [];
  	                    this.inputData ={
                      									agent_id: "",
                      									requested_to: "",
                      									delivery_address: "",
                      									delivery_phone_no: "",
                      									type: "1"
                    									};
                      }else{
                        data.message = this.rest.processErrorMessages(data.message);
                        this.messageType = 'danger';
                        this._message.next(`${data.message}`);
                      }
                },
                error => {
                	console.log(error);
                    this.error = error;
                    this.loading = false;
                    this.processing = false;
                });
    }

    onSubmit2() {
        this.submitted2 = true;
        // stop here if form is invalid
        if (this.dataForm2.invalid) {
            return;
        }

        console.log(this.selectedProducts);
        this.inputData2.batch_code = this.filterBatches(this.inputData2.batch_id).batch_code;
        this.inputData2.product_name = this.filterProducts(this.inputData2.product_id).name;
        this.inputData2.boxes = this.generateBoxes();
        console.log(this.inputData2)
        this.selectedProducts.push(this.inputData2);
        this.submitted2 = false;
    		this.inputData2 = {
    			product_id: "",
    			batch_id: "",
    			quantity: "",
    			product_name: "",
    			per_box: "",
    			batch_code: "",
          boxes: []
    		};
    }
    returnNumberOfBoxes(x,y){
      x = parseInt(x)
      y = parseInt(y)
      
     return Math.floor(x/y);
    }
    returnNumberOfBoxesRemainders(x,y){
      x = parseInt(x)
      y = parseInt(y)
      
     return x % y;
    }

    generateBoxes(){
      let boxes_num = this.returnNumberOfBoxes(this.inputData2.quantity,this.inputData2.per_box);
      let boxes_rem = this.returnNumberOfBoxesRemainders(this.inputData2.quantity,this.inputData2.per_box);
      var boxes = [];

      for (var i = 1; i <= boxes_num; i++) {
        var b = {'quantity': this.inputData2.per_box};
        boxes.push(b);
      }

      var d = {'quantity': boxes_rem};
      if(boxes_rem > 0)
        boxes.push(d);

      return boxes;
    }

    removeSelected(i) {
      this.selectedProducts.splice(i,1);
    }

    filterProducts(val) {

      // filter our data
      const temp = this.products.filter(function(d) {
        return d.id == val || !val;
      });

      return temp['0'];
    } 


    filterBatches(val) {

      // filter our data
      const temp = this.productsBatches.filter(function(d) {
        return d.id == val || !val;
      });

      return temp['0'];
    } 


    getProducts(){
      this.rest.getProducts().subscribe(response => {
          this.products = response.json().data;
          console.log(this.products)
      },
        error => {  

        });
    }

    getAgents(){
      this.rest.getAgents().subscribe(response => {
          this.agents = response.json().data;
          console.log(this.agents)
      },
        error => {  
        });
    }

    loadProductBatches(){

    	// console.log(this.inputData.product_id)
    	let data = {product_id: this.inputData2.product_id}
    	if(this.inputData2.product_id){
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
    get g() { return this.dataForm2.controls; }

}
