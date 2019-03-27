import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators, AbstractControl, ValidationErrors} from '@angular/forms';
import {StartupService, Config} from "../../service/startup-service/startup.service";
import {first, map} from 'rxjs/operators';
import {RegistrationService} from "../../service/registration-service/registration.service";
import {User, Result} from 'kingpin-common';
import {AbstractService} from "../../service/abstract.service";
import {MessageService} from "primeng/api";

export function equalPassword(): (control: AbstractControl)=>ValidationErrors | null {
  return (control: AbstractControl)=> {
    let formGroup:FormGroup = <FormGroup>control;
    let password1:string = formGroup.controls['password'].value;
    let password2:string = formGroup.controls['confirmPassword'].value;
    if (password1 == password2) {
      return null;
    }
    return <ValidationErrors>{"equalPassword":true};
  }
}


@Component({
  templateUrl:'./register.page.html',
  styleUrls:['./register.page.scss']
})
export class RegisterPage extends AbstractService implements OnInit, AfterViewInit {

  formControlEmail:FormControl;
  formControlName:FormControl;
  formControlPassword:FormControl;
  formControlConfirmPassword:FormControl;
  formGroup:FormGroup;

  config:Config;

  ready:boolean;

  constructor(private formBuilder:FormBuilder,
              private registrationService:RegistrationService,
              protected startupService:StartupService,
              protected messageService:MessageService) {
    super(messageService, startupService);
    this.formControlEmail = formBuilder.control("", [Validators.required, Validators.email]);
    this.formControlName = formBuilder.control("", [Validators.required]);
    this.formControlPassword = formBuilder.control("", [Validators.required]);
    this.formControlConfirmPassword = formBuilder.control("", [Validators.required]);
    this.formGroup = formBuilder.group({
        "email": this.formControlEmail,
        "name": this.formControlName,
        "password": this.formControlPassword,
        "confirmPassword": this.formControlConfirmPassword
    }, {validator: equalPassword()});
    this.ready = false;
    this.startupService.observable
      .pipe(
        first(),
        map((r:Config)=>{
          this.config = r;
          this.ready = true;
        })
      ).subscribe()
  }

  onSubmit(event:Event) {
    this.registrationService.register(<User>{
      email: this.formControlEmail.value,
      name: this.formControlName.value,
      password: this.formControlPassword.value
    }).pipe(
      map((r:Result<User>)=>{
        super.publish(r);
      })
    ).subscribe();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }


}
