import { Injectable } from '@angular/core';
import {Headers, Http} from "@angular/http";
import { HttpClientModule } from '@angular/common/http';
import {Observable} from 'rxjs';    
import {BASE_URL} from "../_providers/config/config";
import {API_V1} from "../_providers/config/config";
import { AuthenticationService } from '../_services';

@Injectable({
  providedIn: 'root'
})
export class RestService {

private BASE_URL = BASE_URL;
private API_V1 = API_V1;
private headers: Headers = new Headers({'Content-Type': 'application/json'});
private headers_formdata: Headers = new Headers({'Content-Type': undefined});

  constructor(
		private httpc:Http,
		private authenticationService: AuthenticationService
		) { }


	/* //////////////////////////////////
		Change password API 
	   //////////////////////////////////
	*/


    /**
     * Add product
     *
     * @param data Product
     * @return Response
     */


	changePassword(data): Observable<any> {
	    const userToken: string = 'Bearer ' + this.authenticationService.currentUserValue.access_token;
        const url = `${this.BASE_URL}api/auth/update-password`;
	    this.headers = new Headers({'Content-Type': 'application/json'});
	    this.headers.append('Authorization', userToken);
	    return this.httpc.post(url, data ,{headers: this.headers});
	}



    /**
     * Display a list of drivers.
     *
     * @return Driver
     */


	 getDrivers():Observable<any>{
	    const userToken: string = 'Bearer ' + this.authenticationService.currentUserValue.token;
        const url = `${this.BASE_URL}${this.API_V1}/admin/drivers`;
	    this.headers = new Headers({'Content-Type': 'application/json'});
	    this.headers.append('Authorization', userToken);
	    return this.httpc.get(url,{headers: this.headers}); 
	}
    /**
     * Display a list of drivers.
     *
     * @return Driver
     */


	getRiders():Observable<any>{
	    const userToken: string = 'Bearer ' + this.authenticationService.currentUserValue.token;
        const url = `${this.BASE_URL}${this.API_V1}/admin/riders`;
	    this.headers = new Headers({'Content-Type': 'application/json'});
	    this.headers.append('Authorization', userToken);
	    return this.httpc.get(url,{headers: this.headers}); 
	}
    /**
     * Display a list of drivers.
     *
     * @return Driver
     */


	 getOngoingTrips():Observable<any>{
	    const userToken: string = 'Bearer ' + this.authenticationService.currentUserValue.token;
        const url = `${this.BASE_URL}${this.API_V1}/admin/trips/active`;
	    this.headers = new Headers({'Content-Type': 'application/json'});
	    this.headers.append('Authorization', userToken);
	    return this.httpc.get(url,{headers: this.headers}); 
	}


	getCompletedTrips():Observable<any>{
	    const userToken: string = 'Bearer ' + this.authenticationService.currentUserValue.token;
        const url = `${this.BASE_URL}${this.API_V1}/admin/trips/completed`;
	    this.headers = new Headers({'Content-Type': 'application/json'});
	    this.headers.append('Authorization', userToken);
	    return this.httpc.get(url,{headers: this.headers}); 
	}


	getCancelledTrips():Observable<any>{
	    const userToken: string = 'Bearer ' + this.authenticationService.currentUserValue.token;
        const url = `${this.BASE_URL}${this.API_V1}/admin/trips/cancelled`;
	    this.headers = new Headers({'Content-Type': 'application/json'});
	    this.headers.append('Authorization', userToken);
	    return this.httpc.get(url,{headers: this.headers}); 
	}


	getDriverPayoutRequests():Observable<any>{
	    const userToken: string = 'Bearer ' + this.authenticationService.currentUserValue.token;
        const url = `${this.BASE_URL}${this.API_V1}/admin/drivers/payment/pending`;
	    this.headers = new Headers({'Content-Type': 'application/json'});
	    this.headers.append('Authorization', userToken);
	    return this.httpc.get(url,{headers: this.headers}); 
	}


