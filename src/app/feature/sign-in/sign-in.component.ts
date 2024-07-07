import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  Validators,
  FormBuilder,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  MatError,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { SignInForm } from '../dashboard/models/forms';
import { AuthService } from '../dashboard/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatError,
    MatLabel,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent {
  hide = true;
  signInForm: FormGroup<SignInForm> = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  });
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    if (localStorage.getItem('token') != null) {
      this.router.navigate(['/dashboard']);
    }
  }

  signIn() {
    if (this.signInForm.valid) {
      this.authService.signIn(this.signInForm.getRawValue()).subscribe(
        (res) => {
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          console.log(error.error.message ?? error.message);
          this.toastr.error(error.error.message ?? error.message);
        }
      );
    }
  }
}
