import {Component, ViewChild, Output, EventEmitter, Input, OnInit, OnDestroy} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {WsServerMessage_Broadcast} from 'kingpin-common';
import {WsBroadcastMessage} from "../../service/ws-server-messages-service/ws-server-messages.service";

export interface WsMessage {

}

@Component({
  selector:'board-chat',
  templateUrl:'./board-chat.component.html',
  styleUrls:['./board-chat.component.scss']
})
export class BoardChatComponent implements OnInit, OnDestroy {

  @Output() events:EventEmitter<string>;

  @Input() observer:Observable<WsBroadcastMessage>;

  messages:WsBroadcastMessage[];
  message:string;
  subscription:Subscription;

  readonly THRESDHOLD:number = 100;

  constructor() {
    this.events = new EventEmitter();
    this.messages = [];
  }

  ngOnInit(): void {
    this.subscription = this.observer
      .pipe(
        map((m:WsBroadcastMessage)=>{
          this.messages.push(m);
          while(this.messages.length >= this.THRESDHOLD) {
            this.messages.shift()
          }
        })
      )
      .subscribe()
  }

  ngOnDestroy(): void {
    this.subscription && this.subscription.unsubscribe();
  }

  sendBroadcast(event:Event) {
    this.events.emit(this.message);
    this.message = '';
  }



}
