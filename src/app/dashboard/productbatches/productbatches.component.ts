import { Component, OnInit, ViewEncapsulation, Input,ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import 'rxjs/Rx';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../_services';
import {RestService} from "../../_services/rest.service";
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-productbatches',
  templateUrl: './productbatches.component.html',
  styleUrls: ['./productbatches.component.css']
})
export class ProductbatchesComponent implements OnInit {

  dataForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  processing = false;
  batches: any;
  temp: any;
  @ViewChild(ProductbatchesComponent) table: ProductbatchesComponent;
  rows = [];
  scrollBarHorizontal = (window.innerWidth < 1200);
  public isLoading: boolean = false;


  // End the Closeable Alert
  // This is for the self closing alert
  private _success = new Subject<string>();

  staticAlertClosed = false;
  successMessage: string;
  closeResult: string;

  constructor(
        private modalService: NgbModal,
        private rest: RestService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService
        )  
   { 
      window.onresize = () => {
        this.scrollBarHorizontal = (window.innerWidth < 1200);
      };
	    setTimeout(() => (this.staticAlertClosed = true), 20000);
	    this._success.subscribe(message => (this.successMessage = message));
	    this._success.pipe(debounceTime(5000)).subscribe(() => (this.successMessage = null));
	}


  ngOnInit() {
  	this.getBatches();
  }

  view(row) {
    var modalRef = null;
    modalRef = this.modalService.open(ViewProductBatchModalContent);
    modalRef.componentInstance.inputData = row;
  }


  viewQr(row) {
    var modalRef = null;
    modalRef = this.modalService.open(ProductBatchQRModalContent, { centered: true, size: 'lg' });
    modalRef.componentInstance.inputData = row;
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter(function(d) {
      return d.batch_code.toLowerCase().indexOf(val) !== -1 || !val || d.batch_code.toLowerCase().indexOf(val) !== -1 || !val || d.expiry_date.toLowerCase().indexOf(val) !== -1 || !val   || d.manufacture_date.toLowerCase().indexOf(val) !== -1 || !val ;
      // return d.product.name.toLowerCase().indexOf(val) !== -1 || !val || d.batch_code.toLowerCase().indexOf(val) !== -1 || !val  || d.quantity.toLowerCase().indexOf(val) !== -1 || !val  || d.expiry_date.toLowerCase().indexOf(val) !== -1 || !val   || d.manufacture_date.toLowerCase().indexOf(val) !== -1 || !val ;
    });

    // update the rows
    this.batches = temp;
    // Whenever the filter changes, always go back to the first page
    this.table = this.batches;
  } 

  edit(row) {
    const modalRef = this.modalService.open(EditProductBatchModalContent);
    modalRef.componentInstance.inputData = row;
    modalRef.result.then((result) => {
      this.getBatches();
    })
  }

  delete(row) {
    const modalRef = this.modalService.open(DeleteProductBatchModalContent);
    modalRef.componentInstance.inputData = row;
    modalRef.result.then((result) => {
      this._success.next("Successfully Deleted");
      this.getBatches();
    })
  }



  getBatches(){
    this.isLoading = true;
    this.rest.getProductBatches(null).subscribe(response => {
        this.isLoading = false;
        this.batches = response.json().data;
        this.temp = response.json().data;
        console.log(this.batches)
    },
      error => {  
        this.isLoading = false;
      });
  }


}

@Component({
  selector: 'ngbd-modal-content',
  template: `
  <div class="modal-header"  *ngIf="inputData">
    <h4 class="modal-title">{{ inputData.product.name }}</h4>
    <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body"  *ngIf="inputData">  
    <p><span class="lbl">Name:</span> {{ inputData.product.name }}</p>
    <p><span class="lbl">Batch Code:</span> {{ inputData.batch_code }}</p>
    <p><span class="lbl">Quantity:</span> {{ inputData.quantity }}</p>
    <p><span class="lbl">Manufacture Date:</span> {{ inputData.manufacture_date }}</p>
    <p><span class="lbl">Expiry Date:</span> {{ inputData.expiry_date }}</p>
    <p *ngIf="inputData.note"><span class="lbl">Notes:</span> {{ inputData.note }}</p>
    <p><span class="lbl">Date Created:</span> {{ inputData.created_at }}</p>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-outline-dark" (click)="activeModal.dismiss()">Close</button>
  </div>
  <style>
    .lbl{
      font-weight: bold;
      display: inline-block;
      width: 30%;
    }
  </style>
  `
})
export class ViewProductBatchModalContent {
  inputData: any;
  qrData = {qr_type:"",data: {}};
  qrStr = "";
  // End the Closeable Alert
  // This is for the self closing alert
  private _success = new Subject<string>();

  staticAlertClosed = false;
  successMessage: string;

  constructor(public activeModal: NgbActiveModal,private formBuilder: FormBuilder,private rest: RestService) {}

    ngOnInit() {
      this.qrData.qr_type = "productBatch";
      this.qrData.data = this.inputData;
      this.qrStr = JSON.stringify(this.qrData);
      console.log(this.qrStr)
    }


}


