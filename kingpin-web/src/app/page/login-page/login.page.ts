import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {LoginService} from "../../service/login-service/login.service";
import {Result, User} from 'kingpin-common';
import {map} from "rxjs/operators";
import {AbstractService} from "../../service/abstract.service";
import {MessageService} from "primeng/api";
import {StartupService} from "../../service/startup-service/startup.service";


@Component({
  templateUrl:'./login.page.html',
  styleUrls:['./login.page.scss']
})
export class LoginPage extends AbstractService {

  formControlEmail:FormControl;
  formControlPassword:FormControl;
  formGroup:FormGroup;

  constructor(private router:Router,
              private formBuilder:FormBuilder,
              private loginService:LoginService,
              protected startupService:StartupService,
              protected messageService:MessageService) {
    super(messageService, startupService);
    this.formControlEmail = formBuilder.control("", [Validators.required, Validators.email]);
    this.formControlPassword = formBuilder.control("", [Validators.required]);
    this.formGroup = formBuilder.group({
      "email": this.formControlEmail,
      "password": this.formControlPassword
    });
  }

  onRegisterClicked(event:Event) {
    this.router.navigate(["/general", "register"]);
  }

  onSubmit(event:Event) {
    this.loginService.login(this.formControlEmail.value, this.formControlPassword.value)
      .pipe(
        map((r:Result<User>)=>{
          if (r.status == "success") {
            this.router.navigate(["/user", "board-listings"]);
          } else {
            super.publish(r);
          }
        })
      ).subscribe();
  }

}
