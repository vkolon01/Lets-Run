import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";



const BACKEND_URL = environment.apiUrl;

@Injectable({ providedIn: "root" })
export class EmailContactService {


    constructor(private http: HttpClient) {}


    contactUsMessage(email: string, subject: string, message: string, fullName: string) {
        const infoToSend = { email, subject, message, fullName}
     return this.http.post(BACKEND_URL + "/messages/contactUs", infoToSend);
    }

}