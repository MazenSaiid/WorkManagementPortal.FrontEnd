import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../Services/user.service';
import { RoleService } from '../../../role-management/Services/role.service';
import { Roles, RolesListDto } from '../../../core/Models/Dtos/RolesListDto';
import { CreateUserDto } from '../../../core/Models/Dtos/CreateUserDto';
import { UserDto } from '../../../core/Models/Dtos/UserDto';
import { AccountService } from '../../../core/Services/account.service';
import { ListWorkShiftDto } from '../../../core/Models/Dtos/ListWorkShiftDto';
import { WorkShiftService } from '../../../work-shifts-management/Services/work-shift.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<boolean>();
  @Output() userCreated = new EventEmitter<void>();
  registerForm: FormGroup;
  roles: RolesListDto[] = [];
  workShifts: ListWorkShiftDto[] = [];
  roleName: string = Roles.Employee.toString();// To track selected role
  workShiftSearch: string = ''; // To track workshift
  roleSearch: string = ''// To track search role
  supervisorSearch: string = '';
  teamLeaderSearch: string = '';
  createUser: CreateUserDto | null = null;
  supervisors: UserDto[]  = [];
  teamLeaders: UserDto[] = [];

  ngOnInit(): void {
    this.loadRoles();
    this.loadSupervisors();
    this.loadTeamLeaders();
    this.loadWorkShifts();
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

  constructor(private roleService: RoleService, private fb: FormBuilder, private userService: UserService,
     private workShiftService: WorkShiftService, private toastr: ToastrService) {
    this.registerForm = this.fb.group({
      employeeSerialNumber:[
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]$')  // all digits must be numbers.
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
  toggleRoleFields(): void {
    const supervisorControl = this.registerForm.get('supervisorId');
    const teamLeaderControl = this.registerForm.get('teamLeaderId');
    const workShiftControl = this.registerForm.get('workShiftId');
  
    if (this.roleName === Roles.Admin.toString() || this.roleName === Roles.Manager.toString()) {
      // Clear validators for supervisor, teamLeader, and workShift for Admin/Manager
      supervisorControl?.clearValidators();
      teamLeaderControl?.clearValidators();
      workShiftControl?.clearValidators();
      
      // Reset values to null or appropriate defaults
      workShiftControl?.setValue(null);  // null for optional workShiftId
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
  
  onSubmit(): void {
    // Mark all controls as touched to trigger validation
    Object.values(this.registerForm.controls).forEach(control => {
      control.markAsTouched();
    });
  
    // Check form validity after applying role-based changes
    if (this.registerForm.invalid) {
      this.toastr.error('Invalid Data');
      return;
    }
  
    // Prepare the data for submission
    this.createUser = this.registerForm.value;
  
    // Call the service to create the user
    this.userService.createUser(this.createUser).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('User created successfully!');
          this.userCreated.emit();
          this.loadSupervisors();
          this.loadTeamLeaders();
          this.closeModal();
          this.registerForm.reset();
        } else {
          this.toastr.error(response.message, 'Error');
        }
      },
      error: (err) => {
        this.toastr.error(err.message, 'Error');
      }
    });
  }
  

  closeModal(): void {
    this.close.emit(false);
  }
  filteredWorkShifts() {
    return this.workShifts.filter(workShift =>
      workShift.shiftName.toLowerCase().includes(this.workShiftSearch.toLowerCase())
    );
  }
  filteredSupervisors() {
    this.supervisors.filter(supervisor => {
      return supervisor.userName.includes(this.supervisorSearch.toLowerCase())
    });
  }
  filteredTeamLeads() {
    this.teamLeaders.filter(teamLeader => {
      return teamLeader.userName.includes(this.teamLeaderSearch.toLowerCase())
    });
  }
  filteredRoles() {
    return this.roles.filter(role =>
      role.roleName.toLowerCase().includes(this.roleSearch.toLowerCase())
    );
  }
}
