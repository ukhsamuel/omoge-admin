import { Component, OnInit,ViewChild } from '@angular/core';
import 'rxjs/Rx';
import {RestService} from "../../_services/rest.service";
import {StatusTranslators} from "../../_helpers/statusTranslators";
import {ActivatedRoute} from '@angular/router'
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as firebase from 'Firebase';
import { MapsAPILoader } from '@agm/core';
// import {RestService} from "../../../assets/images/";

declare var google;

@Component({
  selector: 'app-view-delivery',
  templateUrl: './view-delivery.component.html',
  styleUrls: ['./view-delivery.component.css']
})
export class ViewDeliveryComponent implements OnInit {
  deliveryId : any;
  delivery : any;
  public isLoading: boolean = false;
  ref: any;
	map: any;
  cords = {latitude: '', longitude: ''}
  agenticon = './assets/images/person1.png';

  device = {
    uuid: '12345',
  }
  markers = [];

	public latitude: number;
	public longitude: number;
	public zoom: number;


  constructor(
    private rest: RestService,
    private activatedRoute: ActivatedRoute,
    private statusTranslators: StatusTranslators,
    private mapsAPILoader: MapsAPILoader,
    private modalService: NgbModal
    ) {
      this.deliveryId = this.activatedRoute.snapshot.paramMap.get("id");
      this.getDelivery(this.deliveryId);
     }

  ngOnInit() {
    setInterval(() => {
      if(this.delivery)
        this._getDelivery(); 
    }, 2000);
  }

  getDelivery(id){
    this.isLoading = true;
    this.rest.viewDelivery(id).subscribe(response => {
      this.isLoading = false;
        this.delivery = response.json().data;       
        this.geoCode(this.delivery.delivery_address)

        // this.ref = firebase.database().ref(`geolocations/${this.delivery.agent.id}`);
        this.ref = firebase.database().ref(`geolocations`);
        console.log(this.delivery);

        this.ref.on('value', resp => {
          console.log(resp);
          this.deleteMarkers();
          snapshotToArray(resp).forEach(data => {
            console.log('>>>data');
            console.log(data);

              let image = 'assets/img/person1.png';
              let updatelocation = new google.maps.LatLng(data.latitude,data.longitude);

              //set latitude, longitude and zoom
              this.latitude = data.latitude;
              this.longitude = data.longitude;

              this.zoom = 14;
              this.addMarker(updatelocation,image);
              this.setMapOnAll(this.map);
              // this.map.panTo(updatelocation)
          });
        });

    },
      error => {  
        this.isLoading = false;
      });
  }

  _getDelivery(){
    this.rest.viewDelivery(this.deliveryId).subscribe(response => {
        this.delivery = response.json().data;       
    },
      error => {  
      });
  }

  addMarker(location, image) {
    let marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: image
    });
    this.markers.push(marker);
  }


  setMapOnAll(map) {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
  }

  clearMarkers() {
    this.setMapOnAll(null);
  }

  deleteMarkers() {
    this.clearMarkers();
    this.markers = [];
  }

  viewAllBoxesQR(row) {
    var modalRef = null;
    modalRef = this.modalService.open(allBoxesQRModalContent);
    modalRef.componentInstance.inputData = row;
  } 
  geoCode(address:any) {
     let geocoder = new google.maps.Geocoder();
     geocoder.geocode({ 'address': address }, (results, status) => {
       if(status == 'OK'){
         console.log(this.cords.latitude);
         this.cords.latitude = results[0].geometry.location.lat();
         this.cords.longitude = results[0].geometry.location.lng(); 
         // this.loadMap(this.cords.latitude, this.cords.longitude);
         let latLng = new google.maps.LatLng(this.cords.latitude, this.cords.longitude);
        // let latLng = new google.maps.LatLng(-34.9290, 138.6010);
 
       let marker = new google.maps.Marker({
         map: this.map,
         animation: google.maps.Animation.DROP,
         position: latLng
       });
 
        //  console.log(this.cords.longitude);       
       }else{

      }
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
        <div style="width: 960px;">
          <div *ngFor="let i of inputData"  style="width: 200px; float:left; margin-bottom: 15px;">
          <h4 style="text-align:center; margin-bottom: 30px">QR for Box {{ i.box_id }}</h4> 
            <qrcode [qrdata]="returnString(i)" [size]="128" [level]="'M'"></qrcode>
          </div>
        </div>
    </div>
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
export class allBoxesQRModalContent {
  loading = false;
  error = '';
  inputData: any;
  RepeatArr = Array;
  

  staticAlertClosed = false;
  successMessage: string;

  constructor(public activeModal: NgbActiveModal) {}

    ngOnInit() {

    }

    returnString(obj){
      return JSON.stringify(obj)
    }


}


export const snapshotToArray = snapshot => {
  let returnArr = [];

  snapshot.forEach(childSnapshot => {
      let item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
  });

  return returnArr;
};

