import { BrowserModule } from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule, Provider} from '@angular/core';

import {AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BoardService} from "./service/board-service/board.service";
import {MessageService} from "primeng/primeng";
import {LoginService} from "./service/login-service/login.service";
import {StartupService} from "./service/startup-service/startup.service";
import {RegistrationService} from "./service/registration-service/registration.service";
import {ProfileService} from "./service/profile-service/profile.service";
import {CookieService} from "ngx-cookie-service";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {SecurityInterceptor} from "./interceptor/security-interceptor/security.interceptor";
import {JwtTokenGuard} from "./guard/jwt-token-guard/jwt-token.guard";
import {BoardListingService} from "./service/board-listing-service/board-listing.service";
import {SelfService} from "./service/self-service/self.service";
import {WsServerMessagesService} from "./service/ws-server-messages-service/ws-server-messages.service";

export function initStartupService(startupService:StartupService):()=>void {
  return ()=>{
    startupService.init();
  }
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    //OverlayPanelModule,
    //CardModule,
  ],
  providers: [
    <Provider>{ provide:BoardService, useClass:BoardService},
    <Provider>{ provide:BoardListingService, useClass:BoardListingService},
    <Provider>{ provide:LoginService, useClass:LoginService},
    <Provider>{ provide:MessageService, useClass:MessageService},
    <Provider>{ provide:RegistrationService, useClass:RegistrationService},
    <Provider>{ provide:ProfileService, useClass:ProfileService },
    <Provider>{ provide:CookieService, useClass:CookieService},
    <Provider>{ provide:JwtTokenGuard, useClass:JwtTokenGuard},
    <Provider>{ provide:StartupService, useClass:StartupService},
    <Provider>{ provide:SelfService, useClass:SelfService},
    <Provider>{ provide:WsServerMessagesService, useClass:WsServerMessagesService },
    <Provider>{ provide:APP_INITIALIZER, useFactory: initStartupService, deps:[StartupService], multi: true},
    <Provider>{ provide:HTTP_INTERCEPTORS, useClass: SecurityInterceptor, multi:true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
