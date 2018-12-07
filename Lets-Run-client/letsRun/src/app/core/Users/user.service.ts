import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { Injectable } from "@angular/core";

import { environment } from "../../../environments/environment"
import { UserModel } from "src/app/models/user.model";


const BACKEND_URL = environment.apiUrl; 

@Injectable({providedIn: "root"})
export class UserService {
    private userId: string;
    private user: UserModel;

    constructor(private http: HttpClient, private router: ActivatedRoute) {}

      getUserId() {
        return this.userId;
      }

      getUser() {
        return this.user;
      }

      getUserInfo(user_id: string){
        const userId = user_id;
      return  this.http
        .get<{user: {_id:string, email: string, username: string, imagePath: string, firstName: string, lastName: string, createdAt: Date, dob: Date }}>(BACKEND_URL + '/users/' + userId);

    }

}