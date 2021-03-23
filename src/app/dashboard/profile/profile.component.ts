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
import {BASE_URL} from "../../_providers/config/config";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  fileData: File = null;
  error: string;
  private BASE_URL = BASE_URL;

  public imagePath;
  imgURL: any;
  uploadResponse: any;
  profile: any;
  public message: string;
  // uploadResponse = { status: '', message: '', filePath: '' };

  dataForm: FormGroup;
  loading = false;
  submitted = false;
  processing = false;

  // End the Closeable Alert
  // This is for the self closing alert
  private _success = new Subject<string>();

  staticAlertClosed = false;
  successMessage: string;
  closeResult: string;

  // End the Closeable Alert
  // This is for the self closing alert
  private _message = new Subject<string>();
  responseMessage: string;
  messageType:any;

  constructor(
    private authenticationService: AuthenticationService,
    private _loadingBar: SlimLoadingBarService, 

  ) {
    // set up Alert
    setTimeout(() => (this.staticAlertClosed = true), 20000);

    this._message.subscribe(message => (this.responseMessage = message));
    this._message.pipe(debounceTime(5000)).subscribe(() => (this.responseMessage = null));
   }

  ngOnInit() {
    this.loadProfile()
  }

  loadProfile(){
    this._loadingBar.start();
    this.authenticationService.loadUserProfile()
    let u = this.authenticationService.currentUserValue;
    this.profile = u.user;
    console.log(u)
    this._loadingBar.complete();
  }
  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
  }
 
  preview(files) {
    if (files.length === 0)
      return;
 
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }
 
    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.imgURL = reader.result; 
      console.log(this.imgURL)
      this.uploadProfilePhoto()
    }
    // console.log(files[0])
  }

  uploadProfilePhoto(){
    this._loadingBar.start();
    this.authenticationService.upload(this.imgURL).subscribe(
      (res) => {
        this._loadingBar.complete();
        console.log(res)
        this.messageType = 'success';
        this._message.next(`update successful`);
        this.uploadResponse = res
      },
      (err) => {
        this._loadingBar.complete();
        this.error = err
      }
    );
  }
}

