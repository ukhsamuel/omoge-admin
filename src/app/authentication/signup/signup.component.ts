import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../../_services';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

	signupForm: FormGroup;
	loading = false;
	submitted = false;
	returnUrl: string;
	error = '';
	recoverform = false;
	// registerCredentials = {
	// 	name: "James bond",
	// 	role: "manufacturer",
	// 	email: "tapeam.ent@gmail.com",
	// 	password: "1111",
	// 	password2: "1111",
	// 	phone: "",
	// };
	registerCredentials = {
		name: "",
		role: "manufacturer",
		email: "",
		password: "",
		password2: "",
		phone: "",
	};
	
  constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService
        ) {

  }

    ngOnInit() {
        this.signupForm = this.formBuilder.group({
            name: ['', Validators.required],
            role: ['', Validators.required],
            email: ['', Validators.required],
            phone: ['', Validators.required],
            // termscheck: ['', Validators.requiredTrue],
            password: ['', Validators.required],
            password2: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

	  validEmail() {
	    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return re.test(this.registerCredentials.email);
	  }

    // convenience getter for easy access to form fields
    get f() { return this.signupForm.controls; }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.signupForm.invalid) {
            return;
        }

        console.log(this.registerCredentials);

        this.loading = true;
        this.authenticationService.signup(this.registerCredentials)
            .pipe(first())
            .subscribe(
                data => {
                    this.registerCredentials = {
                                                name: "",
                                                role: "",
                                                email: "",
                                                password: "",
                                                password2: "",
                                                phone: "",
                                            };
                    this.router.navigate(['/authentication/login']);
                },
                error => {
                	console.log(error);
                    this.error = error;
                    this.loading = false;
                });
    }

}
