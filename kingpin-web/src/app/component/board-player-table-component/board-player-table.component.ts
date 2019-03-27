import {Component, Input} from "@angular/core";
import {Player} from "@angular/core/src/render3/interfaces/player";
import {User} from 'kingpin-common';


@Component({
  selector: 'board-player-table',
  templateUrl: './board-player-table.component.html',
  styleUrls:['./board-player-table.component.scss']
})
export class BoardPlayerTableComponent {

  @Input() players:Player[];
  @Input() myself:Player;

}
