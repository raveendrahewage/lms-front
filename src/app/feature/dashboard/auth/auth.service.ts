import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Constant } from '../constant/constant';
import { SignInFormData } from '../models/forms';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { AuthResult } from '../models/api-response';
import { ApiResponse } from '../models/api-response';
import { SystemUser } from '../models/schemas/system-user';
import { SystemRole } from '../constant/system-user-roles';
import { NotificationService } from '../services/notification.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginUrl = Constant.API_ENDPOINT + '/account/sign-in';
  private systemUserBs = new BehaviorSubject<SystemUser | null>(null);
  currentUser$ = this.systemUserBs.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService,
    private notificationService: NotificationService,
  ) { }

  signIn(formData: SignInFormData) {
    this.cookieService.delete('token');
    return this.http
      .post<ApiResponse<AuthResult>>(this.loginUrl, formData)
      .pipe(
        map((response: ApiResponse<AuthResult>) => {
          this.systemUserBs.next(response.data?.user ?? null);
          this.cookieService.set(
            Constant.TOKEN_COOKIE_NAME,
            response.data?.token ?? ''
          );
          this.cookieService.set(
            Constant.SYSTEM_USER_COOKIE_NAME,
            JSON.stringify(response.data?.user ?? ({} as SystemUser))
          );
        })
      );
  }

  setCurrentSystemUser(systemUser: SystemUser | null, token: string | null) {
    if (this.isTokenExpired(token)) {
      return this.logout();
    }

    this.cookieService.set(
      Constant.SYSTEM_USER_COOKIE_NAME,
      JSON.stringify(systemUser)
    );
    this.systemUserBs.next(systemUser);
  }

  private isTokenExpired(token: string | null) {
    if (token) {
      const jwtToken = JSON.parse(atob(token.split('.')[1]));
      const expires = new Date(jwtToken.exp * 1000);
      return expires <= new Date();
    }
    return false;
  }

  logout() {
    this.notificationService.stopConnection();
    this.cookieService.deleteAll('/');
    this.systemUserBs.next(null);
    this.router.navigate(['/']);
  }

  getCurrentSystemUserId() {
    return this.systemUserBs.value?.id as number;
  }

  getCurrentSystemUser() {
    return this.systemUserBs.value;
  }
  getCurrentSystemUserRole() {
    return this.systemUserBs.value?.role?.name as string;
  }
  isAdmin() {
    return (
      this.systemUserBs.value?.role?.name.toUpperCase() === SystemRole.ADMIN
    );
  }
  isLoggedIn() {
    return (
      !!this.cookieService.get(Constant.TOKEN_COOKIE_NAME) &&
      !!this.cookieService.get(Constant.SYSTEM_USER_COOKIE_NAME)
    );
  }
}