	getDriverProcessedRequests():Observable<any>{
	    const userToken: string = 'Bearer ' + this.authenticationService.currentUserValue.token;
        const url = `${this.BASE_URL}${this.API_V1}/admin/drivers/payment/processed`;
	    this.headers = new Headers({'Content-Type': 'application/json'});
	    this.headers.append('Authorization', userToken);
	    return this.httpc.get(url,{headers: this.headers}); 
	}


	getDriverDocuments(id):Observable<any>{
	    const userToken: string = 'Bearer ' + this.authenticationService.currentUserValue.token;
        const url = `${this.BASE_URL}${this.API_V1}/admin/drivers/${id}/documents`;
	    this.headers = new Headers({'Content-Type': 'application/json'});
	    this.headers.append('Authorization', userToken);
	    return this.httpc.get(url,{headers: this.headers}); 
	}

	getDriverCarDetails(id):Observable<any>{
	    const userToken: string = 'Bearer ' + this.authenticationService.currentUserValue.token;
        const url = `${this.BASE_URL}${this.API_V1}/admin/drivers/${id}/car`;
	    this.headers = new Headers({'Content-Type': 'application/json'});
	    this.headers.append('Authorization', userToken);
	    return this.httpc.get(url,{headers: this.headers}); 
	}
	
	updateAccountActivation(data):Observable<any>{
	    const userToken: string = 'Bearer ' + this.authenticationService.currentUserValue.token;
		// let id = this.authenticationService.currentUserValue.user.id;
        const url = `${this.BASE_URL}${this.API_V1}/admin/users/${data.user_id}/`;
	    this.headers = new Headers({'Content-Type': 'application/json'});
		this.headers.append('Authorization', userToken);
		let status = {status: data.status}
		return this.httpc.put(url, status ,{headers: this.headers});

	    // return this.httpc.get(url,{headers: this.headers}); 
	}

	
	updateAccountVerification(data):Observable<any>{
	    const userToken: string = 'Bearer ' + this.authenticationService.currentUserValue.token;
		// let id = this.authenticationService.currentUserValue.user.id;
        const url = `${this.BASE_URL}${this.API_V1}/admin/drivers/${data.user_id}/documents/verify`;
	    this.headers = new Headers({'Content-Type': 'application/json'});
		this.headers.append('Authorization', userToken);
		let status = {id: data.user_id,status: data.status}
		return this.httpc.put(url, status ,{headers: this.headers});
	}
	
	updateDriverRequestTransactionStatus(data):Observable<any>{
	    const userToken: string = 'Bearer ' + this.authenticationService.currentUserValue.token;
		// let id = this.authenticationService.currentUserValue.user.id;
        const url = `${this.BASE_URL}${this.API_V1}/admin/drivers/payment/${data.id}`;
	    this.headers = new Headers({'Content-Type': 'application/json'});
		this.headers.append('Authorization', userToken);
		let status = {id: data.user_id,status: data.status}
		return this.httpc.put(url, status ,{headers: this.headers});
	}

	
	getDriverBankingDetails(id):Observable<any>{
	    const userToken: string = 'Bearer ' + this.authenticationService.currentUserValue.token;
        const url = `${this.BASE_URL}${this.API_V1}/admin/drivers/${id}/bank`;
	    this.headers = new Headers({'Content-Type': 'application/json'});
	    this.headers.append('Authorization', userToken);
	    return this.httpc.get(url,{headers: this.headers}); 
	}



	/* //////////////////////////////////
		Product CRUD API calls
	   //////////////////////////////////
	*/



    /**
     * Display a list of products.
     *
     * @return Products
     */


	getProducts():Observable<any>{
	    const userToken: string = 'Bearer ' + this.authenticationService.currentUserValue.access_token;
        const url = `${this.BASE_URL}api/product/get`;
	    this.headers = new Headers({'Content-Type': 'application/json'});
	    this.headers.append('Authorization', userToken);
	    return this.httpc.get(url,{headers: this.headers}); 
	}




    /**
     * Display a list of products by manufacturer.
     *
     * @return Products
     */


	getmManufacturerProducts(id):Observable<any>{
	    const userToken: string = 'Bearer ' + this.authenticationService.currentUserValue.access_token;
        const url = `${this.BASE_URL}api/product/manufacturer/get/${id}`;
	    this.headers = new Headers({'Content-Type': 'application/json'});
	    this.headers.append('Authorization', userToken);
	    return this.httpc.get(url,{headers: this.headers}); 
	}



