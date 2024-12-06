import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ListWorkShiftDto, ShiftType } from '../../../core/Models/Dtos/ListWorkShiftDto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkShiftService } from '../../Services/work-shift.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-work-shift',
  templateUrl: './add-work-shift.component.html',
  styleUrl: './add-work-shift.component.scss'
})
export class AddWorkShiftComponent {

constructor(private fb: FormBuilder, private workShiftService: WorkShiftService, private toastr: ToastrService) {
  this.createWorkShiftForm = this.fb.group({
    shiftName: ['', Validators.required],
    shiftType: ['', Validators.required],
    startTime: ['', Validators.required],
    endTime: ['', Validators.required]
  });
}
shiftTypes = [
  { id: ShiftType.Morning, name: 'Morning' },
  { id: ShiftType.MidDay, name: 'Mid Day' },
  { id: ShiftType.Evening, name: 'Evening' },
  { id: ShiftType.Night, name: 'Night' },
  // Add more shift types as needed
];
onSubmit(): void {
  if (this.createWorkShiftForm.invalid) {
    return;
  }

  const workShiftData: ListWorkShiftDto = this.createWorkShiftForm.value;

  // Ensure that end time is after start time
  if (new Date(workShiftData.endTime) <= new Date(workShiftData.startTime)) {
    this.toastr.error('End time must be later than start time.');
    return;
  }

  // Call the service to create the work shift
  this.workShiftService.createWorkShift(workShiftData).subscribe({
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
  @Input() workShift: ListWorkShiftDto | any ;
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<boolean>();
  createWorkShiftForm: FormGroup;

  closeModal(): void {
    this.close.emit(false);
  }
}
