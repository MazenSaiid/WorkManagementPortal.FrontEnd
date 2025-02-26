import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListWorkShiftDto, ShiftType } from '../../../core/Models/Dtos/ListWorkShiftDto';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  daysOfWeek: any[] = [];
  updatedWorkShift: WorkShiftDto | null = null;
  constructor(private fb: FormBuilder, private workShiftService: WorkShiftService, private toastr: ToastrService){
    this.editWorkShiftForm = this.fb.group({
      shiftName: ['', Validators.required],
      shiftType: ['', Validators.required],
      workShiftDetails: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.fetchShiftTypes();
    this.fetchDaysOfTheWeek();
  }
  get workShiftDetails(): FormArray {
      return this.editWorkShiftForm.get('workShiftDetails') as FormArray;
  }
  ngOnChanges() {
    if (this.workShift) {
      this.populateForm(this.workShift);
      console.log(this.workShift);
    }
  }
  fetchDaysOfTheWeek(): void {
    this.workShiftService.getDaysOfTheWeek().subscribe({
      next: (response) => {
        if (response && Array.isArray(response)) {
          this.daysOfWeek = response;
        }else {
          this.toastr.error('Failed to load days of the week', 'Error');
        }
      },
      error: () => {
        console.error('Error fetching days of the week.');
      }
    });
  }

  populateForm(workShift: ListWorkShiftDto): void {
    this.editWorkShiftForm.patchValue({
      shiftName: workShift.shiftName,
      shiftType: workShift.shiftType
    });

    this.workShiftDetails.clear();
    workShift.workShiftDetails.forEach(detail => {
      this.workShiftDetails.push(this.fb.group({
        day: [detail.day, Validators.required],
        startTime: [detail.startTime, Validators.required],
        endTime: [detail.endTime, Validators.required]
      }));
    });
  }

  addShiftDetail(): void {
    this.workShiftDetails.push(this.fb.group({
      day: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    }));
  }

  removeShiftDetail(index: number): void {
    this.workShiftDetails.removeAt(index);
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
    formData.isComplex = true;

    formData.workShiftDetails = this.workShiftDetails.value.map((shift: any) => {
      return {
        day: shift.day,
        startTime: this.convertToTimeOnly(shift.startTime),
        endTime: this.convertToTimeOnly(shift.endTime)
      };
    });
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
  
 // Convert time to "HH:mm:ss" format
 convertToTimeOnly(time: string): string {
  const timeParts = time.split(':');
  if (timeParts.length === 2) {
    return `${timeParts[0].padStart(2, '0')}:${timeParts[1].padStart(2, '0')}:00`;
  }
  return time;
}

  closeModal() {
    this.close.emit(false);
  }
}
