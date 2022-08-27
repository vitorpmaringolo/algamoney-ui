import { environment } from './../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LogoutService {
  tokensRevokeUrl: string = '';

  constructor(private http: HttpClient, private auth: AuthService) {
    this.tokensRevokeUrl = `${environment.apiUrl}/tokens/revoke`;
  }

  logout() {
    return firstValueFrom(
      this.http.delete(this.tokensRevokeUrl, { withCredentials: true })
    ).then(() => {
      this.auth.limparAccessToken();
    });
  }
}
