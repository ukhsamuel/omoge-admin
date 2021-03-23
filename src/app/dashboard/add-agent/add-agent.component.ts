import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import 'rxjs/Rx';
import { AuthenticationService } from '../../_services';
import {RestService} from "../../_services/rest.service";
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-add-agent',
  templateUrl: './add-agent.component.html',
  styleUrls: ['./add-agent.component.css']
})
export class AddAgentComponent implements OnInit {
	dataForm: FormGroup;
	loading = false;
	submitted = false;
	error = '';
	processing = false;
	// inputData = {
	// 	name: "andrew",
	// 	email: "andrew@gmail.com",
	// 	phone: "080202882",
	// 	role: "agent"
	// };

	inputData = {
		name: "",
		email: "",
		phone: "",
		role: "agent"
	};

  // End the Closeable Alert
  // This is for the self closing alert
  private _message = new Subject<string>();

  staticAlertClosed = false;
  responseMessage: string;
  messageType:any;

	// pattern for email validatiom
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

	
  constructor(
  		private rest: RestService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService
        ) 
  {
    // set up Alert
    setTimeout(() => (this.staticAlertClosed = true), 20000);

    this._message.subscribe(message => (this.responseMessage = message));
    this._message.pipe(debounceTime(5000)).subscribe(() => (this.responseMessage = null));

  }

    ngOnInit() {
      // Initialize form with Validation rules
        this.dataForm = this.formBuilder.group({
            name: ['', Validators.required],
            phone: ['', Validators.required],
            email: ['', Validators.required]
        });

    }

    // convenience getter for easy access to form fields
    get f() { return this.dataForm.controls; }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.dataForm.invalid) {
            return;
        }

        console.log(this.inputData);

        this.processing = true;
        this.rest.addAgent(this.inputData)
            .map(res => res.json())
            .subscribe(
                data => {
                    console.log(data);
                    this.submitted = false;
                    this.processing = false;
                      if(data.status == "00"){
                        this.messageType = 'success';
                        this._message.next(`${data.message}`);
                         
                        this.inputData = {
                          name: "",
                          email: "",
                          phone: "",
                          role: "agent"
                        };
                      }else{
                        data.message = this.rest.processErrorMessages(data.message);
                        this.messageType = 'danger';
                        this._message.next(`${data.message}`);
                      }
                },
                error => {
                	console.log(error);
                    this.error = error;
                    this.loading = false;
                    this.processing = false;
                });
    }

}
