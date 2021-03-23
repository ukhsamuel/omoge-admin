import { Component, OnInit, ViewEncapsulation, Input,ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import 'rxjs/Rx';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../_services';
import {RestService} from "../../_services/rest.service";
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.css']
})
export class AgentsComponent implements OnInit {

  dataForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  processing = false;
  agents: any;
  temp: any;
  @ViewChild(AgentsComponent) table: AgentsComponent;
  rows = [];


  // End the Closeable Alert
  // This is for the self closing alert
  private _success = new Subject<string>();

  staticAlertClosed = false;
  successMessage: string;
  closeResult: string;

  constructor(
        private _loadingBar: SlimLoadingBarService, 
        private modalService: NgbModal,
    		private rest: RestService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService
        )  
   { 
	    setTimeout(() => (this.staticAlertClosed = true), 20000);

	    this._success.subscribe(message => (this.successMessage = message));
	    this._success.pipe(debounceTime(5000)).subscribe(() => (this.successMessage = null));
	}

  ngOnInit() {
  	this.getAgents();
  }


  revoke(row) {
    const modalRef = this.modalService.open(RemoveAgentModalContent);
    modalRef.componentInstance.inputData = row;
    modalRef.result.then((result) => {
      this._success.next("Successfully Deleted");
      this.getAgents();
    })
  }
  getAgents(){
    this._loadingBar.start();
    this.rest.getAgents().subscribe(response => {
        this._loadingBar.complete();
        this.agents = response.json().data;
        this.temp = response.json().data;
        console.log(this.agents)
    },
      error => {  
        this._loadingBar.complete();
      });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function(d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val || d.price.toLowerCase().indexOf(val) !== -1 || !val  || d.sku.toLowerCase().indexOf(val) !== -1 || !val  || d.fda.toLowerCase().indexOf(val) !== -1 || !val ;
    });

    // update the rows
    this.agents = temp;
    // Whenever the filter changes, always go back to the first page
    this.table = this.agents;
  } 

}



@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Remove Middleman</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">  
      <p>Are you sure ?</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="delete()">Remove</button>
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
    </div>
  `
})
export class RemoveAgentModalContent {
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
        this.rest.removeAgent(this.inputData)
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
