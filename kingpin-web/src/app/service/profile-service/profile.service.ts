import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Result, User} from 'kingpin-common';
import {HttpClient} from "@angular/common/http";
import {environment} from 'src/environments/environment';


@Injectable()
export class ProfileService {


  constructor(private httpClient:HttpClient){ }

  saveAvatar(file: File): Observable<Result<User>> {
    let formData:FormData = new FormData();
    formData.append("avatar", file,  file.name);
    return this.httpClient
      .post<Result<User>>(environment.host+"profile/avatar", formData);
  }

  saveEmail(email:string):Observable<Result<User>> {
    return this.httpClient
      .post<Result<User>>(environment.host+"profile/email", {email:email});
  }

  savePassword(password:string):Observable<Result<User>> {
    return this.httpClient
      .post<Result<User>>(environment.host+"profile/password", {password:password});
  }
}
