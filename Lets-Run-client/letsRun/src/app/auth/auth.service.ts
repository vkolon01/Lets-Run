import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";

import { environment } from "../../environments/environment"

import { AuthData } from "./auth-data.model";

const BACKEND_URL = environment.apiUrl; 

@Injectable({providedIn: "root"})
export class AuthService {
    private isAuthenticated = false;
    private token: string;
    private tokenTimer: any;
    private userId: string;
    private authStatusListener = new Subject<boolean>();
    private userIdListener = new Subject<string>();
    private username: string;
  
    constructor(private http: HttpClient, private router: Router) {}

    getToken() {
        return this.token;
      }
    
      getIsAuth() {
        return this.isAuthenticated;
      }
    
      getUserId() {
        return this.userId;
        
      }
    
      getAuthStatusListener() {
        return this.authStatusListener.asObservable();
      }

      getUserIdListener() {
        return this.userIdListener.asObservable();
      }

      getUsername() {
        return this.username;
      }

      createUser(email: string, password: string, username: string, firstName: string, lastName: string, dob: Date) {
        const authData: AuthData = { email: email, password: password, username: username, firstName: firstName, lastName: lastName, dob: dob };
        this.http.post(BACKEND_URL + "/users/register", authData).subscribe(
          () => {
            this.router.navigate(["/"]);
          },
          error => {
            this.authStatusListener.next(false);
          }
        );
      }

      login(email: string, password: string) {
        const authData = { email: email, password: password };
        this.http.post<{ token: string; expiresIn: number; username: string; userId: string }>(BACKEND_URL + "/users/sign_in", authData)
            .subscribe(response => {
                const token = response.token;
                this.token = token;
                if (token) {
                  const expiresInDuration = response.expiresIn;
                  this.setAuthTimer(expiresInDuration);
                  this.isAuthenticated = true;
                  this.userId = response.userId;
                  this.authStatusListener.next(true);
                  this.username = response.username;
                  this.userIdListener.next(response.userId);
                  const now = new Date();
                  const expirationDate = new Date(
                    now.getTime() + expiresInDuration * 1000
                  );
                  // console.log(expirationDate);
                  this.saveAuthData(token, expirationDate, this.userId);
                  this.router.navigate(["/"]);
                }
              },
              error => {
                this.authStatusListener.next(false);
              });
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
          this.setAuthTimer(expiresIn / 1000);
          this.authStatusListener.next(true);
          this.userIdListener.next(authInformation.userId);
        }
      }
    
      logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        this.userIdListener.next(null);        
        this.userId = null;
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(["/"]);
      }
    
      private setAuthTimer(duration: number) {
        console.log("Setting timer: " + duration);
        this.tokenTimer = setTimeout(() => {
          this.logout();
        }, duration * 1000);
      }
    
      private saveAuthData(token: string, expirationDate: Date, userId: string) {
        localStorage.setItem("token", token);
        localStorage.setItem("expiration", expirationDate.toISOString());
        localStorage.setItem("userId", userId);
      }
    
      private clearAuthData() {
        localStorage.removeItem("token");
        localStorage.removeItem("expiration");
        localStorage.removeItem("userId");
      }
    
      private getAuthData() {
        const token = localStorage.getItem("token");
        const expirationDate = localStorage.getItem("expiration");
        const userId = localStorage.getItem("userId");
        if (!token || !expirationDate) {
          return;
        }
        return {
          token: token,
          expirationDate: new Date(expirationDate),
          userId: userId
        };
      }


}