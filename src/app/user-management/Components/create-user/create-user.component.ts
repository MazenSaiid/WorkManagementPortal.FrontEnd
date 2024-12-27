import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../Services/user.service';
import { RoleService } from '../../../role-management/Services/role.service';
import { RolesListDto } from '../../../core/Models/Dtos/RolesListDto';
import { RegiserModel } from '../../../core/Models/Dtos/RegisterModel';
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
  roleName: string = ''; // To track selected role
  createUser: RegiserModel | null = null;
  supervisors: UserDto[] | null = [];
  teamLeaders: UserDto[] | null = [];

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
  private accountService:AccountService,private workShiftService: WorkShiftService, private toastr: ToastrService) {
    this.registerForm = this.fb.group({
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
      password: ['', Validators.required],
      roleName: ['', Validators.required],
      supervisorId: [''],
      teamLeaderId: [''],
      workShiftName: ['', Validators.required],
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
    Object.values(this.registerForm.controls).forEach(control => {
      control.markAsTouched();
    });

    if (this.registerForm.invalid) return;

    this.createUser = this.registerForm.value;
    this.accountService.createUser(this.createUser).subscribe({
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
}
