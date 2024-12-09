import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ListWorkShiftDto, ShiftType } from '../../../core/Models/Dtos/ListWorkShiftDto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkShiftService } from '../../Services/work-shift.service';
import { ToastrService } from 'ngx-toastr';
import { WorkShiftDto } from '../../../core/Models/Dtos/WorkShiftDto';

@Component({
  selector: 'app-edit-work-shift',
  templateUrl: './edit-work-shift.component.html',
  styleUrl: './edit-work-shift.component.scss'
})
export class EditWorkShiftComponent {
  @Input() workShift: ListWorkShiftDto | any ;
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<boolean>();
  editWorkShiftForm: FormGroup;
  shiftTypes = [
    { id: ShiftType.Morning, name: 'Morning' },
    { id: ShiftType.MidDay, name: 'Mid Day' },
    { id: ShiftType.Evening, name: 'Evening' },
    { id: ShiftType.Night, name: 'Night' },
    // Add more shift types as needed
  ];
  updatedWorkShift: WorkShiftDto | null = null;
  constructor(private fb: FormBuilder, private workShiftService: WorkShiftService, private toastr: ToastrService){
    this.editWorkShiftForm = this.fb.group({
      shiftName: ['', Validators.required],
      shiftType: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    });
  }
  ngOnChanges() {
    if (this.workShift) {
      this.editWorkShiftForm.patchValue(this.workShift);
    }
  }

  onSubmit() {
    if (this.editWorkShiftForm.invalid) return;
    this.updatedWorkShift = this.editWorkShiftForm.value;
    this.workShiftService.updateWorkShift(this.workShift?.id,this.updatedWorkShift).subscribe({
      next: (response) => {
        if (response.success) {
        this.toastr.success('Work Shift updated successfully!');
        this.close.emit(true); // Close modal
      }else {
        this.toastr.error(response.message, 'Error'); // Error notification
      }
    },
      error: (err) => {
        this.toastr.error('Error updating Workshift.');
      }
    });
  }

  closeModal() {
    this.close.emit(false);
  }
}
