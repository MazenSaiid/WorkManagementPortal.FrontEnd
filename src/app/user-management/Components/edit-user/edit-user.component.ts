import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../Services/user.service';
import { RoleService } from '../../../role-management/Services/role.service';
import { Roles, RolesListDto } from '../../../core/Models/Dtos/RolesListDto';
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
      employeeSerialNumber: [
        '',
        [
          Validators.required, 
          Validators.pattern('^[0-9]$')  // Only all digits must be numbers.
        ]
      ],
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
      workShiftId: [null],
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
    const workShiftControl = this.userForm.get('workShiftId');
  
    if (this.roleName === Roles.Admin.toString() || this.roleName === Roles.Manager.toString()) {
      // Clear validators for supervisor, teamLeader, and workShift for Admin/Manager
      supervisorControl?.clearValidators();
      teamLeaderControl?.clearValidators();
      supervisorControl?.setValue('');   // Empty string for optional supervisorId
      teamLeaderControl?.setValue('');   // Empty string for optional teamLeaderId
    } else if (this.roleName === Roles.TeamLead.toString()) {
      // Set workShiftId as required for TeamLead
      workShiftControl?.setValidators([Validators.required]);
    } else if (this.roleName === Roles.Supervisor.toString()) {
      // Set workShiftId as required for Supervisor
      teamLeaderControl?.clearValidators();  // Clear teamLeader for Supervisor
      teamLeaderControl?.setValue('');
      workShiftControl?.setValidators([Validators.required]);
    } else if (this.roleName === Roles.Employee.toString()) {
      // Add validators for supervisor and teamLeader for Employee
      supervisorControl?.setValidators([Validators.required]);
      teamLeaderControl?.setValidators([Validators.required]);
      workShiftControl?.setValidators([Validators.required]);
    }
  
    // Ensure form controls are updated after changing validators
    supervisorControl?.updateValueAndValidity();
    teamLeaderControl?.updateValueAndValidity();
    workShiftControl?.updateValueAndValidity();
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

  onSubmit() {;
    Object.values(this.userForm.controls).forEach(control => {
      control.markAsTouched();
    });
    if (this.userForm.invalid) {
      this.toastr.error('Invalid Data');
      return;
    }

    const updatedUser = this.userForm.value;
    this.userService.updateUser(this.user?.id,updatedUser).subscribe({
      next: (response) => {
        if (response.success) {
        this.toastr.success('User updated successfully!');
        this.userUpdated.emit();
        this.loadSupervisors();
        this.loadTeamLeaders();
        this.closeModal(); // Close modal
        this.userForm.reset();
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
