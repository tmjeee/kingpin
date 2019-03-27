// angular
import { NgModule, Injectable } from '@angular/core';
import {
  Routes,
  RouterModule,
  Route,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

// primeng
import {AccordionModule } from "primeng/accordion";
import {AutoCompleteModule } from "primeng/autocomplete";
import {BreadcrumbModule } from "primeng/breadcrumb";
import {ButtonModule }from "primeng/button";
import {CarouselModule }from "primeng/carousel";
import {ChartModule }from "primeng/chart";
import {CheckboxModule }from "primeng/checkbox";
import {ChipsModule }from "primeng/chips";
import {CodeHighlighterModule }from "primeng/codehighlighter";
import {ColorPickerModule} from "primeng/colorpicker";
import {ConfirmDialogModule }from "primeng/confirmdialog";
import {ContextMenuModule }from "primeng/contextmenu";
import {DataGridModule }from "primeng/datagrid";
import {DataListModule }from "primeng/datalist";
import {DataScrollerModule }from "primeng/datascroller";
import {DialogModule }from "primeng/dialog";
import {DragDropModule }from "primeng/dragdrop";
import {DropdownModule }from "primeng/dropdown";
import {EditorModule }from "primeng/editor";
import {FieldsetModule }from "primeng/fieldset";
import {FileUploadModule }from "primeng/fileupload";
import {GalleriaModule }from "primeng/galleria";
import {GMapModule }from "primeng/gmap";
import {GrowlModule }from "primeng/growl";
import {InputMaskModule }from "primeng/inputmask";
import {InputSwitchModule }from "primeng/inputswitch";
import {InputTextareaModule }from "primeng/inputtextarea";
import {InputTextModule }from "primeng/inputtext";
import {KeyFilterModule } from "primeng/keyfilter";
import {LightboxModule }from "primeng/lightbox";
import {ListboxModule }from "primeng/listbox";
import {MegaMenuModule }from "primeng/megamenu";
import {MenubarModule }from "primeng/menubar";
import {MenuModule }from "primeng/menu";
import {MessagesModule }from "primeng/messages";
import {MessageModule} from "primeng/message";
import {MultiSelectModule }from "primeng/multiselect";
import {OrderListModule }from "primeng/orderlist";
import {OrganizationChartModule }from "primeng/organizationchart";
import {OverlayPanelModule }from "primeng/overlaypanel";
import {PaginatorModule }from "primeng/paginator";
import {PanelMenuModule }from "primeng/panelmenu";
import {PanelModule }from "primeng/panel";
import {PasswordModule }from "primeng/password";
import {PickListModule }from "primeng/picklist";
import {ProgressBarModule }from "primeng/progressbar";
import {RadioButtonModule }from "primeng/radiobutton";
import {RatingModule }from "primeng/rating";
import {FullCalendarModule }from "primeng/fullcalendar";
import {ScrollPanelModule }from "primeng/scrollpanel";
import {SelectButtonModule }from "primeng/selectbutton";
import {SharedModule }from "primeng/shared";
import {SidebarModule }from "primeng/sidebar";
import {SlideMenuModule }from "primeng/slidemenu";
import {SliderModule }from "primeng/slider";
import {SpinnerModule }from "primeng/spinner";
import {SplitButtonModule }from "primeng/splitbutton";
import {StepsModule }from "primeng/steps";
import {TabMenuModule }from "primeng/tabmenu";
import {TabViewModule }from "primeng/tabview";
import {TerminalModule }from "primeng/terminal";
import {TieredMenuModule }from "primeng/tieredmenu";
import {ToggleButtonModule } from "primeng/togglebutton";
import {ToolbarModule } from "primeng/toolbar";
import {TooltipModule } from "primeng/tooltip";
import {TreeModule } from "primeng/tree";
import {TreeTableModule } from "primeng/treetable";
import {TableModule} from "primeng/table";
import {CardModule} from "primeng/card";
import {DataViewModule} from "primeng/dataview";
import {TriStateCheckboxModule } from "primeng/tristatecheckbox";
import {ToastModule} from "primeng/toast";
import {CalendarModule} from "primeng/calendar";
import {BoardPage} from "./page/board-page/board.page";
import {BoardComponent} from "./component/board-component/board.component";
import {ItemComponent} from "./component/item-component/item.component";
import {AvatarComponent} from "./component/avatar-component/avatar.component";
import {NotFoundPage} from "./page/not-found-page/not-found.page";
import {BoardListingsPage} from "./page/board-listings-page/board-listings.page";
import {RegisterPage} from "./page/register-page/register.page";
import {LoginPage} from "./page/login-page/login.page";
import {GeneralLayout} from "./layout/general-layout/general.layout";
import {AdminLayout} from "./layout/admin-layout/admin.layout";
import {ProfilePage} from "./page/profile-page/profile.page";
import {Result} from 'kingpin-common';
import {JwtTokenGuard} from './guard/jwt-token-guard/jwt-token.guard';
import {CreateBoardPage} from "./page/create-board-page/create-board.page";
import {UserLayout} from "./layout/user-layout/user.layout";
import {BoardPlayerTableComponent} from "./component/board-player-table-component/board-player-table.component";
import {BoardConsoleMessageComponent} from "./component/board-console-message-component/board-console-message.component";
import {BoardChatComponent} from "./component/board-chat-component/board-chat.component";


const routes: Routes = [
  <Route> { path: '', pathMatch: "full", redirectTo: '/user/board-listings'},
  <Route> { path:'general', component: GeneralLayout, children:[
      <Route> { path: 'login', component: LoginPage },
      <Route> { path: 'register', component: RegisterPage },
  ]},
  <Route> { path: 'user', component: UserLayout, children:[
      <Route> { path: 'profile', component: ProfilePage, canActivate:[JwtTokenGuard] },
      <Route> { path: 'board-listings', component: BoardListingsPage, canActivate:[JwtTokenGuard] },
      <Route> { path: 'create-board', component:CreateBoardPage, canActivate:[JwtTokenGuard]},
      <Route> { path: 'board/:boardId', component: BoardPage, canActivate:[JwtTokenGuard] },
  ]},
  <Route> { path: 'admin', component: AdminLayout, children:[
  ]},
  <Route> { path: '**', component:NotFoundPage }
];



@NgModule({
  imports: [

    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(routes, {useHash:true, enableTracing:false}),


    // primeng
    SidebarModule,
    KeyFilterModule,
    TriStateCheckboxModule,
    TableModule,
    DataViewModule,
    ScrollPanelModule,
    CardModule,
    OrganizationChartModule,
    PanelMenuModule,
    ColorPickerModule,
    CalendarModule,
    ToastModule,
    AccordionModule,
    AutoCompleteModule,
    BreadcrumbModule,
    ButtonModule,
    CarouselModule,
    FullCalendarModule,
    ChartModule,
    CheckboxModule,
    CodeHighlighterModule,
    ConfirmDialogModule,
    SharedModule,
    ContextMenuModule,
    DataGridModule,
    DataListModule,
    DataScrollerModule,
    DialogModule,
    DragDropModule,
    DropdownModule,
    EditorModule,
    FieldsetModule,
    FileUploadModule,
    GalleriaModule,
    GMapModule,
    GrowlModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    LightboxModule,
    ListboxModule,
    MegaMenuModule,
    MenuModule,
    MenubarModule,
    MessagesModule,
    MessageModule,
    MultiSelectModule,
    OrderListModule,
    OverlayPanelModule,
    PaginatorModule,
    PanelModule,
    PanelMenuModule,
    PasswordModule,
    PickListModule,
    ProgressBarModule,
    RadioButtonModule,
    RatingModule,
    SelectButtonModule,
    SlideMenuModule,
    SliderModule,
    SpinnerModule,
    SplitButtonModule,
    StepsModule,
    TabMenuModule,
    TabViewModule,
    TerminalModule,
    TieredMenuModule,
    ToggleButtonModule,
    ToolbarModule,
    TooltipModule,
    TreeModule,
    TreeTableModule,
    ChipsModule,
  ],
  declarations:[
    // pages
    BoardPage,
    BoardListingsPage,
    LoginPage,
    NotFoundPage,
    RegisterPage,
    ProfilePage,
    CreateBoardPage,

    // layouts
    GeneralLayout,
    AdminLayout,
    UserLayout,

    // components
    BoardComponent,
    ItemComponent,
    AvatarComponent,
    BoardPlayerTableComponent,
    BoardConsoleMessageComponent,
    BoardChatComponent,
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
