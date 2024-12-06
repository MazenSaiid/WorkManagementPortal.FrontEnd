import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../Services/user.service';
import { RoleService } from '../../../role-management/Services/role.service';
import { RolesListDto } from '../../../core/Models/Dtos/RolesListDto';
import { RegiserModel } from '../../../core/Models/Dtos/RegisterModel';
import { UserDto } from '../../../core/Models/Dtos/UserDto';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<boolean>();
  registerForm: FormGroup;
  roles: RolesListDto[] = [];
  roleName: string = ''; // To track selected role
  createUser: RegiserModel | null = null;
  supervisors: UserDto[] | null = [];
  teamLeaders: UserDto[] | null = [];

  ngOnInit(): void {
    this.loadRoles();
    this.loadSupervisors();
    this.loadTeamLeaders();
    this.registerForm.get('roleName')?.valueChanges.subscribe((role) => {
      this.roleName = role;
      this.toggleRoleFields();
    });
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
        console.error(error);
        this.toastr.error('Error fetching roles.', 'Error');
      }
    });
  }

  constructor(private roleService: RoleService, private fb: FormBuilder, private userService: UserService, private toastr: ToastrService) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      password: ['', Validators.required],
      roleName: ['', Validators.required],
      supervisorId: [''],
      teamLeaderId: ['']
    });
  }
  passwordVisible = false; // Initially set to false, password is hidden

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible; // Toggle the visibility
  }
  toggleRoleFields(): void {
    const supervisorControl = this.registerForm.get('supervisorId');
    const teamLeaderControl = this.registerForm.get('teamLeaderId');

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

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.createUser = this.registerForm.value;
    this.userService.createUser(this.createUser).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('User created successfully!');
          this.close.emit(true);
        } else {
          this.toastr.error(response.message, 'Error');
        }
      },
      error: (err) => {
        this.toastr.error('Error creating user.');
      }
    });
  }

  closeModal(): void {
    this.close.emit(false);
  }
}
