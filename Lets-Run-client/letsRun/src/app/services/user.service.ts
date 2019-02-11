import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";

import { environment } from "../../environments/environment"
import { UserModel } from "../models/user.model";
import { Subject } from "rxjs";
import { SnackBarService } from "../services/snack-bar.service";
import { AuthService } from "../services/auth.service";
import { routerNgProbeToken } from "@angular/router/src/router_module";


const BACKEND_URL = environment.apiUrl;

@Injectable({providedIn: "root"})
export class UserService {

    private userId: string;
    private user: UserModel;
    private userListener = new Subject<{user: UserModel}>();
    private userFriends: UserModel;
    private userFriendsListener = new Subject<{userFreinds: UserModel}>();

    constructor(private http: HttpClient,
       private route: Router,
       private authService: AuthService,
       private snackBarService: SnackBarService) {}

      getUserId() {
        return this.userId;
      }

      getUser() {
        return this.user;
      }

      getUserListener() {
        return this.userListener.asObservable()
      }

      getUserInfo(user_id: string, queryPage: string){

        const queryParams = `?info=${queryPage}`
        const userId = user_id;

         return  this.http
        .get<{user: UserModel }>(BACKEND_URL + '/users/' + userId + queryParams)
        .subscribe(user => {

          this.user = user.user
          this.userListener.next({
            user: this.user
          })
        },
        error => {
          this.route.navigate(['/404']);
        }
        );

    }

    getPrivateUserInfo(user_id: string){
      const userId = user_id;
       return  this.http
      .get<{user: UserModel }>(BACKEND_URL + '/users/privateEvents/' + userId)
  }

    friendManipulating(user_id: string) {
      return this.http.get(BACKEND_URL + "/users/" + user_id + '/friend_manipulation')
                 .subscribe(result => {

                  this.getUserInfo(user_id, '');
                 })
    }

    deleteUser(user_id: string) {
      return this.http.delete(BACKEND_URL + '/users/' + user_id + '/delete_user')
            .subscribe(result => {
              this.authService.logout();
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

        this.http.put(BACKEND_URL + "/users/" + "add_avatar", avatarData).subscribe(result => { this.getUserInfo(id, '') });

        }

        userGetResetToken(email: string) {
          const data = { email: email}
          this.http.post(BACKEND_URL + "/users/" + "reset/password", data)
              .subscribe(result => {
                this.snackBarService.showMessageWithDuration('Message with instruction send to email addres',  'ok', 3000);
                this.route.navigate(['/']);
              });
        }

        userGetChangePassword(token: string) {
         return this.http.get<{ passwordToken: string, userId: string }>(BACKEND_URL + "/users/get_change/password/" + token);
        }

        changePassword(resetToken: string, userId: string, password: string) {
          const data = { resetToken: resetToken,  userId: userId, password: password }
          return this.http.post(BACKEND_URL + '/users/change_password', data)
        }

    }
