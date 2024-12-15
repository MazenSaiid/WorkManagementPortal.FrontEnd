import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ListWorkShiftDto, ShiftType } from '../../../core/Models/Dtos/ListWorkShiftDto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkShiftService } from '../../Services/work-shift.service';
import { ToastrService } from 'ngx-toastr';
import { WorkShiftDto } from '../../../core/Models/Dtos/WorkShiftDto';

@Component({
  selector: 'app-add-work-shift',
  templateUrl: './add-work-shift.component.html',
  styleUrl: './add-work-shift.component.scss'
})
export class AddWorkShiftComponent {
  workShiftData: WorkShiftDto | null = null;
  @Input() workShift: ListWorkShiftDto | any ;
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<boolean>();
  createWorkShiftForm: FormGroup;
  shiftTypes: any[] = [];  
constructor(private fb: FormBuilder, private workShiftService: WorkShiftService, private toastr: ToastrService) {
  this.createWorkShiftForm = this.fb.group({
    shiftName: ['', Validators.required],
    shiftType: ['', Validators.required],
    startTime: ['', Validators.required],
    endTime: ['', Validators.required]
  });
}
ngOnInit(): void {
  this.fetchShiftTypes();
}
fetchShiftTypes(): void {
  this.workShiftService.getShiftTypes().subscribe({
    next: (response) => {
      if (response && Array.isArray(response)) {
        this.shiftTypes = response; 
      } else {
        this.toastr.error('Failed to load shift types', 'Error');
      }
    },
    error: () => {
      this.toastr.error('Error fetching shift types.');
    }
  });
}
onSubmit(): void {
  if (this.createWorkShiftForm.invalid) {
    return;
  }
  
  const formData = { ...this.createWorkShiftForm.value };
  formData.shiftType = Number(formData.shiftType);
  formData.startTime = this.convertToTimeOnly(formData.startTime);
  formData.endTime = this.convertToTimeOnly(formData.endTime);
  
  this.workShiftData = formData;  

    // Ensure that end time is after start time
  if(this.workShiftData){
    if (new Date(this.workShiftData.endTime) <= new Date(this.workShiftData.startTime)) {
      this.toastr.error('End time must be later than start time.');
      return;
    }
  }
  // Call the service to create the work shift
  this.workShiftService.createWorkShift(this.workShiftData).subscribe({
    next: (response) => {
      if (response.success) {
        this.toastr.success('Work Shift created successfully!');
        this.close.emit(true);
      } else {
        this.toastr.error(response.message, 'Error');
      }
    },
    error: () => {
      this.toastr.error('Error creating work shift.');
    }
  });
}
convertToTimeOnly(time: string): string {
  // Assuming time is in "HH:mm" format and needs seconds appended
  const timeParts = time.split(':');
  
  // If the time is in "HH:mm" format (2 parts), add default seconds ":45"
  if (timeParts.length === 2) {
    return `${timeParts[0].padStart(2, '0')}:${timeParts[1].padStart(2, '0')}:00`;
  }
  // If the format doesn't match, return the original input
  return time;
}
  closeModal(): void {
    this.close.emit(false);
  }
}
