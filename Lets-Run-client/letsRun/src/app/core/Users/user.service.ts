import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";

import { environment } from "../../../environments/environment"
import { UserModel } from "src/app/models/user.model";
import { Subject } from "rxjs";


const BACKEND_URL = environment.apiUrl; 

@Injectable({providedIn: "root"})
export class UserService {
  
    private userId: string;
    private user: UserModel;
    private userListener = new Subject<{user: UserModel}>();

    constructor(private http: HttpClient, private route: Router) {}

      getUserId() {
        return this.userId;
      }

      getUser() {
        return this.user;
      }

      getUserListener() {
        return this.userListener.asObservable()
      }

      getUserInfo(user_id: string){
        const userId = user_id;
      return  this.http
        .get<{user: UserModel }>(BACKEND_URL + '/users/' + userId)
        .subscribe(user => {
          this.user = user.user
          this.userListener.next({
            user: this.user
          })
        });

    }

    freindManipulating(user_id: string) {
      return this.http.get(BACKEND_URL + "/users/" + user_id + '/freind_manipulation')
                 .subscribe(result => {
                  this.route.navigate(["/events"]);
                 })
    }

    deleteUser(user_id: string) {
      return this.http.delete(BACKEND_URL + '/users/' + user_id + '/delete_user')
            .subscribe(result => {
              this.route.navigate(["/events"]);
            })
    }

    uploadAvatar(id: string, image: File | string) {
      let avatarData: string | FormData;

        if(typeof image === "object") {
          avatarData = new FormData();
          avatarData.append("image", image, id );
        } else {
          return;
        }

        this.http.put(BACKEND_URL + "/users/" + "add_avatar", avatarData).subscribe(result => { this.getUserInfo(id) });

        } 
    }