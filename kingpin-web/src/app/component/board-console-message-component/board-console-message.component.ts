import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {WsReplyMessage} from "../../service/ws-server-messages-service/ws-server-messages.service";
import {observable, Observable, Subscription, Subscriber} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector:'board-console-message',
  templateUrl:'./board-console-message.component.html',
  styleUrls:['./board-console-message.component.scss']
})
export class BoardConsoleMessageComponent implements OnInit, OnDestroy {

  @Input() observable:Observable<WsReplyMessage>;

  wsMessages:WsReplyMessage[];
  subscription:Subscription;

  readonly THRESHOLD:number = 100;

  constructor() {
    this.wsMessages = [];
  }

  ngOnInit(): void {
    this.subscription = this.observable
      .pipe(
        map((m:WsReplyMessage)=>{
          this.wsMessages.push(m);
          while(this.wsMessages.length>this.THRESHOLD) {
            this.wsMessages.shift();
          }
        })
      ).subscribe();
  }

  ngOnDestroy(): void {
    this.subscription && this.subscription.unsubscribe();
  }

}
