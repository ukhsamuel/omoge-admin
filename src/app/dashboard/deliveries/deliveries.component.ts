import { Component, OnInit,ViewChild } from '@angular/core';
import 'rxjs/Rx';
import {RestService} from "../../_services/rest.service";
import {StatusTranslators} from "../../_helpers/statusTranslators";
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.css']
})
export class DeliveriesComponent implements OnInit {

  loading = false;
  submitted = false;
  error = '';
  processing = false;
  deliveries: any;
  temp: any;
  rows = [];
  scrollBarHorizontal = (window.innerWidth < 1200);
  public isLoading: boolean = false;
  @ViewChild(DeliveriesComponent) table: DeliveriesComponent;


  // End the Closeable Alert
  // This is for the self closing alert
  private _message = new Subject<string>();

  staticAlertClosed = false;
  responseMessage: string;
  closeResult: string;



  constructor(
        private rest: RestService,
        private statusTranslators: StatusTranslators
  ) 
    {
          window.onresize = () => {
            this.scrollBarHorizontal = (window.innerWidth < 1200);
          };
		    setTimeout(() => (this.staticAlertClosed = true), 20000);
		    
		    this._message.subscribe(message => (this.responseMessage = message));
		    this._message.pipe(debounceTime(5000)).subscribe(() => (this.responseMessage = null));
		}

  ngOnInit() {
  	this.getDeliveries();
  }

  getDeliveries(){
    this.isLoading = true;
    this.rest.getUserDeliveries().subscribe(response => {
      this.isLoading = false;
        this.deliveries = response.json().data;
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
    this.deliveries = temp;
    // Whenever the filter changes, always go back to the first page
    this.table = this.deliveries;
  } 
}
