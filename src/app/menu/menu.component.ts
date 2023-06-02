import { Component } from '@angular/core';

@Component({
  selector: 'ddf-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  public menuHidden: boolean = true;

  public openMenu = () => this.menuHidden = false;
  public closeMenu = () => this.menuHidden = true;
}
