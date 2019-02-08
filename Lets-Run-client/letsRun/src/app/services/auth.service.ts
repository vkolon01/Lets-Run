import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";

import { environment } from "../../environments/environment"

import { AuthData } from "../models/auth-data.model";
import { SnackBarService } from "./snack-bar.service";

const BACKEND_URL = environment.apiUrl; 

@Injectable({providedIn: "root"})
export class AuthService {
    private isAuthenticated = false;
    private token: string;
    private tokenTimer: any;
    private userId: string;
    private userRole: string;
    private authStatusListener = new Subject<boolean>();
    private userIdListener = new Subject<string>();
    private registeredListener = new Subject<boolean>();
    private username: string;
    private usernameListener = new Subject<string>();
    constructor(private http: HttpClient, private router: Router, private snackBarService: SnackBarService) {}

    getToken() {
        return this.token;
      }
    
      getIsAuth() {
        return this.isAuthenticated;
      }
    
      getUserId() {
        return this.userId;
      }

      getUserRole() {
        return this.userRole;
      }
    
      getAuthStatusListener() {
        return this.authStatusListener.asObservable();
      }

      getRegisteredListener() {
        return this.registeredListener.asObservable();
      }

      getUserIdListener() {
        return this.userIdListener.asObservable();
      }

      getUserNameListener() {
        return this.usernameListener.asObservable();
      }

      getUsername() {
        return this.username;
      }



      createUser(email: string, password: string, validatePassword: string, username: string, firstName: string, lastName: string, dob: Date) {
        const authData: AuthData = { email: email, password: password, validatePassword: validatePassword, username: username, firstName: firstName, lastName: lastName, dob: dob };
       this.http.post(BACKEND_URL + "/users/register", authData).subscribe(
          () => {
            this.registeredListener.next(true);
            this.login(email, password);
            this.router.navigate(["/"]);
          },
          error => {
            this.registeredListener.next(false);
            this.authStatusListener.next(false);
          }
        );
      }

      login(email: string, password: string) {
        const authData = { email: email, password: password };
        return this.http.post<{ token: string; expiresIn: number; username: string; userId: string, role: string }>(BACKEND_URL + "/users/sign_in", authData)
            .subscribe(response => {
                const token = response.token;
                this.token = token;

                if (token) {
                  const expiresInDuration = response.expiresIn;
                  this.setAuthTimer(expiresInDuration);
                  this.isAuthenticated = true;
                  this.userId = response.userId;
                  this.userRole = response.role;
                  this.authStatusListener.next(true);
                  this.username = response.username;
                  this.usernameListener.next(response.username);
                  this.userIdListener.next(response.userId);
                  const now = new Date();
                  const expirationDate = new Date(
                    now.getTime() + expiresInDuration * 1000
                  );
                  // console.log(expirationDate);
                  this.saveAuthData(token, expirationDate, this.userId, this.username, this.userRole);
                  this.snackBarService.showMessageWithDuration('Welcome ' + this.username + '!', 'OK', 3000);
                  this.router.navigate(["/"]);
                }
              },
              error => {
                this.authStatusListener.next(false);
              });
      }


      authenticateUser(userToken: string) {
      return  this.http.get(BACKEND_URL + "/users/authenticate/" + userToken);
      }



      autoAuthUser() {
        const authInformation = this.getAuthData();
        if (!authInformation) {
          return;
        }
        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        if (expiresIn > 0) {
          this.token = authInformation.token;
          this.isAuthenticated = true;
          this.userId = authInformation.userId;
          this.userRole = authInformation.userRole;
          this.setAuthTimer(expiresIn / 1000);
          this.authStatusListener.next(true);
          this.userIdListener.next(authInformation.userId);
          this.usernameListener.next(authInformation.username);
        }
      }
    
      logout() {
        this.snackBarService.showMessageWithDuration('Good by!', 'OK', 3000);
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        this.userIdListener.next(null);        
        this.userId = null;
        this.userRole = null;
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(["/"]);
      }
    
      private setAuthTimer(duration: number) {
        this.tokenTimer = setTimeout(() => {
          this.logout();
        }, duration * 1000);
      }
    
      private saveAuthData(token: string, expirationDate: Date, userId: string, username: string, userRole: string) {
        localStorage.setItem("token", token);
        localStorage.setItem("expiration", expirationDate.toISOString());
        localStorage.setItem("userId", userId);
        localStorage.setItem("userRole", userRole);
        localStorage.setItem("username", username);
      }
    
      private clearAuthData() {
        localStorage.removeItem("token");
        localStorage.removeItem("expiration");
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        localStorage.removeItem("username");
      }
    
      private getAuthData() {
        const token = localStorage.getItem("token");
        const expirationDate = localStorage.getItem("expiration");
        const userId = localStorage.getItem("userId");
        const username = localStorage.getItem("username");
        const userRole = localStorage.getItem("userRole");
        if (!token || !expirationDate) {
          return;
        }
        return {
          token: token,
          expirationDate: new Date(expirationDate),
          userId: userId,
          username: username,
          userRole: userRole
        };
      }


}