@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Edit Content</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">  
            <ngb-alert *ngIf="successMessage" type="success" (close)="successMessage = null">{{ successMessage }}</ngb-alert>
   

            <form [formGroup]="dataForm" class="form-horizontal m-t-25" id="signupform" (ngSubmit)="onSubmit()">
                <div class="form-group row ">
                    <div class="col-4">
                        <div class="col-12 ">
	                        <label class="block_label" for="d">Quantity (required)</label>
                            <input formControlName="quantity" [(ngModel)]="inputData.quantity" class="form-control form-control-lg" [ngClass]="{ 'is-invalid': submitted && f.quantity.errors }" type="number" required=" " placeholder="Input quantity">
                        </div>
                        <div *ngIf="submitted && f.quantity.errors" class="invalid-feedback">
                            <div *ngIf="f.quantity.errors.required">quantity is required</div>
                        </div>
                    </div>
                </div>
                
				<div class="form-group row">
                    <div class="col-6">
                        <label class="block_label" for="d">Select Manufacture Date (required)</label>
						<div class="input-group">
							<input formControlName="manufacture_date" class="form-control" (click)="d.toggle()" placeholder="yyyy-mm-dd"
							 name="dp" [ngClass]="{ 'is-invalid': submitted && f.manufacture_date.errors }"  [(ngModel)]="inputData.manufacture_date" ngbDatepicker #d="ngbDatepicker">
							<div class="input-group-append">
								<button class="btn btn-outline-secondary" (click)="d.toggle()" type="button"><i class="fa fa-calendar"></i></button>
							</div>
						</div>
                        <div *ngIf="submitted && f.manufacture_date.errors" class="invalid-feedback">
                            <div *ngIf="!inputData.manufacture_date.errors">manufacture date is required</div>
                        </div>
					</div>
                    <div class="col-6">
                        <label class="block_label" for="d2">Select Expiry Date (required)</label>
						<div class="input-group">
							<input formControlName="expiry_date" class="form-control" (click)="d2.toggle()" placeholder="yyyy-mm-dd"
							 name="dp" [ngClass]="{ 'is-invalid': submitted && f.expiry_date.errors }"  [(ngModel)]="inputData.expiry_date" ngbDatepicker #d2="ngbDatepicker">
							<div class="input-group-append">
								<button class="btn btn-outline-secondary" (click)="d2.toggle()" type="button"><i class="fa fa-calendar"></i></button>
							</div>
						</div>
                        <div *ngIf="submitted && f.expiry_date.errors" class="invalid-feedback">
                            <div *ngIf="!inputData.expiry_date.errors">expiry date is required</div>
                        </div>
					</div>
				</div>
                <div class="form-group row ">
                    <div class="col-12 ">
                    	<textarea formControlName="note" [(ngModel)]="inputData.note" class="form-control form-control-lg" [ngClass]="{ 'is-invalid': submitted && f.note.errors }" placeholder="Notes"></textarea>
                    </div>
                </div>
            </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="onSubmit()" [disabled]="processing">                       
        <img *ngIf="processing" class="pl-2" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
        Submit
      </button>
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
    </div>
    <style>
    	.block_label{
			display: block !important;
		}

		.invalid-feedback {
		    color: red !important;
		    display: block;
		    padding-left: 5%;
		}
    </style>
  `
})

export class EditProductBatchModalContent {
  @Input() name;
  dataForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  processing = false;
  inputData: any;

  // End the Closeable Alert
  // This is for the self closing alert
  private _success = new Subject<string>();

  staticAlertClosed = false;
  successMessage: string;

  constructor(public activeModal: NgbActiveModal,
        private formBuilder: FormBuilder,private rest: RestService) {

        setTimeout(() => (this.staticAlertClosed = true), 20000);

        this._success.subscribe(message => (this.successMessage = message));
        this._success.pipe(debounceTime(5000)).subscribe(() => (this.successMessage = null));
      }




    ngOnInit() {
    	if(this.inputData.manufacture_date)
	        this.inputData.manufacture_date = this.parseDate(this.inputData.manufacture_date);
    	if(this.inputData.expiry_date)
	        this.inputData.expiry_date = this.parseDate(this.inputData.expiry_date);
        console.log(this.inputData);
        this.dataForm = this.formBuilder.group({
            expiry_date: ['', Validators.required],
            manufacture_date: ['', Validators.required],
            note: [''],
            quantity: ['', Validators.required],
        });

    }

    

    onSubmit() {
        this.submitted = true;
        console.log(this.dataForm);
        console.log(this.inputData);
        // stop here if form is invalid
        if (this.dataForm.invalid) {
            return;
        }

        console.log(this.inputData);

        // format date before sending
        this.inputData.manufacture_date = this.format(this.inputData.manufacture_date);
        this.inputData.expiry_date = this.format(this.inputData.expiry_date);

        this.processing = true;
        this.rest.updateProductBatch(this.inputData)
            .map(res => res.json())
            .subscribe(
                data => {
                    console.log(data);
			        this.inputData.manufacture_date = this.parseDate(this.inputData.manufacture_date);
			        this.inputData.expiry_date = this.parseDate(this.inputData.expiry_date);
                    this._success.next(`${data.message}`);

                    this.submitted = false;
                    this.processing = false;
                    // this.router.navigate(['/authentication/login']);
                },
                error => {
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


    // convenience getter for easy access to form fields
    get f() { return this.dataForm.controls; }
}


@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Delete Content</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">  
      <p>Are you sure ?</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="delete()">Delete</button>
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
    </div>
  `
})
export class DeleteProductBatchModalContent {
  @Input() name;
  dataForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  processing = false;
  inputData: any;

