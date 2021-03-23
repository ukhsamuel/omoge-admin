import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../../_services';
import {RestService} from "../../../_services/rest.service";

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit {

	passwordForm: FormGroup;
	loading = false;
	submitted = false;
	returnUrl: string;
	error = '';
	newCredentials = {
		password: "1111",
		password2: "1111",
	};
  recoverform = false;

  constructor( 
  		private rest: RestService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService) { }

  ngOnInit() {
        this.passwordForm = this.formBuilder.group({
            password: ['', Validators.required],
            password2: ['', Validators.required]
        });
  }
    get f() { return this.passwordForm.controls; }

  logout(){
    this.authenticationService.logout();
    // this.router.navigate(['/']);
  }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.passwordForm.invalid) {
            return;
        }

        console.log(this.newCredentials);

        this.loading = true;
        this.rest.changePassword(this.newCredentials)
            .pipe(first())
            .subscribe(
                data => {
                    this.newCredentials = {
                                            password: "",
                                            password2: "",
                                            };
				    this.authenticationService.logout();

                    this.router.navigate(['/authentication/login']);
                },
                error => {
                	console.log(error);
                    this.error = error;
                    this.loading = false;
                });
    }
}
