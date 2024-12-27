import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserDto } from '../../Models/Dtos/UserDto';
import { ToastrService } from 'ngx-toastr';
import { Globals } from '../../globals';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../../../user-management/Services/user.service';
import { RolesListDto } from '../../Models/Dtos/RolesListDto';
import { RoleService } from '../../../role-management/Services/role.service';
import { ListWorkShiftDto } from '../../Models/Dtos/ListWorkShiftDto';
import { WorkShiftService } from '../../../work-shifts-management/Services/work-shift.service';

@Component({
  selector: 'app-delete-confirmation-modal',
  templateUrl: './delete-confirmation-modal.component.html',
  styleUrl: './delete-confirmation-modal.component.scss'
})
export class DeleteConfirmationModalComponent {

  @Input() user: UserDto | any;
  @Input() isVisible: boolean = false; 
  @Input() workShift: ListWorkShiftDto | any;
  @Input() role: RolesListDto | any;
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() userDeleted = new EventEmitter<void>();
  @Output() workShiftDeleted = new EventEmitter<void>();
  @Output() roleDeleted = new EventEmitter<void>();
  constructor(private toastrService: ToastrService, private rolesService:RoleService,
     private userService: UserService,
    private workShiftService: WorkShiftService) {
  }
  closeModal(): void {
    this.close.emit(false); // Emit false to close the modal
  }
     // Delete a work shift by ID
 deleteWorkShift() {
  this.workShiftService.deleteWorkShift(this.workShift.id).subscribe({
    next: (response) => {
      if (response.success) {
        this.toastrService.success('Work Shift deleted successfully', 'Success');
        this.workShiftDeleted.emit();
        this.closeModal();
      } else {
        this.toastrService.error(response.message, 'Error');
      }
    },
    error: (err) => {
      this.toastrService.error(err.message, 'Error');
    }
  });
}
   // Delete a user by ID
 deleteUser() {
  this.userService.deleteUser(this.user.id).subscribe({
    next: (response) => {
      if (response.success) {
        this.toastrService.success('User deleted successfully', 'Success');
        this.userDeleted.emit()
        this.closeModal();
      } else {
        this.toastrService.error(response.message, 'Error');
      }
    },
    error: (err) => {
      this.toastrService.error(err.message, 'Error');
    }
  });
}

deleteRole() {
  this.rolesService.deleteRole(this.role.id).subscribe({
    next: (response) => {
      if (response.success) {
        this.toastrService.success('Role deleted successfully', 'Success');
        this.roleDeleted.emit();
        this.closeModal();
      } else {
        this.toastrService.error(response.message, 'Error');
      }
    },
    error: (err) => {
      this.toastrService.error(err.message, 'Error');
    }
  });
}
}