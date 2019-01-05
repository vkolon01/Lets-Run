import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router
  } from "@angular/router";
  import { Injectable } from "@angular/core";
  import { Observable } from "rxjs";
  
  import { AuthService } from "../services/auth.service";
import { MatDialog, MatDialogConfig } from "@angular/material";
import { LoginComponent } from "./login/login.component";
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router, private dialog: MatDialog) {}
  
    canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
    ): boolean | Observable<boolean> | Promise<boolean> {
      const isAuth = this.authService.getIsAuth();
      if (!isAuth) {
        this.router.navigate(['/events']);
        this.onLogin();
      }
      return isAuth;
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