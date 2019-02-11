import { Component, OnInit, Input } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { shrinkUpAndDownAnimationField } from '../../animations/animationsUpDown';

@Component({
  selector: 'app-send-invites',
  templateUrl: './send-invites.component.html',
  styleUrls: ['./send-invites.component.scss', '../../global-css/global-input.scss'],
  animations: [shrinkUpAndDownAnimationField] 
})
export class SendInvitesComponent implements OnInit {
  freindsInviteForm: FormGroup;
 @Input() eventOwnerId: string;
 @Input() eventId: string;
 user: UserModel;
 private usersInvited: Subscription;
 idValue;
 invitedFrieds = this.idValue;

 following_animation_state = 'up'
 followers_animation_state = 'up'
 invitedFriends;

  constructor(public userService: UserService,
    private eventService: EventService,
    private formBuilder: FormBuilder,
    private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.usersInvited = this.eventService.getUsersForPrivateEvent(this.eventId).subscribe(result => {
        this.invitedFriends = result.invitedUsers;
    });
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
    this.eventService.sendFriendsInvitesToPrivateEvent(this.eventId, this.freindsInviteForm.value)
        .subscribe(result => {
          this.usersInvited = this.eventService.getUsersForPrivateEvent(this.eventId).subscribe(result => {
            this.invitedFriends = result.invitedUsers;
        });
        });
  }

  show(field: string) {
    console.log(field);
    
    if(field === 'following') {
      this.following_animation_state = this.following_animation_state === 'down' ? 'up' : 'down';
    } else if (field === 'followers') {
      this.followers_animation_state = this.followers_animation_state === 'down' ? 'up' : 'down';
    }
    
  }


  checkIfIdincludedInInvites(userId: string) {
    // <!-- ([1,2,5].indexOf(2) > -1) -->
    if(this.invitedFriends) {
      if(this.invitedFriends.indexOf(userId) > -1) {
        return true;
      } else {
        return false;
      }
    }

  }

}
