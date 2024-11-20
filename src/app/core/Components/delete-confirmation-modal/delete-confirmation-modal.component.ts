import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserDto } from '../../Models/UserDto';
import { ToastrService } from 'ngx-toastr';
import { Globals } from '../../globals';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../../../user-management/Services/user.service';

@Component({
  selector: 'app-delete-confirmation-modal',
  templateUrl: './delete-confirmation-modal.component.html',
  styleUrl: './delete-confirmation-modal.component.scss'
})
export class DeleteConfirmationModalComponent {

  @Input() user: UserDto | any = null;
  @Input() isVisible: boolean = false; 
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(private toastrService: ToastrService, private http: HttpClient, private router: Router, private userService: UserService) {
  }
  closeModal(): void {
    this.close.emit(false); // Emit false to close the modal
  }
   // Delete a user by ID
 deleteUser() {
  this.userService.deleteUser(this.user.id).subscribe({
    next: (response) => {
      if (response.success) {
        //this.loadAllUsers(); // Reload the list after deletion
        this.toastrService.success('User deleted successfully', 'Success');
      } else {
        this.toastrService.error(response.message, 'Error');
      }
    },
    error: () => {
      this.toastrService.error('An error occurred while deleting the user.', 'Error');
    }
  });
}
}