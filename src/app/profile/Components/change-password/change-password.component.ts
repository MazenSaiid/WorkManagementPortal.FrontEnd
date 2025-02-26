import { Component, Input, Output } from '@angular/core';
import { AccountService } from '../../../core/Services/account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ChangePasswordDto } from '../../../core/Models/Dtos/ChangePasswordDto';
import { Globals } from '../../../core/globals';
import { UserService } from '../../../user-management/Services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;
  changePasswordData: ChangePasswordDto | null = null;
  currentUserInfo : any | null = null;
  passwordVisible: boolean = false;
  oldPasswordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private globals:Globals,
    private userService: UserService,
    private accountService: AccountService,
    private router: Router
  ) {
    // Create the change password form group with validation
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6),Validators.pattern(/^(?=.*[0-9])(?=.*[\W_]).{6,}$/)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6),Validators.pattern(/^(?=.*[0-9])(?=.*[\W_]).{6,}$/)]],
    });
  }

  ngOnInit(): void {
    this.getCurrentUserInfo();
  }
  getCurrentUserInfo(){
    const currentUser = this.globals.currentUserInfo; // Store in a variable
    if(currentUser){
      this.userService.getUserById(currentUser.userId).subscribe({
        next: (response) => {
          if (response.success) {
            this.currentUserInfo = response.users[0];
          } else {
            this.toastr.error(response.message, 'Error'); // Show error using Toastr
          }
        },
        error: (err) => {
          console.error('An error occurred while fetching the user.', 'Error'); // Show error using Toastr
        }
      });
    }
  }

  onChangePasswordSubmit() {
    if (this.changePasswordForm.invalid) return;

    const {newPassword, confirmPassword } = this.changePasswordForm.value;

    // Check if new password matches confirm password
    if (newPassword !== confirmPassword) {
      this.toastr.error('New password and confirm password do not match.', 'Error');
      return;
    }
  
    const formData = { ...this.changePasswordForm.value };
    console.log(this.currentUserInfo);
    formData.email = this.currentUserInfo.email;
    
    formData.newPassword = formData.newPassword;
    formData.oldPassword = formData.oldPassword;

    this.changePasswordData = formData;

    this.accountService.changePassword(this.changePasswordData).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Password changed successfully!');
          setTimeout(() => this.router.navigate(['/home']), 2000);
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
  toggleOldPasswordVisibility(): void {
    this.oldPasswordVisible = !this.oldPasswordVisible;
  }
  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }
}
