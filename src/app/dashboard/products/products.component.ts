import { Component, OnInit, Input,ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import 'rxjs/Rx';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {RestService} from "../../_services/rest.service";
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  dataForm: FormGroup;
  submitted = false;
  error = '';
  processing = false;
  products: any;
  temp: any;
  @ViewChild(ProductsComponent) table: ProductsComponent;
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
  	this.getProducts();
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function(d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val || d.price.toLowerCase().indexOf(val) !== -1 || !val  || d.sku.toLowerCase().indexOf(val) !== -1 || !val  || d.fda.toLowerCase().indexOf(val) !== -1 || !val ;
    });
    // update the rows
    this.products = temp;
    // Whenever the filter changes, always go back to the first page
    this.table = this.products;
  } 

  view(row) {
    var modalRef = null;
    modalRef = this.modalService.open(ViewProductModalContent);
    modalRef.componentInstance.inputData = row;
  }

  edit(row) {
    const modalRef = this.modalService.open(EditProductModalContent);
    modalRef.componentInstance.inputData = row;
    modalRef.result.then((result) => {
      this.getProducts();
    })
  }

  delete(row) {
    const modalRef = this.modalService.open(DeleteProductModalContent);
    modalRef.componentInstance.inputData = row;
    modalRef.result.then((result) => {
      this._success.next("Successfully Deleted");
      this.getProducts();
    })
  }

  getProducts(){
    this.isLoading = true;
    this.rest.getProducts().subscribe(response => {
        this.isLoading = false;
        this.products = response.json().data;
        this.temp = response.json().data;
        console.log(this.products)
    },
      error => {  
        this.isLoading = false;
      });
  }




}

@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header"  *ngIf="inputData && inputData.name">
      <h4 class="modal-title">{{ inputData.name }}</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body"  *ngIf="inputData && inputData.name">  
      <p><span class="lbl">Name:</span> {{ inputData.name }}</p>
      <p><span class="lbl">Manufacturer:</span> {{ inputData.manufacturer.name }}</p>
      <p><span class="lbl">Price:</span> {{ inputData.price }}</p>
      <p><span class="lbl">SKU:</span> {{ inputData.sku }}</p>
      <p><span class="lbl">Weight:</span> {{ inputData.weight }}</p>
      <p><span class="lbl">FDA:</span> {{ inputData.fda }}</p>
      <p *ngIf="inputData.notes"><span class="lbl">Notes:</span> {{ inputData.notes }}</p>
      <p *ngIf="inputData.tags"><span class="lbl">Tags:</span> {{ inputData.tags }}</p>
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
export class ViewProductModalContent {
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

  constructor(public activeModal: NgbActiveModal,private rest: RestService) {}

    ngOnInit() {
      console.log(this.inputData)
    }

    delete() {
        this.processing = true;
        this.rest.deleteProduct(this.inputData)
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
    <div class="modal-header">
      <h4 class="modal-title">Edit Content</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">  
            <ngb-alert *ngIf="successMessage"  [type]="messageType" (close)="successMessage = null">{{ successMessage }}</ngb-alert>

        <form [formGroup]="dataForm" class="form-horizontal m-t-25" id="signupform" (ngSubmit)="onSubmit()">                  

              <div class="form-group row ">
                  <div class="col-12 ">
                      <label>Name</label>
                      <input formControlName="name" [(ngModel)]="inputData.name" class="form-control form-control-lg" [ngClass]="{ 'is-invalid': submitted && f.name.errors }" type="text" required=" " placeholder="Name of Product (required)">
                  </div>
                  <div *ngIf="submitted && f.name.errors" class="invalid-feedback">
                      <div *ngIf="f.name.errors.required">Name is required</div>
                  </div>
              </div>
              <div class="form-group row ">
                  <div class="col-6">
                    <div class="col-12 ">
                        <label>Price</label>
                        <input formControlName="price" [(ngModel)]="inputData.price" class="form-control form-control-lg" [ngClass]="{ 'is-invalid': submitted && f.price.errors }" type="text" required=" " placeholder="Price (required)">
                    </div>
                    <div *ngIf="submitted && f.price.errors" class="invalid-feedback">
                        <div *ngIf="f.price.errors.required">Price is required</div>
                    </div>
                </div>
                  <div class="col-6">
                    <div class="col-12 ">
                        <label>Weight</label>
                        <input formControlName="weight" [(ngModel)]="inputData.weight" class="form-control form-control-lg" [ngClass]="{ 'is-invalid': submitted && f.weight.errors }" type="text" required=" " placeholder="Weight (required)">
                    </div>
                    <div *ngIf="submitted && f.weight.errors" class="invalid-feedback">
                        <div *ngIf="f.weight.errors.required">Weight is required</div>
                    </div>
                </div>
              </div>
              <div class="form-group row ">
                  <div class="col-6">
                      <div class="col-12 ">
                        <label>SKU</label>
                          <input formControlName="sku" [(ngModel)]="inputData.sku" class="form-control form-control-lg" [ngClass]="{ 'is-invalid': submitted && f.sku.errors }" type="text" required=" " placeholder="SKU (required)">
                      </div>
                      <div *ngIf="submitted && f.sku.errors" class="invalid-feedback">
                          <div *ngIf="f.sku.errors.required">SKU is required</div>
                      </div>
                  </div>
                  <div class="col-6">
                      <div class="col-12 ">
                        <label>FDA</label>
                          <input formControlName="fda" [(ngModel)]="inputData.fda" class="form-control form-control-lg" [ngClass]="{ 'is-invalid': submitted && f.fda.errors }" type="text" required=" " placeholder="FDA (required)">
                      </div>
                      <div *ngIf="submitted && f.sku.errors" class="invalid-feedback">
                          <div *ngIf="f.fda.errors.required">FDA is required</div>
                      </div>
                  </div>
              </div>
              <div class="form-group row ">
                  <div class="col-12 ">
                        <label>Notes</label>
                    <textarea formControlName="notes" [(ngModel)]="inputData.notes" class="form-control form-control-lg" [ngClass]="{ 'is-invalid': submitted && f.notes.errors }" placeholder="Description"></textarea>
                  </div>
              </div>
              <div class="form-group row ">
                  <div class="col-12 ">
                        <label>Tags</label>
                      <input formControlName="tags" [(ngModel)]="inputData.tags" class="form-control form-control-lg" type="text" placeholder="tags (comma seperated)">
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
  `
})
export class EditProductModalContent {
  @Input() name;
  dataForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  processing = false;
  inputData: any;
  messageType:any;

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
        this.dataForm = this.formBuilder.group({
            name: ['', Validators.required],
            fda: ['', Validators.required],
            price: ['', Validators.required],
            weight: ['', Validators.required],
            notes: [''],
            tags: [],
            sku: ['', Validators.required],
        });

    }

    

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.dataForm.invalid) {
            return;
        }

        this.processing = true;
        this.rest.updateProduct(this.inputData)
            .map(res => res.json())
            .subscribe(
                data => {
                    console.log(data);

                    this.submitted = false;
                    this.processing = false;
                      if(data.status == "00"){
                        this.messageType = 'success';
                        this._success.next(`${data.message}`);
                      }else{
                        data.message = this.rest.processErrorMessages(data.message);
                        this.messageType = 'danger';
                        this._success.next(`${data.message}`);
                      }
                },
                error => {
                    this.error = error;
                    this.loading = false;
                    this.processing = false;
                });
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
export class DeleteProductModalContent {
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
        this.rest.deleteProduct(this.inputData)
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
