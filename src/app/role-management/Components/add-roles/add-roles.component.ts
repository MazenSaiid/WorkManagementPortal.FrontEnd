import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleService } from '../../Services/role.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-roles',
  templateUrl: './add-roles.component.html',
  styleUrl: './add-roles.component.scss'
})
export class AddRolesComponent implements OnInit{
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<boolean>();
  @Output() roleCreated = new EventEmitter<void>();
  roleForm: FormGroup;
  createRole: any;

  constructor(private roleService: RoleService, private fb: FormBuilder,private toastr: ToastrService) {
    this.roleForm = this.fb.group({
      roleName: ['', Validators.required],
    });
  }
  
  ngOnInit(): void {

  }

  onSubmit(): void {
    if (this.roleForm.invalid) {
      this.toastr.error('Invalid Data');
      return;
    }

    this.createRole = this.roleForm.value;
    this.roleService.createRole(this.createRole).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Role created successfully!');
          this.roleCreated.emit();
          this.closeModal();
        } else {
          this.toastr.error(response.message, 'Error');
        }
      },
      error: (err) => {
        this.toastr.error('Failed creating Role.','Error');
      }
    });
  }
  closeModal(): void {
    this.close.emit(false);
  }
}


