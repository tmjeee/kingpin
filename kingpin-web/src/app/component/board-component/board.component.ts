import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  SimpleChange,
  ViewChild,
  AfterViewInit, OnDestroy
} from "@angular/core";
import {
  Item,
  Player,
  Movement,
  Confirmation,
  Auction,
  Mortgage,
  OfferSale,
  AcceptSale,
  Board,
  ID_FREE_PARKING,
  ID_STRAND,
  ID_CHANCE_1,
  ID_FLEET_STREET,
  ID_TRAFALGAR_SQUARE,
  ID_FENCHURCH_STREET_STATION,
  ID_LEICESTER_SQUARE,
  ID_COVENTRY_STREET,
  ID_WATER_WORKS,
  ID_PICCADILLY,
  ID_GO_TO_JAIL,
  ID_VINE_STREET,
  ID_REGENT_STREET,
  ID_MALBOROUGH_STREET,
  ID_OXFORD_STREET,
  ID_COMMUNITY_CHESS_1,
  ID_COMMUNITY_CHESS_2,
  ID_BOW_STREET,
  ID_BOND_STREET,
  ID_MARYLEBONE_STATION,
  ID_LIVERPOOL_STREET_STATION,
  ID_NORTHUMBERLAND_AVENUE,
  ID_CHANCE_2,
  ID_WHITEHALL,
  ID_PARK_LANE,
  ID_ELECTRIC_COMPANY,
  ID_SUPERTAX,
  ID_PALL_MALL,
  ID_MAYFAIR,
  ID_JUST_VISITING_OR_JAIL,
  ID_PENTONVILLE_ROAD,
  ID_EUSTON_ROAD,
  ID_CHANCE_3,
  ID_THE_ANGLE_ISLINGTON,
  ID_KING_CROSS_STATION,
  ID_INCOME_TAX,
  ID_WHITECHAPEL_ROAD,
  ID_COMMUNITY_CHESS_3,
  ID_OLD_KENT_ROAD,
  ID_GO,
  PlayerShallowCopy
} from "kingpin-common/dist/index";
import {ItemComponent, ItemComponentClickedEvent} from "../item-component/item.component";

