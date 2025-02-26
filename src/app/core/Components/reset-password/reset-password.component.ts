import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../Services/account.service';
import { ToastrService } from 'ngx-toastr';
import { ResetPasswordDto } from '../../Models/Dtos/ChangePasswordDto';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordData: ResetPasswordDto | null = null
  resetPasswordForm: FormGroup;
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;
  email: string = '';
  token: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private accountService: AccountService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6),Validators.pattern(/^(?=.*[0-9])(?=.*[\W_]).{6,}$/)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6),Validators.pattern(/^(?=.*[0-9])(?=.*[\W_]).{6,}$/)]]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.email = params['email'];
    });
  }

  onChangePasswordSubmit(): void {
    if (this.resetPasswordForm.invalid) 
      {
        this.toastr.error('Invalid Data');
        return;
      }
    const { newPassword, confirmPassword } = this.resetPasswordForm.value;

    // Check if new password matches confirm password
    if (newPassword !== confirmPassword) {
      this.toastr.error('New password and confirm password do not match.', 'Error');
      return;
    }
    const formData = { ...this.resetPasswordForm.value };
    
    formData.email = this.email;
    formData.newPassword = newPassword;
    formData.token = this.token;
    this.resetPasswordData = formData;

    this.accountService.resetPassword(this.resetPasswordData).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Password changed successfully!');
          setTimeout(() => this.router.navigate(['']), 2000);
        } else {
          this.toastr.error(response.message, 'Error');
        }
        
      },
      error: (err) => {
        this.toastr.error('Failed to change password.', 'Error');
      },
    });
  }
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }
}