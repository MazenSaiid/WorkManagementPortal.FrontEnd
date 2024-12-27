import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../Services/user.service';
import { RoleService } from '../../../role-management/Services/role.service';
import { RolesListDto } from '../../../core/Models/Dtos/RolesListDto';
import { UserValidationResponse } from '../../../core/Models/Responses/UserValidationResponse';
import { UserDto } from '../../../core/Models/Dtos/UserDto';
import { WorkShiftService } from '../../../work-shifts-management/Services/work-shift.service';
import { ListWorkShiftDto } from '../../../core/Models/Dtos/ListWorkShiftDto';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit{
  @Input() user: UserDto | any ;
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<boolean>();
  @Output() userUpdated = new EventEmitter<void>();
  userForm: FormGroup;
  roles: RolesListDto[] = [];
  supervisors: UserDto[] | null = [];
  teamLeaders: UserDto[] | null = [];
  workShifts: ListWorkShiftDto[] = [];
  roleName: string = ''; // To track selected role

  constructor(private roleService: RoleService,private fb: FormBuilder, private userService: UserService, 
    private workShiftService: WorkShiftService,private toastr: ToastrService) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [
        '',
        [
          Validators.required, 
          Validators.pattern('^[0-9]{11}$')  // Only 11 digits, and all digits must be numbers.
        ]
      ],
      roleName: ['', Validators.required],
      supervisorId: [''],
      teamLeaderId: [''],
      workShiftName: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.loadRoles();
    this.loadSupervisors();
    this.loadTeamLeaders();
    this.loadWorkShifts();
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
        console.error('Error fetching supervisors.', 'Error');
      }
    });
  }
  loadTeamLeaders(): void {
    this.userService.getAllTeamLeaders().subscribe({
      next: (data) => {
        this.teamLeaders = data.users;
      },
      error: (error) => {
        console.error('Error fetching teamleaders.', 'Error');
      }
    });
  }
  loadRoles(): void {
    this.roleService.getAllRoles().subscribe({
      next: (data) => {
        this.roles = data.roles;
      },
      error: (error) => {
        console.error('Error fetching roles.', 'Error');
      }
    });
  }
  loadWorkShifts(): void {
    this.workShiftService.getAllWorkShifts().subscribe({
      next: (data) => {
        this.workShifts = data.workShifts;
      },
      error: (error) => {
        console.error('Error fetching workshifts.', 'Error');
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
        this.userUpdated.emit();
        this.loadSupervisors();
        this.loadTeamLeaders();
        this.closeModal(); // Close modal
      }else {
        this.toastr.error(response.message, 'Error'); // Error notification
      }
    },
      error: (err) => {
        this.toastr.error(err.message, 'Error');
      }
    });
  }

  closeModal() {
    this.close.emit(false);
  }
}