@Component({
  selector:'board-component',
  templateUrl: './board.component.html',
  styleUrls:['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {

  ITEM_FREE_PARKING:Item;
  ITEM_STRAND:Item;
  ITEM_CHANCE_1:Item;
  ITEM_FLEET_STREET:Item;
  ITEM_TRAFALGAR_SQUARE:Item;
  ITEM_FENCHURCH_STREET_STATION:Item;
  ITEM_LEICESTER_SQUARE:Item;
  ITEM_COVENTRY_STREET:Item;
  ITEM_WATER_WORKS:Item;
  ITEM_PICCADILLY:Item;
  ITEM_GO_TO_JAIL:Item;
  ITEM_VINE_STREET:Item;
  ITEM_REGENT_STREET:Item;
  ITEM_MALBOROUGH_STREET:Item;
  ITEM_OXFORD_STREET:Item;
  ITEM_COMMUNITY_CHESS_1:Item;
  ITEM_COMMUNITY_CHESS_2:Item;
  ITEM_BOW_STREET:Item;
  ITEM_BOND_STREET:Item;
  ITEM_MARYLEBONE_STATION:Item;
  ITEM_LIVERPOOL_STREET_STATION:Item;
  ITEM_NORTHUMBERLAND_AVENUE:Item;
  ITEM_CHANCE_2:Item;
  ITEM_WHITEHALL:Item;
  ITEM_PARK_LANE:Item;
  ITEM_ELECTRIC_COMPANY:Item;
  ITEM_SUPERTAX:Item;
  ITEM_PALL_MALL:Item;
  ITEM_MAYFAIR:Item;
  ITEM_JUST_VISITING_OR_JAIL:Item;
  ITEM_PENTONVILLE_ROAD:Item;
  ITEM_EUSTON_ROAD:Item;
  ITEM_CHANCE_3:Item;
  ITEM_THE_ANGLE_ISLINGTON:Item;
  ITEM_KING_CROSS_STATION:Item;
  ITEM_INCOME_TAX:Item;
  ITEM_WHITECHAPEL_ROAD:Item;
  ITEM_COMMUNITY_CHESS_3:Item;
  ITEM_OLD_KENT_ROAD:Item;
  ITEM_GO:Item;

  @ViewChild("item_go") itemGo:ItemComponent;
  @ViewChild("item_old_kent_road") itemOldKentRoad:ItemComponent;
  @ViewChild("item_community_chess_3") itemCommunityChess3:ItemComponent;
  @ViewChild("item_whitechapel_road") itemWhitechapelRoad:ItemComponent;
  @ViewChild("item_income_tax") itemIncomeTax:ItemComponent;
  @ViewChild("item_king_cross_station")itemKingCrossStation:ItemComponent;
  @ViewChild("item_the_angle_islington")itemTheAngleIslington:ItemComponent;
  @ViewChild("item_chance_3")itemChance3:ItemComponent;
  @ViewChild("item_euston_road")itemEustonRoad:ItemComponent;
  @ViewChild("item_pentonville_road")itemPentonvilleRoad:ItemComponent;
  @ViewChild("item_just_visiting_or_jail")itemJustVisitingOrJail:ItemComponent;
  @ViewChild("item_mayfair")itemMayFair:ItemComponent;
  @ViewChild("item_pall_mall")itemPallMall:ItemComponent;
  @ViewChild("item_supertax")itemSupertax:ItemComponent;
  @ViewChild("item_electric_company")itemElectricCompany:ItemComponent;
  @ViewChild("item_park_lane")itemParkLane:ItemComponent;
  @ViewChild("item_whitehall")itemWhitehall:ItemComponent;
  @ViewChild("item_chance_2")itemChance2:ItemComponent;
  @ViewChild("item_northumberland_avenue")itemNorthumberlandAvenue:ItemComponent;
  @ViewChild("item_liverpool_street_station")itemLiverpoolStreetStation:ItemComponent;
  @ViewChild("item_marylebone_station")itemMaryleboneStation:ItemComponent;
  @ViewChild("item_bond_street")itemBondStreet:ItemComponent;
  @ViewChild("item_bow_street")itemBowStreet:ItemComponent;
  @ViewChild("item_community_chess_2")itemCommunityChess2:ItemComponent;
  @ViewChild("item_community_chess_1")itemCommunityChess1:ItemComponent;
  @ViewChild("item_oxford_street")itemOxfordStreet:ItemComponent;
  @ViewChild("item_malborough_street")itemMalboroughStreet:ItemComponent;
  @ViewChild("item_regent_street") itemRegentStreet:ItemComponent;
  @ViewChild("item_vine_street")itemVineStreet:ItemComponent;
  @ViewChild("item_go_to_jail")itemGoToJail:ItemComponent;
  @ViewChild("item_piccadilly")itemPiccadilly:ItemComponent;
  @ViewChild("item_water_works")itemWaterWorks:ItemComponent;
  @ViewChild("item_coventry_street")itemCoventryStreet:ItemComponent;
  @ViewChild("item_leicester_square")itemLeicesterSquare:ItemComponent;
  @ViewChild("item_fenchurch_street_station")itemFenchurchStreetStation:ItemComponent;
  @ViewChild("item_trafalgar_square")itemTrafalgarSquare:ItemComponent;
  @ViewChild("item_fleet_street")itemFleetStreet:ItemComponent;
  @ViewChild("item_chance_1")itemChance1:ItemComponent;
  @ViewChild("item_strand")itemStrand:ItemComponent;
  @ViewChild("item_free_parking")itemFreeParking:ItemComponent;

  @Input() board:Board;
  @Input() movement:Movement;
  @Input() confirmation:Confirmation;
  @Input() auction:Auction;
  @Input() mortgage:Mortgage;
  @Input() offerSale:OfferSale;
  @Input() acceptSale:AcceptSale;

  // map (key value pairs)
  _itemComponents:{[itemId:string]:ItemComponent}={};
  _items:{[itemId:string]:Item}={};
  _players:{[playerId:number]:PlayerShallowCopy}={};

  // tasks to be executed
  _movements:Movement[]=[];
  _confirmations:Confirmation[]=[];
  _auctions:Auction[]=[];
  _mortgages:Mortgage[]=[];
  _offerSales:OfferSale[]=[];
  _acceptSales:AcceptSale[]=[];

  selectedItem:Item;

  ngOnInit(): void {
    this.board.players.forEach((player:PlayerShallowCopy)=>{
      this._players[player._id] = player;
    });

    this._items = this.board.items;

    this.ITEM_FREE_PARKING = this.board.items[ID_FREE_PARKING];
    this.ITEM_STRAND= this.board.items[ID_STRAND];
    this.ITEM_CHANCE_1= this.board.items[ID_CHANCE_1];
    this.ITEM_FLEET_STREET= this.board.items[ID_FLEET_STREET];
    this.ITEM_TRAFALGAR_SQUARE= this.board.items[ID_TRAFALGAR_SQUARE];
    this.ITEM_FENCHURCH_STREET_STATION= this.board.items[ID_FENCHURCH_STREET_STATION];
    this.ITEM_LEICESTER_SQUARE= this.board.items[ID_LEICESTER_SQUARE];
    this.ITEM_COVENTRY_STREET= this.board.items[ID_COVENTRY_STREET];
    this.ITEM_WATER_WORKS= this.board.items[ID_WATER_WORKS];
    this.ITEM_PICCADILLY= this.board.items[ID_PICCADILLY];
    this.ITEM_GO_TO_JAIL= this.board.items[ID_GO_TO_JAIL];
    this.ITEM_VINE_STREET= this.board.items[ID_VINE_STREET];
    this.ITEM_REGENT_STREET= this.board.items[ID_REGENT_STREET];
    this.ITEM_MALBOROUGH_STREET= this.board.items[ID_MALBOROUGH_STREET];
    this.ITEM_OXFORD_STREET= this.board.items[ID_OXFORD_STREET];
    this.ITEM_COMMUNITY_CHESS_1= this.board.items[ID_COMMUNITY_CHESS_1];
    this.ITEM_COMMUNITY_CHESS_2= this.board.items[ID_COMMUNITY_CHESS_2];
    this.ITEM_BOW_STREET= this.board.items[ID_BOW_STREET];
    this.ITEM_BOND_STREET= this.board.items[ID_BOND_STREET];
    this.ITEM_MARYLEBONE_STATION= this.board.items[ID_MARYLEBONE_STATION];
    this.ITEM_LIVERPOOL_STREET_STATION= this.board.items[ID_LIVERPOOL_STREET_STATION];
    this.ITEM_NORTHUMBERLAND_AVENUE = this.board.items[ID_NORTHUMBERLAND_AVENUE];
    this.ITEM_CHANCE_2= this.board.items[ID_CHANCE_2];
    this.ITEM_WHITEHALL= this.board.items[ID_WHITEHALL];
    this.ITEM_PARK_LANE= this.board.items[ID_PARK_LANE];
    this.ITEM_ELECTRIC_COMPANY= this.board.items[ID_ELECTRIC_COMPANY];
    this.ITEM_SUPERTAX= this.board.items[ID_SUPERTAX];
    this.ITEM_PALL_MALL= this.board.items[ID_PALL_MALL];
    this.ITEM_MAYFAIR= this.board.items[ID_MAYFAIR];
    this.ITEM_JUST_VISITING_OR_JAIL= this.board.items[ID_JUST_VISITING_OR_JAIL];
    this.ITEM_PENTONVILLE_ROAD= this.board.items[ID_PENTONVILLE_ROAD];
    this.ITEM_EUSTON_ROAD= this.board.items[ID_EUSTON_ROAD];
    this.ITEM_CHANCE_3= this.board.items[ID_CHANCE_3];
    this.ITEM_THE_ANGLE_ISLINGTON= this.board.items[ID_THE_ANGLE_ISLINGTON];
    this.ITEM_KING_CROSS_STATION= this.board.items[ID_KING_CROSS_STATION];
    this.ITEM_INCOME_TAX= this.board.items[ID_INCOME_TAX];
    this.ITEM_WHITECHAPEL_ROAD= this.board.items[ID_WHITECHAPEL_ROAD];
    this.ITEM_COMMUNITY_CHESS_3= this.board.items[ID_COMMUNITY_CHESS_3];
    this.ITEM_OLD_KENT_ROAD= this.board.items[ID_OLD_KENT_ROAD];
    this.ITEM_GO= this.board.items[ID_GO];
  }

  ngOnDestroy(): void {
    if (this.tasksExecutionTimeoutId) {
      clearTimeout(this.tasksExecutionTimeoutId);
    }
  }

  ngAfterViewInit(): void {
    this._itemComponents[this.itemGo.item._id] = this.itemGo;
    this._itemComponents[this.itemOldKentRoad.item._id] = this.itemOldKentRoad;
    this._itemComponents[this.itemCommunityChess3.item._id] = this.itemCommunityChess3;
    this._itemComponents[this.itemWhitechapelRoad.item._id] = this.itemWhitechapelRoad;
    this._itemComponents[this.itemIncomeTax.item._id] = this.itemIncomeTax;
    this._itemComponents[this.itemKingCrossStation.item._id] = this.itemKingCrossStation;
    this._itemComponents[this.itemTheAngleIslington.item._id] = this.itemTheAngleIslington;
    this._itemComponents[this.itemChance3.item._id] = this.itemChance3;
    this._itemComponents[this.itemEustonRoad.item._id] = this.itemEustonRoad;
    this._itemComponents[this.itemPentonvilleRoad.item._id] = this.itemPentonvilleRoad;
    this._itemComponents[this.itemJustVisitingOrJail.item._id] = this.itemJustVisitingOrJail;
    this._itemComponents[this.itemMayFair.item._id] = this.itemMayFair;
    this._itemComponents[this.itemPallMall.item._id] = this.itemPallMall;
    this._itemComponents[this.itemSupertax.item._id] = this.itemSupertax;
    this._itemComponents[this.itemElectricCompany.item._id] = this.itemElectricCompany;
    this._itemComponents[this.itemParkLane.item._id]=this.itemParkLane;
    this._itemComponents[this.itemWhitehall.item._id]=this.itemWhitehall;
    this._itemComponents[this.itemChance2.item._id] = this.itemChance2;
    this._itemComponents[this.itemNorthumberlandAvenue.item._id] = this.itemNorthumberlandAvenue;
    this._itemComponents[this.itemLiverpoolStreetStation.item._id] = this.itemLiverpoolStreetStation;
    this._itemComponents[this.itemMaryleboneStation.item._id] = this.itemMaryleboneStation;
    this._itemComponents[this.itemBondStreet.item._id] = this.itemBondStreet;
    this._itemComponents[this.itemBowStreet.item._id] = this.itemBowStreet;
    this._itemComponents[this.itemCommunityChess2.item._id] = this.itemCommunityChess2;
    this._itemComponents[this.itemCommunityChess1.item._id] = this.itemCommunityChess1;
    this._itemComponents[this.itemOxfordStreet.item._id] = this.itemOxfordStreet;;
    this._itemComponents[this.itemMalboroughStreet.item._id]= this.itemMalboroughStreet;
    this._itemComponents[this.itemRegentStreet.item._id] = this.itemRegentStreet;
    this._itemComponents[this.itemVineStreet.item._id] = this.itemVineStreet;
    this._itemComponents[this.itemGoToJail.item._id] = this.itemGoToJail;
    this._itemComponents[this.itemPiccadilly.item._id] = this.itemPiccadilly;
    this._itemComponents[this.itemWaterWorks.item._id] = this.itemWaterWorks;
    this._itemComponents[this.itemCoventryStreet.item._id] = this.itemCoventryStreet;
    this._itemComponents[this.itemLeicesterSquare.item._id] = this.itemLeicesterSquare;
    this._itemComponents[this.itemFenchurchStreetStation.item._id] = this.itemFenchurchStreetStation;
    this._itemComponents[this.itemTrafalgarSquare.item._id]=this.itemTrafalgarSquare;
    this._itemComponents[this.itemFleetStreet.item._id] = this.itemFleetStreet;
    this._itemComponents[this.itemChance1.item._id] = this.itemChance1;
    this._itemComponents[this.itemStrand.item._id] = this.itemStrand;
    this._itemComponents[this.itemFreeParking.item._id]=this.itemFreeParking;
  }

  ngOnChanges(changes: SimpleChanges): void {
    let executeTasks:boolean = false;
    if (changes['movement']) {
      let change: SimpleChange = changes['movement'];
      let movement: Movement = change.currentValue;
      if (movement) {
        this._movements.push(movement);
        executeTasks = true;
      }
    } else if (changes["confirmation"]) {
      let change:SimpleChange = changes["confirmation"];
      let confirmation:Confirmation = change.currentValue;
      if (confirmation) {
        this._confirmations.push(confirmation);
        executeTasks = true;
      }
    } else if (changes["auction"]) {
      let change:SimpleChange = changes['auction'];
      let auction:Auction = change.currentValue;
      if (auction) {
        this._auctions.push(auction);
        executeTasks = true;
      }
    } else if (changes["mortgage"]) {
      let change:SimpleChange = changes["mortgage"];
      let mortgage:Mortgage = change.currentValue;
      if (mortgage) {
        this._mortgages.push(mortgage);
        executeTasks = true;
      }
    } else if (changes["offerSale"]) {
      let change:SimpleChange = changes["offerSale"];
      let offerSale:OfferSale = change.currentValue;
      if (offerSale) {
        this._offerSales.push(offerSale);
        executeTasks = true;
      }
    } else if (changes["acceptSale"]) {
      let change:SimpleChange = changes["acceptSale"];
      let acceptSale:AcceptSale = change.currentValue;
      if (acceptSale) {
        this._acceptSales.push(acceptSale);
        executeTasks = true;
      }
    }
    if (executeTasks) {
      this.executeTasks();
    }
  }

  onItemClicked(event:ItemComponentClickedEvent) {
    this.selectedItem = event.item;
  }

  tasksExecutionTimeoutId:number|undefined = undefined;
  movementTimeoutDuration:number = 100;

  private executeTasks() {
    console.log("*** executeTasks()");
    if (this.tasksExecutionTimeoutId == undefined) {
      this.executeActualTasks();
    }
  }

  private executeActualTasks() {
    this.executeMovements();
    this.executeConfirmations();
    this.executeAuctions();
    this.executeMortgages();
    this.executeOfferSales();
    this.executeAcceptSales();
  }


  ///////// confirmation executions

  private executeConfirmations() {
  }


  ///////// auction executions

  private executeAuctions() {

  }


  ///////// mortgage executions

  private executeMortgages() {

  }


  ///////// offer sales executions

  private executeOfferSales() {

  }


  ///////// accept sales executions

  private executeAcceptSales() {

  }


  //////// movements executions

  private executeMovements() {
    console.log("*** executeActualMovements()");
    let movement:Movement = this._movements.shift();
    if (movement) {
      let fromItem: Item = this._items[movement.fromItemId];
      let toItem: Item = this._items[movement.toItemId];
      let player: PlayerShallowCopy = this._players[movement.playerId];
      this.tasksExecutionTimeoutId = window.setTimeout(this.timeoutFnMovement(movement, fromItem, toItem, player), this.movementTimeoutDuration);
    } else {
      this.tasksExecutionTimeoutId = undefined;
    }
  }

  timeoutFnMovement(movement:Movement, fromItem:Item, toItem:Item, player:PlayerShallowCopy):()=>void {
    return ()=>{
      console.log("*** timeoutFnMovement", fromItem._id, toItem._id);
      let currentItem:Item = fromItem;
      currentItem.playerPassingByItem = player;
      currentItem.playersOnItem = currentItem.playersOnItem.filter((p:Player)=>p._id != player._id);
      let nxtItem:Item  = this._items[currentItem.nextItemId];
      let last:boolean = nxtItem._id == movement.toItemId;
      this.tasksExecutionTimeoutId = window.setTimeout(this.timeoutFnSubMovement(movement, currentItem, nxtItem, player, last), this.movementTimeoutDuration);
    }
  }


  timeoutFnSubMovement(movement:Movement, currentItem:Item, nxtItem:Item, player:PlayerShallowCopy, last:boolean):()=>void {
    return ()=>{
      console.log("*** timeoutFnSubMovement", currentItem._id, nxtItem._id);
      if (!last) {
        currentItem.playerPassingByItem = undefined;
        nxtItem.playerPassingByItem = player;
        let _nxtItem:Item  = this._items[nxtItem.nextItemId];
        let last:boolean = _nxtItem._id == movement.toItemId;
        this.tasksExecutionTimeoutId = window.setTimeout(this.timeoutFnSubMovement(movement, nxtItem, _nxtItem, player, last), this.movementTimeoutDuration);
      } else {
        currentItem.playerPassingByItem = undefined;
        nxtItem.playersOnItem.push(player);
        this.executeActualTasks();
      }
    };
  }
}