  // End the Closeable Alert
  // This is for the self closing alert
  private _success = new Subject<string>();

  staticAlertClosed = false;
  successMessage: string;

  constructor(public activeModal: NgbActiveModal,private formBuilder: FormBuilder,private rest: RestService) {}

    ngOnInit() {

    }

    delete() {
        this.processing = true;
        this.rest.deleteProductBatch(this.inputData)
            .map(res => res.json())
            .subscribe(
                data => {
                    this._success.next(`${data.message}`);

                    this.submitted = false;
                    this.processing = false;
                    this.activeModal.close();
                },
                error => {
                    this.error = error;
                    this.loading = false;
                    this.processing = false;
                });
    }


}




@Component({
  selector: 'ngbd-modal-content',
  template: `
  <div class="modal-header"  *ngIf="inputData">
    <h4 class="modal-title">QR for batch {{ inputData.batch_code }}</h4>
    <!-- 
    <label for="inlineFormCustomSelect">Per Page</label>
    <select [(ngModel)]="perPage" class="custom-select col-md-2" id="inlineFormCustomSelect">
      <option value="1">1</option>
      <option value="4">4</option>
      <option value="8">8</option>
    </select>
    <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
      <span aria-hidden="true">&times;</span>
    </button>
    -->
  </div>
  <div class="modal-body"  *ngIf="inputData"> 
    <div class="row" id="print-section">
      <div style="margin-bottom: 15px; margin-left:auto; margin-right:auto;">
        <qrcode style="margin-left:auto; margin-right:auto;" [qrdata]="'Your QR code data string'" [size]="256" [level]="'M'"></qrcode>
      </div>
    </div>
    <!--  
      <h4 style="text-align:center; margin-bottom: 30px">QR for Batch {{ inputData.batch_code }}</h4> 
      <div class="row" id="print-section"   style="width: 960px;">
        <div *ngFor="let i of RepeatArr(perPage).fill(1)"  style="width: 200px; margin-bottom: 15px;">
          <qrcode [qrdata]="'Your QR code data string'" [size]="128" [level]="'M'"></qrcode>
        </div>
      </div>
    -->
  </div>
  <div class="modal-footer">
    <button printSectionId="print-section" class="btn btn-outline-success" ngxPrint><i class="mdi mdi-printer"></i> Print</button> 
    <button type="button" class="btn btn-outline-dark" (click)="activeModal.dismiss()">Close</button>
  </div>
  <style>
    .lbl{
      font-weight: bold;
      display: inline-block;
      width: 30%;
    }
    @media print {
      .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12 {
           float: left;
      }
      .col-sm-12 {
           width: 100%;
      }
      .col-sm-11 {
           width: 91.66666667%;
      }
      .col-sm-10 {
           width: 83.33333333%;
      }
      .col-sm-9 {
           width: 75%;
      }
      .col-sm-8 {
           width: 66.66666667%;
      }
      .col-sm-7 {
           width: 58.33333333%;
      }
      .col-sm-6 {
           width: 50%;
      }
      .col-sm-5 {
           width: 41.66666667%;
      }
      .col-sm-4 {
           width: 33.33333333%;
      }
      .col-sm-3 {
           width: 25%;
      }
      .col-sm-2 {
           width: 16.66666667%;
      }
      .col-sm-1 {
           width: 8.33333333%;
      }
   }
    </style>
  `
})
export class ProductBatchQRModalContent {
  @Input() name;
  dataForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  processing = false;
  perPage = 8;
  inputData: any;
  RepeatArr = Array;
  
  // End the Closeable Alert
  // This is for the self closing alert
  private _success = new Subject<string>();

  staticAlertClosed = false;
  successMessage: string;

  constructor(public activeModal: NgbActiveModal,private formBuilder: FormBuilder,private rest: RestService) {}

    ngOnInit() {

    }

    delete() {
        this.processing = true;
        this.rest.deleteProductBatch(this.inputData)
            .map(res => res.json())
            .subscribe(
                data => {
                    this._success.next(`${data.message}`);

                    this.submitted = false;
                    this.processing = false;
                    this.activeModal.close();
                },
                error => {
                    this.error = error;
                    this.loading = false;
                    this.processing = false;
                });
    }


}
