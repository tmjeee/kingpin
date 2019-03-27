import {Injectable} from '@angular/core';
import {StartupService, Config} from "../startup-service/startup.service";
import {first, map} from 'rxjs/operators';
import {HttpClient} from "@angular/common/http";
import {User} from "kingpin-common";
import {Result} from "kingpin-common";
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';


@Injectable()
export class RegistrationService {


  constructor(protected startupService:StartupService,
              private httpClient:HttpClient) { }

  register(user:User):Observable<Result<User>> {
    let url:string = environment.host+"register";
    return this.httpClient.post(url, user)
      .pipe(
        map((r:Result<User>)=>{
          return r;
        })
      );
  }

}
