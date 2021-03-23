import { Component, OnInit, ViewEncapsulation, Input,ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import 'rxjs/Rx';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {RestService} from "../../_services/rest.service";
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import {StatusTranslators} from "../../_helpers/statusTranslators";
import { UtilsService } from '../../_providers/utils';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-drivers-processed-requests',
  templateUrl: './drivers-processed-requests.component.html',
  styleUrls: ['./drivers-processed-requests.component.css']
})
export class DriversProcessedRequestsComponent implements OnInit {

  dataForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  processing = false;
  requests: any;
  temp: any;
  rows = [];
  @ViewChild(DriversProcessedRequestsComponent) table: DriversProcessedRequestsComponent;
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
    private toastr: ToastrService,
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

  showSuccess() {
    this.toastr.success('You are awesome!', 'Success!');
  }
  loadData(){
    this.isLoading = true;
    this.rest.getDriverProcessedRequests().subscribe(response => {
        this.isLoading = false;
        let res  = response.json().data;
        if(res.status == "00"){
          this.data = res.payments;
          this.temp = res.payments;
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
    modalRef = this.modalService.open(ViewProcessedRequestModalContent);
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
      <h4 class="modal-title">View Payout Request</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">  
      <ngb-alert *ngIf="successMessage"  [type]="messageType" (close)="successMessage = null">{{ successMessage }}</ngb-alert>    
      <ngb-alert *ngIf="responseMessage" [type]="messageType" (close)="responseMessage = null">{{ responseMessage }}</ngb-alert>   
  
        <div *ngIf="!activeMode" class="profile_containers row">
          <div class="col-md-12">
            <p><span class="lbl-1">Name</span> {{ inputData.first_name }} {{ inputData.last_name }}</p>
          </div>
          <div class="col-md-12">
            <p><span class="lbl-1">Amount</span> {{ inputData.amount }}</p>
          </div>
          <div class="col-md-12">
            <p><span class="lbl-1">Reference Number</span> {{ inputData.reference }}</p>
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
  export class ViewProcessedRequestModalContent {
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
    processing2: boolean;
  
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
  
    closeModal() {
      // this.activeMode = 'car'
      this.activeModal.close();
    }
  
  
    updateTransactionAccepted(s){
      this.processing = true;
      let data = {'id':this.inputData.id, 'status': s}
      this.rest.updateDriverRequestTransactionStatus(data).subscribe(response => {
          this.processing = false;
          let res  = response.json().data;
          console.log(res)
          if(res.status == "00"){
            this.inputData.status = s;  
            this.utils.showToast('success','updated successfully');
            this.closeModal();
          }
      },
        error => {  
          this.processing = false;
          this.utils.showToast('danger','update failed')
        });
    }
  
    updateTransactionReject(s){
      this.processing2 = true;
      let data = {'id':this.inputData.id, 'status': s}
      this.rest.updateDriverRequestTransactionStatus(data).subscribe(response => {
          this.processing2 = false;
          let res  = response.json().data;
          console.log(res)
          if(res.status == "00"){
            this.inputData.status = s;  
            this.utils.showToast('success','updated successfully')
            this.closeModal();
          }
      },
        error => {  
          this.processing2 = false;
          this.utils.showToast('danger','update failed')
        });
    }
  
  
    // convenience getter for easy access to form fields
    get f() { return this.dataForm.controls; }
  }