    /**
     * Add product
     *
     * @param data Product
     * @return Response
     */


	addProduct(data): Observable<any> {
	    const userToken: string = 'Bearer ' + this.authenticationService.currentUserValue.access_token;
        const url = `${this.BASE_URL}api/product/create`;
	    this.headers = new Headers({'Content-Type': 'application/json'});
	    this.headers.append('Authorization', userToken);
	    return this.httpc.post(url, data ,{headers: this.headers});
	}



    /**
     * Add product
     *
     * @param data Product
     * @return Response
     */


	addBulkProducts(data): Observable<any> {
	    const userToken: string = 'Bearer ' + this.authenticationService.currentUserValue.access_token;
        const url = `${this.BASE_URL}api/product/create/bulk`;
	    this.headers = new Headers({'Content-Type': 'application/json'});
	    this.headers.append('Authorization', userToken);
	    return this.httpc.post(url, data ,{headers: this.headers});
	}



    /**
     * Update product
     *
     * @param data Product
     * @return Response 
     */


	updateProduct(data): Observable<any> {
	    const userToken: string = 'Bearer ' + this.authenticationService.currentUserValue.access_token;
        const url = `${this.BASE_URL}api/product/update`;
	    this.headers = new Headers({'Content-Type': 'application/json'});
	    this.headers.append('Authorization', userToken);
	    return this.httpc.post(url, data ,{headers: this.headers});
	}



    /**
     * Delete product
     *
     * @param data Product
     * @return Response 
     */

	deleteProduct(data): Observable<any> {
		console.log(data);
	    const userToken: string = 'Bearer ' + this.authenticationService.currentUserValue.access_token;
        const url = `${this.BASE_URL}api/product/delete/${data.id}`;
	    this.headers = new Headers({'Content-Type': 'application/json'});
	    this.headers.append('Authorization', userToken);
	    return this.httpc.delete(url ,{headers: this.headers});
	}



	/* //////////////////////////////////
		Product Batch CRUD API calls
	   //////////////////////////////////
	*/



    /**
     * Display a list of products.
     *
     * @return Products Batch
     */


	getProductBatches(filters):Observable<any>{
	    const userToken: string = 'Bearer ' + this.authenticationService.currentUserValue.access_token;
        let url = `${this.BASE_URL}api/product/batch/get`;
        if(filters)
        	url += `?product_id=${filters.product_id}`

	    this.headers = new Headers({'Content-Type': 'application/json'});
	    this.headers.append('Authorization', userToken);
	    return this.httpc.get(url,{headers: this.headers}); 
	}



    /**
     * Add product Batch
     *
     * @param data Product
     * @return Response
     */


	addProductBatch(data): Observable<any> {
	    const userToken: string = 'Bearer ' + this.authenticationService.currentUserValue.access_token;
        const url = `${this.BASE_URL}api/product/batch/create`;
	    this.headers = new Headers({'Content-Type': 'application/json'});
	    this.headers.append('Authorization', userToken);
	    return this.httpc.post(url, data ,{headers: this.headers});
	}



    /**
     * Update product Batch
     *
     * @param data Product
     * @return Response 
     */


	updateProductBatch(data): Observable<any> {
	    const userToken: string = 'Bearer ' + this.authenticationService.currentUserValue.access_token;
        const url = `${this.BASE_URL}api/product/batch/update`;
	    this.headers = new Headers({'Content-Type': 'application/json'});
	    this.headers.append('Authorization', userToken);
	    return this.httpc.post(url, data ,{headers: this.headers});
	}



    /**
     * Delete product Batch
     *
     * @param data Product
     * @return Response 
     */

	deleteProductBatch(data): Observable<any> {
		console.log(data);
	    const userToken: string = 'Bearer ' + this.authenticationService.currentUserValue.access_token;
        const url = `${this.BASE_URL}api/product/batch/delete/${data.id}`;
	    this.headers = new Headers({'Content-Type': 'application/json'});
	    this.headers.append('Authorization', userToken);
	    return this.httpc.delete(url ,{headers: this.headers});
	}




