import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../Services/user.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent {
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<boolean>();
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService, private toastr: ToastrService) {
    // Initialize form group
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      roleName: ['', Validators.required],
      supervisorId: [''],
      teamLeaderId: ['']
    });
  }

  // On form submit, register user
  onSubmit(): void {
    if (this.registerForm.invalid) return;

    const user = this.registerForm.value;
    this.userService.createUser(user).subscribe({
      next: (response) => {
        if (response.success) {
        this.toastr.success('User created successfully!');
        this.close.emit(true); // Close modal
      }else {
        this.toastr.error(response.message, 'Error'); // Error notification
      }
    },
      error: (err) => {
        this.toastr.error('Error creating user.');
      }
    });
  }

  // Close the modal
  closeModal(): void {
    this.close.emit(false);
  }
}
