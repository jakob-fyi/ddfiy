import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'ddf-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent {
  constructor(private route: ActivatedRoute, private router: Router, private auth: AuthService) { }

  public async ngOnInit(): Promise<void> {
    const code = this.route.snapshot.queryParamMap.get('code');

    if (code) {
      await this.auth.requestAccessToken(code);
      await this.router.navigate(['/'], { state: { fromAuthorizationCallback: true } });
    }
  }
}
