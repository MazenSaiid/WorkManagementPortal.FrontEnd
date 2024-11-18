import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../Services/user.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent {
  @Input() user: any;
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<boolean>();
  userForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService, private toastr: ToastrService) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      roleName: ['', Validators.required],
      supervisorId: [''],
      teamLeaderId: ['']
    });
  }

  ngOnChanges() {
    if (this.user) {
      this.userForm.patchValue(this.user);
    }
  }

  onSubmit() {
    if (this.userForm.invalid) return;

    const updatedUser = this.userForm.value;
    this.userService.updateUser(updatedUser.id,updatedUser).subscribe({
      next: (response) => {
        if (response.success) {
        this.toastr.success('User updated successfully!');
        this.close.emit(true); // Close modal
      }else {
        this.toastr.error(response.message, 'Error'); // Error notification
      }
    },
      error: (err) => {
        this.toastr.error('Error updating user.');
      }
    });
  }

  closeModal() {
    this.close.emit(false);
  }
}