	/* //////////////////////////////////
		Middleman API calls
	   //////////////////////////////////
	*/



    /**
     * Display a list of middlemen.
     *
     * @return Middlemen
     */


	getMiddlemen():Observable<any>{
	    const userToken: string = 'Bearer ' + this.authenticationService.currentUserValue.access_token;
        const url = `${this.BASE_URL}api/auth/middlemen/get`;
	    this.headers = new Headers({'Content-Type': 'application/json'});
	    this.headers.append('Authorization', userToken);
	    return this.httpc.get(url,{headers: this.headers}); 
	}



    /**
     * Display a list of middlemen.
     *
     * @return Middlemen
     */


	getMiddlemanAssignment():Observable<any>{
	    const userToken: string = 'Bearer ' + this.authenticationService.currentUserValue.access_token;
        const url = `${this.BASE_URL}api/auth/middleman/assigments/get`;
	    this.headers = new Headers({'Content-Type': 'application/json'});
	    this.headers.append('Authorization', userToken);
	    return this.httpc.get(url,{headers: this.headers}); 
	}




    /**
     * Add middleman under user
     *
     * @param data Profile
     * @return Response
     */


	addMiddleman(data): Observable<any> {
	    const userToken: string = 'Bearer ' + this.authenticationService.currentUserValue.access_token;
        const url = `${this.BASE_URL}api/auth/add-user`;
	    this.headers = new Headers({'Content-Type': 'application/json'});
	    this.headers.append('Authorization', userToken);
	    return this.httpc.post(url, data ,{headers: this.headers});
	}



    /**
     * Remove middleman under user
     *
     * @param data Profile
     * @return Response
     */


	removeMiddleman(data): Observable<any> {
	    const userToken: string = 'Bearer ' + this.authenticationService.currentUserValue.access_token;
        const url = `${this.BASE_URL}api/auth/remove-middleman`;
	    this.headers = new Headers({'Content-Type': 'application/json'});
	    this.headers.append('Authorization', userToken);
	    return this.httpc.post(url, data ,{headers: this.headers});
	}




	/* //////////////////////////////////
		Staff API calls
	   //////////////////////////////////
	*/




    /**
     * Display a list of staff.
     *
     * @return Staff
     */


	getStaff():Observable<any>{
	    const userToken: string = 'Bearer ' + this.authenticationService.currentUserValue.access_token;
        const url = `${this.BASE_URL}api/auth/staff/get`;
	    this.headers = new Headers({'Content-Type': 'application/json'});
	    this.headers.append('Authorization', userToken);
	    return this.httpc.get(url,{headers: this.headers}); 
	}




    /**
     * Display a list of products.
     *
     * @return Products Batch
     */


	getAgents():Observable<any>{
	    const userToken: string = 'Bearer ' + this.authenticationService.currentUserValue.access_token;
        const url = `${this.BASE_URL}api/auth/agents/get`;
	    this.headers = new Headers({'Content-Type': 'application/json'});
	    this.headers.append('Authorization', userToken);
	    return this.httpc.get(url,{headers: this.headers}); 
	}




    /**
     * Add agent under user
     *
     * @param data Profile
     * @return Response
     */


	addAgent(data): Observable<any> {
	    const userToken: string = 'Bearer ' + this.authenticationService.currentUserValue.access_token;
        const url = `${this.BASE_URL}api/auth/add-user`;
	    this.headers = new Headers({'Content-Type': 'application/json'});
	    this.headers.append('Authorization', userToken);
	    return this.httpc.post(url, data ,{headers: this.headers});
	}



    /**
     * Remove agent under user
     *
     * @param data Profile
     * @return Response
     */


	removeAgent(data): Observable<any> {
	    const userToken: string = 'Bearer ' + this.authenticationService.currentUserValue.access_token;
        const url = `${this.BASE_URL}api/auth/remove-agent`;
	    this.headers = new Headers({'Content-Type': 'application/json'});
	    this.headers.append('Authorization', userToken);
	    return this.httpc.post(url, data ,{headers: this.headers});
	}



