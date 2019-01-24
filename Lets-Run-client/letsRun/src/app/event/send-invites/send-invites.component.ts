import { Component, OnInit, Input } from '@angular/core';
import { UserModel } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-send-invites',
  templateUrl: './send-invites.component.html',
  styleUrls: ['./send-invites.component.scss', '../../global-css/global-input.scss']
})
export class SendInvitesComponent implements OnInit {
  freindsInviteForm: FormGroup;
 @Input() eventOwnerId: string;
 @Input() eventId: string;
 user: UserModel;
 private userSubscription: Subscription;
 idValue;
 invitedFrieds = this.idValue;

  constructor(public userService: UserService,
    private eventService: EventService,
    private formBuilder: FormBuilder,
    private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.freindsInviteForm = this.formBuilder.group({
      friendsToInvite: this.formBuilder.array([])
    });
  }
  
  ngOnChanges() {
    
    if(this.eventOwnerId) {
      this.userService.getUserInfo(this.eventOwnerId, 'friends');
      this.userService.getUserListener()
      .subscribe((value: {user: UserModel}) => {
        this.user = value.user;
  
        console.log('this.user');
        console.log(this.user);
      });
    }
    console.log('this.invitedFrieds');
    console.log(this.invitedFrieds);
    
  }

  onChange(event) {
    const friendsToInvite = <FormArray>this.freindsInviteForm.get('friendsToInvite') as FormArray;

    if(event.checked) {
      friendsToInvite.push(new FormControl(event.source.value))
    } else {
      const i = friendsToInvite.controls.findIndex(x => x.value === event.source.value);
      friendsToInvite.removeAt(i);
    }

    console.log('this.freindsInviteForm.value');
    console.log(this.freindsInviteForm.value);
    
  }

  submit() {
    console.log('sended');
    
    this.eventService.sendFriendsInvitesToPrivateEvent(this.eventId, this.freindsInviteForm.value)
        .subscribe(result => {
          console.log(result);
          
        });
  }

}
