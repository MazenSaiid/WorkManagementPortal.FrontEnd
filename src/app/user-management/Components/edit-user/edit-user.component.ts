import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../Services/user.service';
import { RoleService } from '../../../role-management/Services/role.service';
import { RolesListDto } from '../../../core/Models/Dtos/RolesListDto';
import { UserValidationResponse } from '../../../core/Models/Responses/UserValidationResponse';
import { UserDto } from '../../../core/Models/Dtos/UserDto';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit{
  @Input() user: UserDto | any ;
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<boolean>();
  userForm: FormGroup;
  roles: RolesListDto[] = [];
  supervisors: UserDto[] | null = [];
  teamLeaders: UserDto[] | null = [];
  roleName: string = ''; // To track selected role

  constructor(private roleService: RoleService,private fb: FormBuilder, private userService: UserService, private toastr: ToastrService) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      roleName: ['', Validators.required],
      supervisorId: [''],
      teamLeaderId: ['']
    });
  }
  ngOnInit(): void {
    this.loadRoles();
    this.loadSupervisors();
    this.loadTeamLeaders();
    this.userForm.get('roleName')?.valueChanges.subscribe((role) => {
      this.roleName = role;
      this.toggleRoleFields();
    });
  }
  toggleRoleFields(): void {
    const supervisorControl = this.userForm.get('supervisorId');
    const teamLeaderControl = this.userForm.get('teamLeaderId');

    if (this.roleName === 'Admin' || this.roleName === 'Manager') {
      supervisorControl?.clearValidators();
      teamLeaderControl?.clearValidators();
      supervisorControl?.setValue('');
      teamLeaderControl?.setValue('');
    }
    else if(this.roleName === 'Supervisor'){
      teamLeaderControl?.clearValidators();
      teamLeaderControl?.setValue('');
    }
    supervisorControl?.updateValueAndValidity();
    teamLeaderControl?.updateValueAndValidity();
  }
  loadSupervisors(): void {
    this.userService.getAllSupervisors().subscribe({
      next: (data) => {
        this.supervisors = data.users;
      },
      error: (error) => {
        this.toastr.error('Error fetching supervisors.', 'Error');
      }
    });
  }
  loadTeamLeaders(): void {
    this.userService.getAllTeamLeaders().subscribe({
      next: (data) => {
        this.teamLeaders = data.users;
      },
      error: (error) => {
        this.toastr.error('Error fetching teamleaders.', 'Error');
      }
    });
  }
  loadRoles(): void {
    this.roleService.getAllRoles().subscribe({
      next: (data) => {
        this.roles = data.roles;
      },
      error: (error) => {
        this.toastr.error('Error fetching roles.', 'Error');
      }
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
    this.userService.updateUser(this.user?.id,updatedUser).subscribe({
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
