import { Component, OnInit,ViewChild } from '@angular/core';
import 'rxjs/Rx';
import {RestService} from "../../_services/rest.service";
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {

  loading = false;
  submitted = false;
  error = '';
  processing = false;
  requests: any;
  temp: any;
  rows = [];
  @ViewChild(RequestsComponent) table: RequestsComponent;
  scrollBarHorizontal = (window.innerWidth < 1200);
  private isLoading: boolean = false;


  // End the Closeable Alert
  // This is for the self closing alert
  private _message = new Subject<string>();

  staticAlertClosed = false;
  responseMessage: string;
  closeResult: string;

  constructor(
    		private rest: RestService) 
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
    this.rest.getUserPickupRequest().subscribe(response => {
        this.isLoading = false;
        this.requests = response.json().data;
        this.temp = response.json().data;
    },
      error => {  
        this.isLoading = false;
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
