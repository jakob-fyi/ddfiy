import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public typeFilter = [{
    slug: 'regular-episode',
    label: 'Reguläre Folgen',
    enabled: true
  }, {
    slug: 'special-episode',
    label: 'Sonderfolgen & Sonstiges',
    enabled: true
  }, {
    slug: 'live',
    label: 'Live',
    enabled: true
  }, {
    slug: 'headphones-episode',
    label: 'Kopfhörer Hörspiele',
    enabled: true
  }, {
    slug: 'audiobook',
    label: 'Hörbücher',
    enabled: true
  }, {
    slug: 'xmas',
    label: 'Adventkalender Folgen',
    enabled: true
  }, {
    slug: 'film',
    label: 'Filme',
    enabled: true
  }];

  private ignoreIds = [
    "3L3ztKRWI0d7JwZga12WCb"
  ];

  private liveIds = [
    "4uJPgDMOIRfoAumwwmpRbR",
    "4KXnXnpFRnQsjeZHpNC7X9"
  ];

  private xmasIds = [
    "5u2wd0lYukcINw8dUFCREq",
    "7ynXpeQRwzqKiv8WVh7c7B",
    "2qFuUJMx8w4VEO0Zdf8jFJ",
    "5iobM2gNVymvP8XqnRnHVR"
  ];

  private filmIds = [
    "67Ipucoa0blx27O3sV7yAi",
    "0sCs2S5YTEN0UT1fwWpvKw",
    "59WTBKsGdomSgMztadw3uL",
    "5DyZvpTRRE0ObKVXkJu6wy"
  ];

  public selected: any;
  public maxLimit: number = 50;

  public albums: any = null;
  public filtredListOfAlbums: Array<any> = [];

  private apiEndpoint = 'https://api.spotify.com/v1';
  private ddfArtistId = '3meJIgRw7YleJrmbpbJK6S';

  constructor(private http: HttpClient) { }

  public async getAlbums(offset: number = 0): Promise<void> {

    console.log("[ddfiy] [DataService] Loading next possibly 50 Albums, already loaded: ", offset)

    return new Promise((resolve, reject) => {
      const accessToken = localStorage.getItem('access_token');

      this.http.get(`${this.apiEndpoint}/artists/${this.ddfArtistId}/albums`, {
        params: {
          limit: this.maxLimit,
          offset
        },
        headers: {
          Authorization: 'Bearer ' + accessToken
        }
      }).subscribe(async (data: any) => {
        if (!this.albums) {
          this.albums = data;
        }
        else {
          this.albums.items = this.albums.items.concat(data.items);
        }

        if (data.next) {
          await this.getAlbums(data.offset + data.limit);
        }
        resolve();
      });
    });
  }

  public categorizeAlbums() {
    console.log("[ddfiy] [DataService] Starting categorize Albums");

    const folgenRegex = new RegExp('([0-9][0-9][0-9])\/|Folge [0-9][0-9][0-9]:')

    this.albums.items.forEach((album: any) => {

      if (this.ignoreIds.indexOf(album.id) >= 0) {
        album.type = "ignore";
      } else if (this.xmasIds.indexOf(album.id) >= 0) {
        album.type = "xmas";
      } else if (this.liveIds.indexOf(album.id) >= 0) {
        album.type = "live";
      } else if (this.filmIds.indexOf(album.id) >= 0) {
        album.type = "film";
      } else if (folgenRegex.test(album.name)) {
        album.type = "regular-episode";
      } else if ((album.name.indexOf('liest') > -1) && (album.name.indexOf('...') > -1)) {
        album.type = "audiobook";
      } else if (album.name.indexOf('Kopfhörer-Hörspiel') > -1) {
        album.type = "headphones-episode";
      } else {
        album.type = "special-episode";
      }
    });
  }

  private isEnabledTypeSlug(slug: any): boolean {
    return this.typeFilter.find(f => f.slug == slug)?.enabled ?? false;
  }

  public useFilter() {
    this.filtredListOfAlbums = this.albums.items.filter((a: any) => this.isEnabledTypeSlug(a.type));
  }

  public toggleTypeFilter(typeFilter: any) {

    typeFilter.enabled = !typeFilter.enabled;

    this.useFilter();
  }

  public selectRandom() {
    this.selected = this.filtredListOfAlbums[Math.floor(Math.random() * this.filtredListOfAlbums.length)]

    console.log("[ddfiy] [DataService] Selected Random", this.selected);
  }
}
