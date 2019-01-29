import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment"
import { HttpClient } from "@angular/common/http";

const BACKEND_URL = environment.apiUrl;

@Injectable({providedIn: "root"})
export class WeatherService {


    constructor(private http: HttpClient) {}

    addCategory(icon: string, title: string, desc: string, category: string) {
        const dataToSend = {icon: icon, title: title, desc: desc, category: category}
        this.http.post(BACKEND_URL + "/forum/add_category", dataToSend);
    }

    getCategory() {
        this.http.get(BACKEND_URL + "/forum/get_category");
    }

}