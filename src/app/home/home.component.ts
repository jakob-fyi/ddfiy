import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { DataService } from '../data/data.service';
import { Location } from '@angular/common';

@Component({
  selector: 'ddf-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  public state: 'unauthorized' | 'authorizing' | 'accessing' | 'loading' | 'ready' = 'unauthorized';

  constructor(public auth: AuthService, public data: DataService, private location: Location) {

    let state: any = this.location.getState();

    // Clear State
    this.location.replaceState(window.location.pathname, undefined, { fromAuthorizationCallback: false });

    if (state?.fromAuthorizationCallback) {
      console.log("[ddfiy] [Home] Coming from Authorization Callback --> Tokens already received");
      this.receiveAndPrepareData().catch((err) => console.error(err));
      return;
    }

    if (this.auth.isInitialized()) {
      console.log("[ddfiy] [Home] Application already initialized and User authorized --> Only refreshing Tokens");
      this.accessing()
        .then(() => this.receiveAndPrepareData())
        .catch((err) => console.error(err));
    }
  }

  public async initalizeApp(): Promise<void> {
    if (this.auth.isInitialized()) {
      await this.accessing();
      await this.receiveAndPrepareData();
    }
  }

  public async authorize(): Promise<void> {
    console.log("[ddfiy] [Home] Start authorizing Process");
    this.state = 'authorizing';
    setTimeout(async () => await this.auth.startAuthorizingProcess(), 500);
  }

  public async accessing(): Promise<void> {
    console.log("[ddfiy] [Home] Start accessing");
    this.state = 'accessing';
    await this.auth.refreshAccessToken();
  }

  public async receiveAndPrepareData(): Promise<void> {
    console.log("[ddfiy] [Home] Starting receiving and preparing Data");

    this.state = 'loading';
    await this.data.getAlbums();
    this.data.categorizeAlbums();
    this.data.useFilter();
    this.state = 'ready';
  }

  public getRandom(): void {
    console.log("[ddfiy] [Home] Get Random Item");
    this.data.selectRandom();
  }
}
