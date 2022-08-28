import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

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
