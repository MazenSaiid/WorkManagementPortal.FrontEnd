import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
export class EditWorkShiftComponent implements OnInit {
  @Input() workShift: ListWorkShiftDto | any ;
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<boolean>();
  @Output() workShiftUpdated = new EventEmitter<boolean>();
  editWorkShiftForm: FormGroup;
  shiftTypes: any[] = [];  
  updatedWorkShift: WorkShiftDto | null = null;
  constructor(private fb: FormBuilder, private workShiftService: WorkShiftService, private toastr: ToastrService){
    this.editWorkShiftForm = this.fb.group({
      shiftName: ['', Validators.required],
      shiftType: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchShiftTypes();
  }
  
  ngOnChanges() {
    if (this.workShift) {
      this.editWorkShiftForm.patchValue(this.workShift);
    }
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
        console.error('Error fetching shift types.');
      }
    });
  }
  onSubmit() {
    if (this.editWorkShiftForm.invalid) return;
    
    const formData = { ...this.editWorkShiftForm.value };
    formData.shiftType = Number(formData.shiftType);
    
    formData.startTime = this.convertToTimeOnly(formData.startTime);
    formData.endTime = this.convertToTimeOnly(formData.endTime);
  
    this.updatedWorkShift = formData;
  
    // Call the service to update the work shift
    this.workShiftService.updateWorkShift(this.workShift?.id, this.updatedWorkShift).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Work Shift updated successfully!');
          this.workShiftUpdated.emit();
        this.closeModal();
        } else {
          this.toastr.error(response.message, 'Error'); // Error notification
        }
      },
      error: (err) => {
        console.error('Error updating Workshift.');
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

  closeModal() {
    this.close.emit(false);
  }
}
