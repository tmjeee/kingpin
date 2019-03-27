import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, ReplaySubject } from "rxjs";

export interface Config {
  host:string;
}


@Injectable()
export class StartupService {

  public static config:Config;

  private subject:ReplaySubject<Config>;
  observable:Observable<Config>;

  constructor(private httpClient:HttpClient) {
    this.subject = new ReplaySubject(1);
    this.observable = this.subject.asObservable();
  }


  init() {
    return new Promise<void>((resolve, reject)=>{
      this.httpClient
        .get("assets/config.json")
        .toPromise()
        .then((r:Config)=>{
          StartupService.config = r;
          this.subject.next(StartupService.config);
          resolve();
        }).catch((e:Error)=>reject(e));
    });
  }


}
