import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse} from '@angular/common/http';
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {map, tap} from "rxjs/operators";
import {HTTP_HEADER_JWT_TOKEN} from "kingpin-common";


@Injectable()
export class SecurityInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let _req:HttpRequest<any> = req.clone({
      withCredentials: true
    });

    return next.handle(_req)
      .pipe(
        tap((e:HttpEvent<any>)=>{
          if (e instanceof HttpResponse) {
            let _e:HttpResponse<any> = <HttpResponse<any>> e;
            console.log("&&&&&&&&&&&& intercept headers", _e.headers.get(HTTP_HEADER_JWT_TOKEN), _e.headers);
          }
        })
      );
  }
}
