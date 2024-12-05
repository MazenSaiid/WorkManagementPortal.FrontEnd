import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RolesListDto } from '../../../core/Models/RolesListDto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleService } from '../../Services/role.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-roles',
  templateUrl: './edit-roles.component.html',
  styleUrl: './edit-roles.component.scss'
})
export class EditRolesComponent implements OnInit{

  @Input() role: RolesListDto | any ;
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<boolean>();
  editRoleForm: FormGroup;
  updatedRole: RolesListDto | any;

  constructor(private roleService: RoleService, private fb: FormBuilder,private toastr: ToastrService) {
    this.editRoleForm = this.fb.group({
      roleName: ['', Validators.required],
    });
  }
  ngOnInit(): void {
  }
  ngOnChanges() {
    if (this.role) {
      this.editRoleForm.patchValue(this.role);
    }
  }
  onSubmit() {
    if (this.editRoleForm.invalid) return;

    this.updatedRole = this.editRoleForm.value;
    this.updatedRole.roleId = this.role.id;
    this.roleService.updateRole(this.updatedRole).subscribe({
      next: (response) => {
        if (response.success) {
        this.toastr.success('Role updated successfully!');
        this.close.emit(true); // Close modal
      }else {
        this.toastr.error(response.message, 'Error'); // Error notification
      }
    },
      error: (err) => {
        this.toastr.error('Error updating role.');
      }
    });
    }
  closeModal(): void {
    this.close.emit(false);
  }
}