	processErrorMessages(str) {
	    var s = "";
	    for (var i in str) {
	       s += str[i] + ", ";
	    }
	    return s;
	}


	/* //////////////////////////////////
		Requests API calls
	   //////////////////////////////////
	*/

	 /**
     * Display a list of pickup requests by user.
     *
     * @return Requests
     */


	getUserPickupRequest():Observable<any>{
	    const userToken: string = 'Bearer ' + this.authenticationService.currentUserValue.access_token;
        const url = `${this.BASE_URL}api/request/pickup/get/by-user`;
	    this.headers = new Headers({'Content-Type': 'application/json'});
	    this.headers.append('Authorization', userToken);
	    return this.httpc.get(url,{headers: this.headers}); 
	}

	 /**
     * Display a list of pickup requests by user.
     *
     * @return Requests
     */


	getUserIncomingPickupRequest():Observable<any>{
	    const userToken: string = 'Bearer ' + this.authenticationService.currentUserValue.token;
        const url = `${this.BASE_URL}api/request/pickup/get/to-user`;
	    this.headers = new Headers({'Content-Type': 'application/json'});
	    this.headers.append('Authorization', userToken);
	    return this.httpc.get(url,{headers: this.headers}); 
	}


    /**
     * Request Pickup
     *
     * @param data Request
     * @return Response
     */


	requestPickup(email: string, password: string): Observable<any> {
	    // const userToken: string = 'Bearer ' + this.authenticationService.currentUserValue.access_token;
        const url = `${this.BASE_URL}api/v1/auth/signin`;
	    this.headers = new Headers({'Content-Type': 'application/json'});
	    // this.headers.append('Authorization', userToken);
	    return this.httpc.post(url, { email, password } ,{headers: this.headers});
	}

	/**
	* Display a list of delivery requests by user.
	*
	* @return Requests
	*/


   getUserDeliveries():Observable<any>{
	   const userToken: string = 'Bearer ' + this.authenticationService.currentUserValue.access_token;
	   const url = `${this.BASE_URL}api/request/delivery/get/by-user`;
	   this.headers = new Headers({'Content-Type': 'application/json'});
	   this.headers.append('Authorization', userToken);
	   return this.httpc.get(url,{headers: this.headers}); 
   }


	 /**
     * Get delivery details
     *
     * @return Delivery
     */


	viewDelivery(id):Observable<any>{
	    const userToken: string = 'Bearer ' + this.authenticationService.currentUserValue.access_token;
        const url = `${this.BASE_URL}api/request/delivery/view/${id}`;
	    this.headers = new Headers({'Content-Type': 'application/json'});
	    this.headers.append('Authorization', userToken);
	    return this.httpc.get(url,{headers: this.headers}); 
	}

    /**
     * Request Delivery
     *
     * @param data Request
     * @return Response
     */


	requestDelivery(data): Observable<any> {
	    const userToken: string = 'Bearer ' + this.authenticationService.currentUserValue.access_token;
        const url = `${this.BASE_URL}api/request/delivery/create`;
	    this.headers = new Headers({'Content-Type': 'application/json'});
	    this.headers.append('Authorization', userToken);
	    return this.httpc.post(url, data ,{headers: this.headers});
	}



    /**
     * Update product
     *
     * @param data Product
     * @return Response 
     */


	updatePickupRequestStatus(data): Observable<any> {
	    const userToken: string = 'Bearer ' + this.authenticationService.currentUserValue.access_token;
        const url = `${this.BASE_URL}api/request/delivery/status/update`;
	    this.headers = new Headers({'Content-Type': 'application/json'});
	    this.headers.append('Authorization', userToken);
	    return this.httpc.post(url, data ,{headers: this.headers});
	}





	// filterPaymentReports(filters):Observable<any>{
 //        const url = `${this.PAYMENT_BASE_URL}api/report/get?Page=1&PageSize=1000` + "&input=" + filters.input + "&startDate=" + filters.startdate + "&endDate=" + filters.enddate;
	//     this.headers = new Headers({'Content-Type': 'application/json'});
	//     return this.httpc.get(url,{headers: this.headers}); 
	// }


}
