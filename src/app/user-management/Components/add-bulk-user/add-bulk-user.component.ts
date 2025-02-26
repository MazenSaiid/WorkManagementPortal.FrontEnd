import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListWorkShiftDto } from '../../../core/Models/Dtos/ListWorkShiftDto';
import { Roles, RolesListDto } from '../../../core/Models/Dtos/RolesListDto';
import { UserDto } from '../../../core/Models/Dtos/UserDto';
import { RoleService } from '../../../role-management/Services/role.service';
import { UserService } from '../../Services/user.service';
import { ToastrService } from 'ngx-toastr';
import { WorkShiftService } from '../../../work-shifts-management/Services/work-shift.service';
import { AccountService } from '../../../core/Services/account.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-add-bulk-user',
  templateUrl: './add-bulk-user.component.html',
  styleUrl: './add-bulk-user.component.scss'
})
export class AddBulkUserComponent implements OnInit {
  workShifts: ListWorkShiftDto[] = [];
  roles: RolesListDto[] = [];
  // Reference to the file input element
  @ViewChild('fileInput') fileInput!: ElementRef;
  bulkUploadForm: FormGroup;
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<boolean>();
  @Output() bulkUsersCreated = new EventEmitter<boolean>();
  roleName: string = ''; // To track selected role
  supervisors: UserDto[] | null = [];
  teamLeaders: UserDto[] | null = [];

  constructor(private roleService: RoleService, private fb: FormBuilder, private userService: UserService,
 private workShiftService: WorkShiftService, private toastr: ToastrService) {
    // Initialize the form with additional fields
    this.bulkUploadForm = this.fb.group({
      workShiftId: [null],
      roleName: ['', Validators.required],
      supervisorId: ['', ],
      teamLeaderId: ['', ]
    });
  }
  ngOnInit(): void {
    this.loadRoles();
    this.loadSupervisors();
    this.loadTeamLeaders();
    this.loadWorkShifts();
    this.bulkUploadForm.get('roleName')?.valueChanges.subscribe((role) => {
      this.roleName = role;
      this.toggleRoleFields();
    });
}
  toggleRoleFields(): void {
      const supervisorControl = this.bulkUploadForm.get('supervisorId');
      const teamLeaderControl = this.bulkUploadForm.get('teamLeaderId');
      const workShiftControl = this.bulkUploadForm.get('workShiftId');
    
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
  closeModal(): void {
    this.close.emit(false);
    this.bulkUploadForm.reset();
  }
  onFileChange(event: any): void {
    const file = event.target.files[0];
    
    // Check if the file type is valid (CSV, Excel)
    if (file && (file.name.endsWith('.csv'))) {
      this.readFile(file);
    } else {
      this.toastr.error('Please upload a valid CSV file.');  // Set error message
    }
  }

  // Parse and validate the uploaded file
  readFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = e.target.result;
      let parsedData: any[] = [];

      if (file.name.endsWith('.csv')) {
        parsedData = this.parseCSV(data);
      }

      // Validate parsed data (similar to form validation)
      this.validateUploadedData(parsedData);
    };
    reader.readAsBinaryString(file);
  }

  // CSV Parsing
  parseCSV(data: string): any[] {
    const lines = data.split('\n');
    const result = [];
    const headers = lines[0].split(',');

    for (let i = 1; i < lines.length; i++) {
      const obj: any = {};
      const currentLine = lines[i].split(',');

      for (let j = 0; j < headers.length; j++) {
        obj[headers[j].trim()] = currentLine[j]?.trim();
      }
      result.push(obj);
    }

    return result;
  }

  // Validate data
  validateUploadedData(data: any[]): void {
    data.forEach((row, index) => {
      // Validate each field (similar to form validation)
      if (!row.empolyeeId || row.empolyeeId.trim() === '') {
        this.toastr.error(`Row ${index + 1}: Employee Id is required`);
      }
      if (!row.firstName || row.firstName.trim() === '') {
        this.toastr.error(`Row ${index + 1}: First Name is required`);
      }

      if (!row.lastName || row.lastName.trim() === '') {
        this.toastr.error(`Row ${index + 1}: Last Name is required`);
      }

      if (!row.email || !this.validateEmail(row.email)) {
        this.toastr.error(`Row ${index + 1}: A valid Email is required`);
      }

      if (!row.phoneNumber || !this.validatePhoneNumber(row.phoneNumber)) {
        this.toastr.error(`Row ${index + 1}: A valid Phone Number is required (11 digits)`);
      }

    });

    // If all rows are valid, you can proceed with submitting the data
  }

  // Validate email format
  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  // Validate phone number (11 digits)
  validatePhoneNumber(phone: string): boolean {
    const phonePattern = /^[0-9]{11}$/;
    return phonePattern.test(phone);
  }

  // Download sample CSV or Excel
  downloadSample(type: 'csv') {
    const sampleData = [
      ['empolyeeId','firstName', 'lastName', 'email', 'phoneNumber' ], // CSV headers
      ['10','John', 'Doe', 'john.doe@example.com', '01234567890'] // Example row
    ];

    if (type === 'csv') {
      this.downloadCSV(sampleData);
    } 
  }

  downloadCSV(data: any[]) {
    const csvContent = data.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample_users.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // Handle file upload submission
  onFileUpload() {
    
    Object.values(this.bulkUploadForm.controls).forEach(control => {
      control.markAsTouched();
    });

    // Send the file and form data for processing
    const formData = new FormData();
    formData.append('file', this.fileInput.nativeElement.files[0]);
    if (this.bulkUploadForm.value.workShiftId !== null) {
      formData.append("workShiftId", this.bulkUploadForm.value.workShiftId);
  }
    formData.append('roleName', this.bulkUploadForm.value.roleName);
    formData.append('supervisorId', this.bulkUploadForm.value.supervisorId);
    formData.append('teamLeaderId', this.bulkUploadForm.value.teamLeaderId);

    this.userService.createBulkUsers(formData).subscribe({
      next: (response) =>
        {
          if (response.failureCount === 0){
          this.toastr.success('Users created successfully!');
          this.closeModal();
          this.bulkUsersCreated.emit();
          this.bulkUploadForm.reset();
          }
          else {  
            response.results.forEach((result: { message: string | undefined; }) => {
              this.toastr.error(result.message, 'Error in Creating Bulk');
            });
            
          }
        },error: (err) => {
        console.error(err.message, 'Error');
        }
    }
    );
  }
}


