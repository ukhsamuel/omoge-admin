import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import 'rxjs/Rx';

import { AuthenticationService } from '../../_services';
import {RestService} from "../../_services/rest.service";
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Papa } from 'ngx-papaparse';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.css']
})
export class AddproductComponent implements OnInit {

  dataForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  processing = false;
  uploadingCSV = false;
	inputData = {
		name: "",
		fda: "",
		price: "",
		notes: "",
		unit: "",
		unit_amount: "",
		sku: "",
		tags: "",
	};
	// inputData = {
	// 	name: "Sprite",
	// 	fda: "B1-2230",
	// 	price: "100",
	// 	notes: "Very Awesome",
	// 	weight: "300",
	// 	sku: "sp309",
	// 	tags: "",
	// };

  // End the Closeable Alert
  // This is for the self closing alert
  private _message = new Subject<string>();

  isCSV_Valid = false;
  staticAlertClosed = false;
  uploadSuccess = false;
  selectedCSVFileName = "";
  responseMessage: string;
  messageType:any;
  csvTableData:any;
  csvTableHeader:any;
  unitTypes = [{name:'KG', value:'kg'},{name:'Litres', value:'ltrs'},{name:'Grams', value:'g'}]

	
  constructor(
    		private rest: RestService,
        private papa: Papa,
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
    csvOn() {
      this.uploadingCSV = true;
    }

    csvOff() {
      this.uploadingCSV = false;
      this.uploadSuccess = false;
    }

    ngOnInit() {
      // Initialize form with Validation rules
        this.dataForm = this.formBuilder.group({
            name: ['', Validators.required],
            fda: [],
            price: ['', Validators.required],
            unit: ['', Validators.required],
            unit_amount: ['', Validators.required],
            notes: [],
            tags: [],
            sku: ['', Validators.required],
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
        this.rest.addProduct(this.inputData)
            .map(res => res.json())
            .subscribe(
                data => {
                    this.submitted = false;
                    this.processing = false;
                      if(data.status == "00"){
                        this.messageType = 'success';
                        this._message.next(`${data.message}`);
                         // send alert
                        this.inputData = {
                          name: "",
                          fda: "",
                          price: "",
                          notes: "",
                          unit: "",
                          unit_amount: "",
                          sku: "",
                          tags: "",
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

    submit_bulk() {
      let formatedProducts = [];


      // this.csvTableData.forEach(function(item) {
      //     if(item[0]){

      //       var condition = 
      //       ((item[0].length > 0) 
      //         && (item[1].length > 0) 
      //         && (item[2].length > 0) );
            
      //       if(!condition){
      //         console.log("lol");
      //         return;
      //       }
      //       let new_item = {name: item[0], fda: item[1], price: item[2], weight: item[3], sku: item[4], notes: item[5], tags: item[6] }
      //       formatedProducts.push(new_item);
      //     }
      //     // console.log(item);
      //     console.log(formatedProducts);
      //  })
      var t = 0;
      for(var item of this.csvTableData) {
          if(item){

            var condition = 
            ((item[0].length > 0) 
              && (item[1].length > 0) 
              && (item[2].length > 0) );
              console.log(condition);

            if(!condition){
              var error = "input on line " + (t+1) + " is invalid. Please review CSV and correct input.";
              this.messageType = 'danger';
              this._message.next(`${error}`);
              console.log(error);
              formatedProducts = [];
              break;
            }
            let new_item = {name: item[0], fda: item[1], price: item[2], weight: item[3], sku: item[4], notes: item[5], tags: item[6] }
            formatedProducts.push(new_item);
          }
          // console.log(item);
          console.log(formatedProducts);
          t++;
      }


        if(formatedProducts.length > 0){
          this.processing = true;
          this.rest.addBulkProducts(formatedProducts)
              .map(res => res.json())
              .subscribe(
                  data => {
                      this.submitted = false;
                      this.processing = false;
                        if(data.status == "00"){
                          this.messageType = 'success';
                          this._message.next(`${data.message}`);
                          this.uploadSuccess = true;
                          this.csvTableHeader = undefined;
                          this.csvTableData = undefined;

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
    }


  // LOAD CSV FILE FROM INPUT
  fileChangeListener($event: any): void {
      const files = $event.srcElement.files;

      if (files !== null && files !== undefined && files.length > 0) {
        this.selectedCSVFileName = files[0].name;

        const reader: FileReader = new FileReader();
        reader.readAsText(files[0]);
        reader.onload = e => {

          const csv = reader.result;
          const results = this.papa.parse(csv as string, { header: false });

          // VALIDATE PARSED CSV FILE
          if (results !== null && results !== undefined && results.data !== null &&
            results.data !== undefined && results.data.length > 0 && results.errors.length === 0) {
            this.isCSV_Valid = true;

            // PERFORM OPERATIONS ON PARSED CSV
             this.csvTableHeader = results.data[0];

             this.csvTableData = [...results.data.slice(1, results.data.length)];
            console.log(this.csvTableHeader);
            console.log(this.csvTableData);

          } else {
            for (let i = 0; i < results.errors.length; i++) {
              console.log( 'Error Parsing CSV File: ',results.errors[i].message);
            }
          }
        };
      } else {
        console.log('No File Selected');
      }

    }
}
