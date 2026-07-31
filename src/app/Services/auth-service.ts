import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { storeData, loginData } from '../models/model';
import { env_variable } from '../environment/environment';
import { CookieService } from 'ngx-cookie-service';
import { map } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  cookieService = inject(CookieService);
  router = inject(Router)

  showInvalidLogin = signal<boolean>(false);
  url = env_variable.SERVER_URL

  constructor(private http: HttpClient) { }

  storeSignup(data: storeData) {
    return this.http.post<any>(this.url + '/api/enrollstore', data)
  }

  storeLogin(data: loginData) {
    return this.http.post<any>(this.url + '/auth/login', data).pipe(
      map((res) => {
        this.cookieService.set("store_id", res.store_id, { path: '/' })
        this.cookieService.set("access_token", res.access_token, { path: '/' })
        return res;
      })
    )
  }

  storeLogout() {
    this.cookieService.delete("store_id", '/')
    this.cookieService.delete("access_token", '/')
    this.router.navigate(['/login'])
    return true;
  }

  requestPasswordReset(email: string) {
    return this.http.post<{ message: string }>(this.url + '/auth/password-reset/request', { email });
  }

  updatePassword(accessToken: string, newPassword: string) {
    return this.http.post<{ message: string }>(this.url + '/auth/password-reset/confirm', {
      accessToken: accessToken,
      newPassword: newPassword
    });
  }

}
