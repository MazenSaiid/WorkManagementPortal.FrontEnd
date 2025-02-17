import { Component } from '@angular/core';
import { AccountService } from '../../../core/Services/account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ChangePasswordDto } from '../../../core/Models/Dtos/ChangePasswordDto';
import { Globals } from '../../../core/globals';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;
  changePasswordData: ChangePasswordDto | null = null;
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private globals:Globals,
    private accountService: AccountService,
    private router: Router
  ) {
    // Create the change password form group with validation
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {}

  onChangePasswordSubmit() {
    if (this.changePasswordForm.invalid) return;

    const { oldPassword, newPassword, confirmPassword } = this.changePasswordForm.value;

    // Check if new password matches confirm password
    if (newPassword !== confirmPassword) {
      this.toastr.error('New password and confirm password do not match.', 'Error');
      return;
    }
  
    const formData = { ...this.changePasswordForm.value };
    
    formData.email = this.globals.currentUserInfo.email;
    formData.newPassword = formData.newPassword;
    formData.oldPassword = formData.oldPassword;

    this.changePasswordData = formData;
    this.accountService.changePassword(this.changePasswordData).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Password changed successfully!');
          this.router.navigate(['/home']);
        } else {
          this.toastr.error(response.message, 'Error');
        }
      },
      error: (err) => {
        this.toastr.error('Failed to change password.', 'Error');
      },
    });
  }
}
