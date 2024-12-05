import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserDto } from '../../Models/UserDto';
import { ToastrService } from 'ngx-toastr';
import { Globals } from '../../globals';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../../../user-management/Services/user.service';
import { RolesListDto } from '../../Models/RolesListDto';
import { RoleService } from '../../../role-management/Services/role.service';

@Component({
  selector: 'app-delete-confirmation-modal',
  templateUrl: './delete-confirmation-modal.component.html',
  styleUrl: './delete-confirmation-modal.component.scss'
})
export class DeleteConfirmationModalComponent {

  @Input() user: UserDto | any;
  @Input() isVisible: boolean = false; 
  @Input() role: RolesListDto | any;
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(private toastrService: ToastrService, private rolesService:RoleService, private userService: UserService) {
  }
  closeModal(): void {
    this.close.emit(false); // Emit false to close the modal
  }
   // Delete a user by ID
 deleteUser() {
  this.userService.deleteUser(this.user.id).subscribe({
    next: (response) => {
      if (response.success) {
        this.toastrService.success('User deleted successfully', 'Success');
        this.closeModal();
      } else {
        this.toastrService.error(response.message, 'Error');
      }
    },
    error: () => {
      this.toastrService.error('An error occurred while deleting the user.', 'Error');
    }
  });
}

deleteRole() {
  this.rolesService.deleteRole(this.role.id).subscribe({
    next: (response) => {
      if (response.success) {
        this.toastrService.success('Role deleted successfully', 'Success');
        this.closeModal();
      } else {
        this.toastrService.error(response.message, 'Error');
      }
    },
    error: () => {
      this.toastrService.error('An error occurred while deleting the role.', 'Error');
    }
  });
}
}