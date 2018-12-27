import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserModel } from 'src/app/models/user.model';
import { DialogService } from 'src/app/services/dialogService';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-freinds',
  templateUrl: './user-freinds.component.html',
  styleUrls: ['./user-freinds.component.scss']
})
export class UserFreindsComponent implements OnInit {

  user_id: string;
  private userSubscription: Subscription;
  user: UserModel;


  constructor(public userService: UserService,
    private activeRoute: ActivatedRoute,
     private authService: AuthService,
     private confirm: DialogService
     ) { }

  ngOnInit() {

    this.activeRoute.parent.paramMap.subscribe((paramMap: ParamMap) => {

      this.user_id = paramMap.get('user_id');
      

      
        this.userService.getUserInfo(this.user_id);

        this.userSubscription = this.userService.getUserListener()
            .subscribe((value: {user: UserModel}) => {
              this.user = value.user
              // console.log(this.user);

            })

  })

  
  }

}
