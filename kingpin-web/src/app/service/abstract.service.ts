
import {Result, WsServerMessage_Reply} from "kingpin-common";
import {Message, MessageService} from "primeng/api";
import {StartupService, Config} from './startup-service/startup.service';
import {first, map} from 'rxjs/operators';

export class AbstractService {

  constructor(protected messageService:MessageService,
              protected startupService:StartupService) { }


  clear() {
    this.messageService.clear();
  }

  publish(r:Result<any>) {
    this.messageService.add(<Message> {
      severity: r.status,
      summary: r.status,
      detail: r.message
    });
  }

  publishWsReply(r:WsServerMessage_Reply) {
    this.messageService.add(<Message> {
      severity: r.status,
      summary: r.status,
      detail: r.message
    });
  }

  whenConfigReady(callback:(config?:Config)=>void) {
    this.startupService.observable
      .pipe(
        first(),
        map((c:Config)=>callback(c))
      ).subscribe()
  }
}
