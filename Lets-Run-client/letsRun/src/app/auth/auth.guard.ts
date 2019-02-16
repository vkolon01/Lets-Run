import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router
  } from "@angular/router";
  import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
  import { Observable } from "rxjs";
  
  import { AuthService } from "../services/auth.service";
import { MatDialog, MatDialogConfig } from "@angular/material";
import { LoginComponent } from "./login/login.component";
import { isPlatformBrowser, isPlatformServer } from "@angular/common";
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, 
                private router: Router, 
                private dialog: MatDialog,
                @Inject(PLATFORM_ID) private platformId: Object) {}
  
    canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
    ): boolean | Observable<boolean> | Promise<boolean> {
      
      // if (isPlatformBrowser(this.platformId)) {
        const isAuth = this.authService.getIsAuth();
        if(isAuth) {
          return isAuth;
        } else if (!isAuth) {
          this.router.navigate(['/events']);
        }
        return isAuth;
    //  }    
     
    //  if (isPlatformServer(this.platformId)) {
    //   return true;
    // }



    }


    onLogin() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "80%";
        dialogConfig.height = "50%";
    
        this.dialog.open(LoginComponent, dialogConfig);
      }
  }