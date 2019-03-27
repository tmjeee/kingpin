import {Component, Input} from '@angular/core';
import {Player, PlayerShallowCopy} from 'kingpin-common/dist/index';
import {environment} from 'src/environments/environment';


@Component({
  selector:'avatar-component',
  templateUrl:'./avatar.component.html',
  styleUrls:['./avatar.component.scss']
})
export class AvatarComponent {

  @Input() player:PlayerShallowCopy;

  host:string;

  constructor() {
    this.host = environment.host;
  }

}
