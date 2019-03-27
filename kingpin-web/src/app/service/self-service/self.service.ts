import {Injectable} from "@angular/core";
import {User} from 'kingpin-common';
import {LOCAL_STRORAGE_USER_KEY} from "../../util/constants";

@Injectable()
export class SelfService {

  mySelf():User {
    let json:string = localStorage.getItem(LOCAL_STRORAGE_USER_KEY);
    if (json) {
      return <User>JSON.parse(json);
    }
    return undefined;
  }

  saveMyself(u:User) {
    localStorage.setItem(LOCAL_STRORAGE_USER_KEY, JSON.stringify(u));
  }

}
