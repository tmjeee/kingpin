import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {Observable} from "rxjs";
import {COOKIE_JWT_TOKEN, HTTP_HEADER_JWT_TOKEN, Result} from 'kingpin-common';

@Injectable()
export class JwtTokenGuard implements CanActivate {

  constructor(private cookieService:CookieService,
              private router:Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    let jwtToken:string = this.cookieService.get(COOKIE_JWT_TOKEN);
    console.log("*** jwtToken", jwtToken);
    if (!jwtToken) {
      this.router.navigate(["/general", "login"]);
      console.log('false');
      return false;
    }

    console.log("true");
    return true;
  }
}
