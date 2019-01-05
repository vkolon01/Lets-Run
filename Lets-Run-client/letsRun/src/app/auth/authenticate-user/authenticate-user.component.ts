import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-authenticate-user',
  templateUrl: './authenticate-user.component.html',
  styleUrls: ['./authenticate-user.component.scss', '../../global-css/global-input.scss']
})
export class AuthenticateUserComponent implements OnInit {


  constructor(private activeRoute: ActivatedRoute,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.activeRoute.params.subscribe(params => {

      this.authService.authenticateUser(params.authToken)

      setTimeout(result => {
        this.router.navigate(["/events"]);        
      }, 3000)
    })
  }

}
