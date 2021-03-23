import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType } from  '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {Headers, Http} from "@angular/http";
import { Response } from '@angular/http';

import { User } from '../_models';
import { Router, ActivatedRoute } from '@angular/router';
import {BASE_URL} from "../_providers/config/config";

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
        private currentUserSubject: BehaviorSubject<User>;
        public currentUser: Observable<User>;

        private BASE_URL = BASE_URL;
        private headers: Headers = new Headers({'Content-Type': 'application/json'});
        private headers_formdata: Headers = new Headers({'Content-Type': undefined});

    constructor(
        private http: HttpClient,
        private httpClient: HttpClient,
        private route: ActivatedRoute,
        private httpc:Http,
        private router: Router) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('omogeCurrentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }


    // login(email: string, password: string) {
    //     const url = `${this.BASE_URL}api/v1/auth/signin`;

    //     return this.http.post<any>(url, { email, password })
    //         .pipe(map(user => {
    //             // login successful if there's a jwt token in the response
    //             if (user && user.token) {
    //                 console.log(user);
    //                     // store user details and jwt token in local storage to keep user logged in between page refreshes
    //                     localStorage.setItem('omogeCurrentUser', JSON.stringify(user));
    //                     this.currentUserSubject.next(user);
    //                     return {status: 1};
    //             }

    //         }));
    // }

    login(email: string, password: string): Observable<any> {
	    // const userToken: string = 'Bearer ' + this.authenticationService.currentUserValue.access_token;
        const url = `${this.BASE_URL}api/v1/auth/signin`;
        this.headers = new Headers({'Content-Type': 'application/json'});
        
	    // this.headers.append('Authorization', userToken);
	    // return this.httpc.post(url, { email, password } ,{headers: this.headers});
        // return this.httpc.post(url, { email, password } ,{headers: this.headers});
        // return this.httpc.post(url, { email, password }, this.headers).map((resp: Response) => resp.json());
        return this.httpc.post(url,{ email, password },{ headers: this.headers})
        .pipe(map((res: Response) => {
            console.log(res.json().data)
            let resp = res.json().data;
            if (resp && resp.token) {
                console.log(resp);
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('omogeCurrentUser', JSON.stringify(resp));
                    this.currentUserSubject.next(resp);
                    return {status: 1};
            }

          }));
	}

    signup(registrationData) {
        const url = `${this.BASE_URL}api/auth/signup`;

        // return this.http.post<any>(`/users/authenticate`, { username, password })
        return this.http.post<any>(url, registrationData)
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                // if (user && user.access_token) {
                //     // store user details and jwt token in local storage to keep user logged in between page refreshes
                //     localStorage.setItem('currentUser', JSON.stringify(user));
                //     this.currentUserSubject.next(user);
                // }

                // return user;
            }));
    }

    /**
     * Add product
     *
     * @param data Product
     * @return Response
     */


	updatePhoto(data): Observable<any> {
	    const userToken: string = 'Bearer ' + this.currentUserValue.access_token;
        const url = `${this.BASE_URL}api/product/create`;
	    this.headers = new Headers({'Content-Type': 'application/json'});
	    this.headers.append('Authorization', userToken);
        return this.httpc.post(url, data ,{headers: this.headers})
	}

    public upload(img) {
        let data = {'photo': img};
        // console.log(data)
        // let uploadURL = `${this.SERVER_URL}/auth/${userId}/avatar`;
	    const userToken: string = 'Bearer ' + this.currentUserValue.access_token;
        const url = `${this.BASE_URL}api/auth/update-profile-photo`;
	    this.headers = new Headers({'Content-Type': 'application/json'});
	    this.headers.append('Authorization', userToken);
        
        return this.httpc.post(url, data ,{headers: this.headers})
            .map(res => {
                this.loadUserProfile()
            })
      }

    loadUserProfile(){
        let data = {'photo': 'img'};

	    const userToken: string = 'Bearer ' + this.currentUserValue.access_token;
        const url = `${this.BASE_URL}api/auth/user`;
	    this.headers = new Headers({'Content-Type': 'application/json'});
	    this.headers.append('Authorization', userToken);
        return this.httpc.post(url,data,{headers: this.headers})
                .map(res => {
                    let response = res.json();
                    this.currentUserValue.user = response;
                    this.currentUserSubject.next(this.currentUserValue);
                    localStorage.setItem('currentUser', JSON.stringify(this.currentUserValue));

                })
                .catch((error:any) => Observable.throw(error.json().error || 'Server error')) //...errors if
                .subscribe();
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('omogeCurrentUser');
        this.currentUserSubject.next(null);
        this.router.navigate(['/authentication/login']);
            // window.location.reload();
    }
}