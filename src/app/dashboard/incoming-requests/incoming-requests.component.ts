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

@Component({
  selector: 'app-incoming-requests',
  templateUrl: './incoming-requests.component.html',
  styleUrls: ['./incoming-requests.component.css']
})
export class IncomingRequestsComponent implements OnInit {

  dataForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  processing = false;
  requests: any;
  temp: any;
  rows = [];
  @ViewChild(IncomingRequestsComponent) table: IncomingRequestsComponent;
  scrollBarHorizontal = (window.innerWidth < 1200);
  private isLoading: boolean = false;



  // End the Closeable Alert
  // This is for the self closing alert
  private _message = new Subject<string>();

  staticAlertClosed = false;
  responseMessage: string;
  closeResult: string;


  constructor(
        private _loadingBar: SlimLoadingBarService, 
        private modalService: NgbModal,
    		private rest: RestService,
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
  	this.getRequests();
  }

  getRequests(){
    this.isLoading = true;
    this.rest.getUserIncomingPickupRequest().subscribe(response => {
        this.isLoading = false;
        this.requests = response.json().data;
        this.temp = response.json().data;
        console.log(this.requests)
    },
      error => {  
        this.isLoading = false;
      });
  }

  view(row) {
    var modalRef = null;
    modalRef = this.modalService.open(ViewRequestModalContent);
    modalRef.componentInstance.inputData = row;
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
      <h4 class="modal-title">View Request</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">  
      <ngb-alert *ngIf="successMessage"  [type]="messageType" (close)="successMessage = null">{{ successMessage }}</ngb-alert>
      <div>
        <form [formGroup]="dataForm" class="form-horizontal m-t-25" id="signupform" (ngSubmit)="onSubmit()">

          <div class="form-group ">
              <div class="col-xs-12 p-b-20 ">
                  <button class="btn btn-blockd btn-lg btn-success" (click)="onSubmit()" [disabled]="processing" type="submit ">                       
                      <img *ngIf="processing" class="pl-2" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                     request picked up
                  </button>
              </div>
          </div>
        </form>
      </div>

      <div>
        <p>Date: {{ inputData.created_at }}</p>
        <p>Req. id: {{ inputData.request_code }}</p>
        <p>From: {{ inputData.requested_by_user.name }}</p>
        <p>Products: {{ inputData.product.name }} ({{ inputData.quantity }})</p>
      </div>
    </div>
  `
})
export class ViewRequestModalContent {
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

    

    onSubmit() {
        this.submitted = true;
        this.inputData.status = 1;

        this.processing = true;
        this.rest.updatePickupRequestStatus(this.inputData)
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