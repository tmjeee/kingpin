import {Component, OnInit} from "@angular/core";
import {MenuItem, MessageService} from "primeng/api";
import {FormControl, FormGroup, FormBuilder, Validators} from "@angular/forms";
import {equalPassword} from "../register-page/register.page";
import {environment} from "../../../environments/environment";
import {AbstractService} from "../../service/abstract.service";
import {StartupService} from "../../service/startup-service/startup.service";
import {Result, User} from 'kingpin-common';
import {ProfileService} from 'src/app/service/profile-service/profile.service';
import {map} from 'rxjs/operators';
import {SelfService} from "../../service/self-service/self.service";


@Component({
  templateUrl: './profile.page.html',
  styleUrls:['./profile.page.scss']
})
export class ProfilePage extends AbstractService implements OnInit {

  myself:User;

  tabs:MenuItem[];
  activeTab:MenuItem;

  host:string;
  editAvatarDialogVisible:boolean;

  formGroupEmail:FormGroup;
  formControlEmail:FormControl;

  formGroupPassword:FormGroup;
  formControlPassword:FormControl;
  formControlConfirmPassword:FormControl;


  constructor(private formBuilder:FormBuilder,
              private profileService:ProfileService,
              private selfService:SelfService,
              protected messageService:MessageService,
              protected startupService:StartupService) {

    super(messageService, startupService);

    this.editAvatarDialogVisible = false;

    // form elements
    this.formControlEmail = formBuilder.control("", [Validators.required, Validators.email]);
    this.formGroupEmail = formBuilder.group({
      "email": this.formControlEmail
    });
    this.formControlPassword = formBuilder.control("", [Validators.required]);
    this.formControlConfirmPassword = formBuilder.control("", [Validators.required]);
    this.formGroupPassword = formBuilder.group({
      "password": this.formControlPassword,
      "confirmPassword": this.formControlConfirmPassword
    }, { validator: [equalPassword()] });


    // setup tabs
    this.tabs = [
      <MenuItem>{ label: 'Email' },
      <MenuItem>{ label: 'Password' },
      <MenuItem>{ label: 'Avatar'}
    ]
    this.activeTab = this.tabs[0];

    this.host = environment.host;
  }

  ngOnInit(): void {
    this.myself = this.selfService.mySelf();
  }


  onEditAvatar(event:Event) {
    this.editAvatarDialogVisible = true;
  }

  onAvatarUpload(event:{files:File[]}) {
    console.log("**** onAvatarUploaded", event.files);
    this.profileService.saveAvatar(event.files[0])
      .pipe(
        map((r:Result<User>)=>{
          super.publish(r);
          this.selfService.saveMyself(r.payload);
          this.myself = r.payload;
        })
      ).subscribe();
    this.editAvatarDialogVisible = false;
  }


  onEmailSubmit(event:Event) {
    this.profileService.saveEmail(this.formControlEmail.value)
      .pipe(
        map((r:Result<User>)=>{
          super.publish(r);
          this.selfService.saveMyself(r.payload);
          this.myself = r.payload;
        })
      ).subscribe()
  }

  onPasswordSubmit(event:Event) {
    this.profileService.savePassword(this.formControlPassword.value)
      .pipe(
        map((r:Result<User>)=>{
          super.publish(r);
          this.selfService.saveMyself(r.payload);
          this.myself = r.payload;
        })
      ).subscribe();

  }

}
