import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

const MAX_TIME:number = environment.profileMaxTime;

@Injectable()
export class ProfilingInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let d1:Date = new Date();
    let r:Observable<HttpEvent<any>> = next.handle(req);
    let d2:Date = new Date();
    let duration:number = (d2.getTime() - d1.getTime());
    if (duration > MAX_TIME) {
      console.error(`\t\t ** [Profiling][WARNING] - Time taken for request ${req.url} took ${duration}ms exceeding ${MAX_TIME}ms`);
    } else {
      console.log(`\t\t ** [Profiling][INFO] - Time taken for request ${req.url} took ${duration}ms `);
    }
    return r;
  }
}
