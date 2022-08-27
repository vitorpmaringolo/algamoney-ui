import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LogoutService {
  tokensRevokeUrl = 'http://localhost:8080/tokens/revoke';

  constructor(private http: HttpClient, private auth: AuthService) {}

  logout() {
    return firstValueFrom(
      this.http.delete(this.tokensRevokeUrl, { withCredentials: true })
    ).then(() => {
      this.auth.limparAccessToken();
    });
  }
}
