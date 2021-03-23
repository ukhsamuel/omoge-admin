import { Component, OnInit, ViewEncapsulation, Input,ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import 'rxjs/Rx';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {RestService} from "../../../_services/rest.service";
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import {StatusTranslators} from "../../../_helpers/statusTranslators";
import { UtilsService } from '../../../_providers/utils';

@Component({
  selector: 'app-cancelled-trips',
  templateUrl: './cancelled-trips.component.html',
  styleUrls: ['./cancelled-trips.component.css']
})
export class CancelledTripsComponent implements OnInit {
  dataForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  processing = false;
  requests: any;
  temp: any;
  rows = [];
  @ViewChild(CancelledTripsComponent) table: CancelledTripsComponent;
  scrollBarHorizontal = (window.innerWidth < 1200);
  private isLoading: boolean = false;


  // End the Closeable Alert
  // This is for the self closing alert
  private _message = new Subject<string>();

  staticAlertClosed = false;
  responseMessage: string;
  closeResult: string;
  data: any;


  constructor(
    private _loadingBar: SlimLoadingBarService, 
    private modalService: NgbModal,
    private rest: RestService,
    private utils: UtilsService,
    private formBuilder: FormBuilder,
    private statusTranslators: StatusTranslators,
    private route: ActivatedRoute,
    private router: Router) 
{ 
    window.onresize = () => {
      this.scrollBarHorizontal = (window.innerWidth < 1200);
    };
    setTimeout(() => (this.staticAlertClosed = true), 20000);

    this._message.subscribe(message => (this.responseMessage = message));
    this._message.pipe(debounceTime(5000)).subscribe(() => (this.responseMessage = null));
}

  

ngOnInit() {
  this.loadData();
}

loadData(){
  this.isLoading = true;
  this.rest.getCancelledTrips().subscribe(response => {
      this.isLoading = false;
      let res  = response.json().data;
      if(res.status == "00"){
        this.data = res.trips;
        this.temp = res.trips;
        console.log(this.data)

      }
  },
    error => {  
      this.isLoading = false;
    });
}

view(row) {
  var modalRef = null;
  // modalRef = this.modalService.open(ViewDriverModalContent, { size: 'lg' });
  modalRef = this.modalService.open(ViewDriverModalContent);
  modalRef.componentInstance.inputData = row;
  modalRef.result.then((data) => {
    this.loadData()
  }, (reason) => {
    this.loadData()
  });
}

updateFilter(event) {
  const val = event.target.value.toLowerCase();

  // filter our data
  const temp = this.temp.filter(function(d) {
    return d.request_code.toLowerCase().indexOf(val) !== -1 || !val;
  });


  // update the rows
  this.requests = temp;
  // Whenever the filter changes, always go back to the first page
  this.table = this.requests;
} 

}


@Component({
selector: 'ngbd-modal-content',
template: `
  <div class="modal-header">
    <i *ngIf="activeMode" style="font-size:1.3em; margin-right: 5%" (click)="goBack()" class="mdi mdi-keyboard-backspace"></i>    
    <h4 class="modal-title">View Driver Information</h4>
    <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body">  
    <ngb-alert *ngIf="successMessage"  [type]="messageType" (close)="successMessage = null">{{ successMessage }}</ngb-alert>    
    <ngb-alert *ngIf="responseMessage" [type]="messageType" (close)="responseMessage = null">{{ responseMessage }}</ngb-alert>   

    <div *ngIf="!activeMode" class="profile_container">
      <img src="assets/images/users/1.jpg"  class="avatar-circle" alt="user">
    </div>

      <div *ngIf="!activeMode" class="profile_containers row">
        <div class="col-md-12">
          <p><span class="lbl-1">Name</span> {{ inputData.first_name }} {{ inputData.last_name }}</p>
        </div>
        <div class="col-md-12">
          <p><span class="lbl-1">Email</span> {{ inputData.email }}</p>
        </div>
        <div class="col-md-12">
          <p><span class="lbl-1">Phone Number</span> {{ inputData.phone }}</p>
        </div>

      <div class="col-md-12">
        <div class="btn-container">
          <button class="btn btn-block btn-outline-success" (click)="viewCar()" type="submit ">                       
            View Car
          </button>
        </div>
        <div class="btn-container">
          <button class="btn btn-block btn-outline-success" (click)="viewDocuments()" type="submit ">                       
            View Documents
          </button>
        </div>
        <div class="btn-container">
          <button class="btn btn-block btn-outline-success" (click)="viewBankingDetails()" type="submit ">                       
            View Banking Information
          </button>
        </div>
        <button [disabled]="isActivating"  *ngIf="inputData.status == 0" class="btn btn-block btn-lg btn-rounded btn-sm btn-success" (click)="toggleAccountActivation(1)" type="submit ">                       
          <img *ngIf="isActivating" class="pl-2" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
          Activate Account
        </button>
        <button [disabled]="isActivating" *ngIf="inputData.status == 1" class="btn btn-block btn-lg btn-rounded btn-sm btn-danger" (click)="toggleAccountActivation(0)" type="submit ">                       
          <img *ngIf="isActivating" class="pl-2" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
          Deactivate Account
        </button>
        <button [disabled]="isVerifying"  *ngIf="!inputData.verification_status || inputData.verification_status == 0" class="btn btn-block btn-lg btn-rounded btn-sm btn-info" (click)="updateAccountVerification(1)" type="submit ">                       
          <img *ngIf="isVerifying" class="pl-2" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
          Verify Account
        </button>
        <button [disabled]="isVerifying" *ngIf="inputData.verification_status == 1" class="btn btn-block btn-lg btn-rounded btn-sm btn-secondary" (click)="updateAccountVerification(0)" type="submit ">                       
          <img *ngIf="isVerifying" class="pl-2" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
          Unverify Account
        </button>
      </div>
    </div>
    <div *ngIf="activeMode && activeMode == 'documents'">
      <p *ngIf="noDocuments">No documents uploaded</p>
      <div *ngIf="documents">
        <a target="_blank" href="{{ documents.driver_license }}">{{documents.driver_license?'View Drivers License':'not uploaded'}}</a> <br>
        <a target="_blank" href="{{ documents.vehicle_license }}">{{documents.vehicle_license?'View Vehicle License':'not uploaded'}}</a> <br>
        <a target="_blank" href="{{ documents.insurance }}">{{documents.insurance?'View Insurance':'not uploaded'}}</a>
      </div>
    </div>
    <div *ngIf="activeMode && activeMode == 'car'">
      <p *ngIf="noCar">No car details uploaded</p>
      <div *ngIf="car">
        <p>Brand: {{ car.brand }}</p>
        <p>Model: {{ car.model }}</p>
        <p>Color: {{ car.color }}</p>
        <p>Plate Number: {{ car.plate_number }}</p>
      </div>
    </div>
    <div *ngIf="activeMode && activeMode == 'bank'">
    <p *ngIf="noBankingDetails">No bank details uploaded</p>
      <div *ngIf="bankingDetails">
        <p>Bank: {{ bankingDetails.bankName }}</p>
        <p>Account Name: {{ bankingDetails.accountName }}</p>
        <p>Account Number: {{ bankingDetails.accountNumber }}</p>
      </div>
    </div>
  </div>
  <style>
    .btn-container{
      text-align:center;
    }
    .btn-container{
      margin-bottom: 3%
    }
    .profile_container{
      text-align:center;
      padding: 20pt;
    }
    .avatar-circle {
      border-radius: 50%;
      height: 80px;
      border: 1px solid #777;
    }
    .lbl-1{
      display:inline-block;
      font-weight:bold;
      width: 120pt;
    }
  </style>
`
})
export class ViewDriverModalContent {
@Input() name;
dataForm: FormGroup;
loading = false;
submitted = false;
error = '';
processing = false;
inputData: any;
messageType:any;
activeMode:any;

// End the Closeable Alert
// This is for the self closing alert
private _success = new Subject<string>();
private _message = new Subject<string>();
responseMessage: string;

staticAlertClosed = false;
successMessage: string;
isLoading: boolean;
documents: any;
car: any;
bankingDetails: any;
isActivating: boolean;
noBankingDetails: boolean;
noDocuments: boolean;
noCar: boolean;
isVerifying: boolean;

constructor(
      public activeModal: NgbActiveModal,
      private utils: UtilsService,
      private formBuilder: FormBuilder,
      private rest: RestService
      ) {

      setTimeout(() => (this.staticAlertClosed = true), 20000);

      this._success.subscribe(message => (this.successMessage = message));
      this._success.pipe(debounceTime(5000)).subscribe(() => (this.successMessage = null));
      // set up Alert
      setTimeout(() => (this.staticAlertClosed = true), 20000);
  
      this._message.subscribe(message => (this.responseMessage = message));
      this._message.pipe(debounceTime(5000)).subscribe(() => (this.responseMessage = null));
    }




  ngOnInit() {
    console.log(this.inputData)
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
  viewDocuments() {
    this.activeMode = 'documents'
    this.loadDocuments();
  }

  viewCar() {
    this.activeMode = 'car';
    this.loadCar();
  }

  viewBankingDetails() {
    this.activeMode = 'bank';
    this.loadBankingDetails();
  }

  goBack() {
    this.activeMode = undefined;
  }

  toggleAccountActivation(s) {
    // this.activeMode = 'car'
    this.updateAccountActivation(s);
  }


  updateAccountActivation(s){
    this.isActivating = true;
    let driver = {'user_id':this.inputData.id, 'status': s}
    this.rest.updateAccountActivation(driver).subscribe(response => {
        this.isActivating = false;
        let res  = response.json().data;
        console.log(res)
        if(res.status == "00"){
          this.inputData.status = s;  
        }
    },
      error => {  
        this.isActivating = false;
      });
  }

  updateAccountVerification(s){
    this.isVerifying = true;
    let driver = {'user_id':this.inputData.id, 'status': s}
    this.rest.updateAccountVerification(driver).subscribe(response => {
        this.isVerifying = false;
        let res  = response.json().data;
        console.log(res)
        if(res.status == "00"){
          this.inputData.verification_status = s;  
        }
    },
      error => { 

        let err  = error.json().data;
        let msg = this.utils.processErrorMessages(err.errors);
        this.messageType = 'danger';
        this._message.next(`${msg}`);
        console.log(msg)
        this.isVerifying = false;
      });
  }

  loadDocuments(){
    this.isLoading = true;
    this.rest.getDriverDocuments(this.inputData.id).subscribe(response => {
        this.isLoading = false;
        let res  = response.json().data;
        console.log(res)
        if(res.status == "00"){
          this.documents = res.documents;
          console.log(this.documents)

        }else{
          this.noDocuments = true;
        }
    },
      error => {  
        this.isLoading = false;
      });
  }



  loadBankingDetails(){
    this.isLoading = true;
    this.rest.getDriverBankingDetails(this.inputData.id).subscribe(response => {
        this.isLoading = false;
        let res  = response.json().data;
        console.log(res)
        if(res.status == "00"){
          this.bankingDetails = res.details;
          console.log(this.bankingDetails)
        }else{
          this.noBankingDetails = true;
        }
    },
      error => {  
        this.isLoading = false;
      });
  }


  loadCar(){
    this.isLoading = true;
    this.rest.getDriverCarDetails(this.inputData.id).subscribe(response => {
        this.isLoading = false;
        let res  = response.json().data;
        console.log(res)
        if(res.status == "00"){
          this.car = res.car;
          console.log(this.car)

        }else{
          this.noCar = true;
        }
    },
      error => {  
        this.isLoading = false;
      });
  }


  // convenience getter for easy access to form fields
  get f() { return this.dataForm.controls; }
}