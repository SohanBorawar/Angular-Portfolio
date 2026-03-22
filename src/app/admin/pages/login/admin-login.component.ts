import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../services/admin-auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AdminAuthService);
  private router = inject(Router);

  loginError = signal(false);
  isLoading = signal(false);
  showPassword = signal(false);

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  togglePassword(): void {
    this.showPassword.set(!this.showPassword());
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.loginError.set(false);

    // Simulate brief loading for UX
    setTimeout(() => {
      const { username, password } = this.form.value;
      const success = this.auth.login(username!, password!);

      if (success) {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.loginError.set(true);
        this.isLoading.set(false);
        // Shake the form
        const card = document.querySelector('.login-card');
        card?.classList.add('shake');
        setTimeout(() => card?.classList.remove('shake'), 500);
      }
    }, 800);
  }
}
