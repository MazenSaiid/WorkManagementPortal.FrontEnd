import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../Services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  loginForm: FormGroup;
  loginDto: any;
  passwordVisible: boolean = false;
  isForgotPasswordModalVisible: boolean = false;
  emailforPasswordReset: any;
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private accountService: AccountService
  ) {
    // Create the form group with validators
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Email validation
      password: ['', [Validators.required, Validators.minLength(6)]], // Password validation (min length of 6)
    });
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
  ngOnInit(): void {}
  onForgotPasswordSubmit() {
    if (this.forgotPasswordForm.invalid) return;
    this.emailforPasswordReset = this.forgotPasswordForm.value;
    this.accountService
      .requestPasswordReset(this.emailforPasswordReset)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success(
              'Request Password Reset! Please check your email.'
            );
          } else {
            this.toastr.error(response.message, 'Error');
          }
        },
        error: (err) => {
          this.toastr.error('Failed to login.', 'Error');
        },
      });
  }
  openForgotPasswordModal() {
    this.isForgotPasswordModalVisible = true;
  }
  closeForgotPasswordModal() {
    this.isForgotPasswordModalVisible = false;
  }
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.loginDto = this.loginForm.value;
    this.accountService.login(this.loginDto).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Login successfully!');
        } else {
          this.toastr.error(response.message, 'Error');
        }
      },
      error: (err) => {
        this.toastr.error('Failed to login.', 'Error');
      },
    });
  }
}
