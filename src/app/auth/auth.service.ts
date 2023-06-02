import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private clientId = "a13fd97860de41eaaf328fab777d5b54";
  private redirectUri = `${window.location.origin}/callback`;
  private authEndpoint = "https://accounts.spotify.com";

  constructor(private http: HttpClient) { }

  public isInitialized(): boolean {
    return localStorage.getItem('access_token') !== null && localStorage.getItem('refresh_token') !== null;
  }

  public async startAuthorizingProcess(): Promise<void> {
    let codeVerifier = this.generateRandomString(128);

    await this.generateCodeChallenge(codeVerifier).then(codeChallenge => {
      let state = this.generateRandomString(16);
      let scope = '';

      localStorage.setItem('code_verifier', codeVerifier);

      let args = new URLSearchParams({
        response_type: 'code',
        client_id: this.clientId,
        scope: scope,
        redirect_uri: this.redirectUri,
        state: state,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge
      });

      window.location.href = `${this.authEndpoint}/authorize?${args}`;
    });
  }

  public async requestAccessToken(code: string): Promise<void> {
    console.log("[ddfiy] [AuthService] Request Access Token");

    return new Promise((resolve, reject) => {

      let codeVerifier = localStorage.getItem('code_verifier');

      const body = new URLSearchParams();
      body.set("grant_type", "authorization_code");
      body.set("code", code);
      body.set("redirect_uri", this.redirectUri);
      body.set("client_id", this.clientId);
      body.set("code_verifier", codeVerifier ?? "");

      this.http.post(`${this.authEndpoint}/api/token`,
        body.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).subscribe((data: any) => {
          console.log("[ddfiy] [AuthService] Received Tokens, storing them in local storage");
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('refresh_token', data.refresh_token);
          resolve();
        });
    });
  }

  public async refreshAccessToken(): Promise<void> {
    console.log("[ddfiy] [AuthService] Refresh Access Token");

    return new Promise((resolve, reject) => {
      const body = new URLSearchParams();
      body.set("grant_type", "refresh_token");
      body.set("refresh_token", localStorage.getItem('refresh_token') ?? "");
      body.set("client_id", this.clientId);

      this.http.post(`${this.authEndpoint}/api/token`,
        body.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).subscribe((data: any) => {
          console.log("[ddfiy] [AuthService] Received Tokens, storing them in local storage");
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('refresh_token', data.refresh_token);
          resolve();
        });
    });
  }

  private generateRandomString(length: number) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  private async generateCodeChallenge(codeVerifier: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);

    return this.encodeBase64(digest);
  }

  private async encodeBase64(input: ArrayBuffer): Promise<string> {
    return (await this.base64_arraybuffer(input)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  }

  private async base64_arraybuffer(data: ArrayBuffer): Promise<string> {
    const base64url: string = await new Promise((r) => {
      const reader = new FileReader()
      reader.onload = () => r(reader.result as string)
      reader.readAsDataURL(new Blob([data]))
    })
    return base64url.split(",", 2)[1]
  }
}
