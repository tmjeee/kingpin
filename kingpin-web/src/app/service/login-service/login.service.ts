import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpResponse, } from "@angular/common/http";
import {map} from 'rxjs/operators';
import {Result, User} from 'kingpin-common';
import {Observable} from 'rxjs';
import {CookieService} from "ngx-cookie-service";
import {COOKIE_JWT_TOKEN, HTTP_HEADER_JWT_TOKEN} from "kingpin-common";
import {LOCAL_STRORAGE_USER_KEY} from "../../util/constants";
import {environment} from 'src/environments/environment';

@Injectable()
export class LoginService {

  constructor(private httpClient:HttpClient,
              private cookieService:CookieService){}


  login(email:string, password:string):Observable<Result<User>> {
    return this.httpClient.post<Result<User>>(
      environment.host+"login",
      { email: email, password: password },
      {withCredentials:true, observe: "response"})
      .pipe(
        map((r:HttpResponse<Result<User>>)=>{
          console.log("&&&& login response headers", r.headers);
          if (r.body.status == "success") {
            this.cookieService.set(COOKIE_JWT_TOKEN, r.headers.get(HTTP_HEADER_JWT_TOKEN));
            localStorage.setItem(LOCAL_STRORAGE_USER_KEY, JSON.stringify(r.body.payload));
          } else {
            this.cookieService.delete(COOKIE_JWT_TOKEN)
            localStorage.removeItem(LOCAL_STRORAGE_USER_KEY);
          }
          return r.body;
        })
      );
  }
}
