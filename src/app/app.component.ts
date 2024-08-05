import { Component } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './feature/dashboard/auth/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { SystemUser } from './feature/dashboard/models/schemas/system-user';
import { Constant } from './feature/dashboard/constant/constant';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'lms-front';
  constructor(
    private authService: AuthService,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const systemUser: SystemUser = JSON.parse(
      this.cookieService.get(Constant.SYSTEM_USER_COOKIE_NAME)
    );
    const token: string = this.cookieService.get(Constant.TOKEN_COOKIE_NAME);
    if (systemUser && token) {
      this.authService.setCurrentSystemUser(systemUser, token);
    } else {
      this.authService.setCurrentSystemUser(null, null);
    }
  }
}
