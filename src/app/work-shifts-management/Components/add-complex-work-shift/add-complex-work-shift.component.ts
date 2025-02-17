import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WorkShiftDto } from '../../../core/Models/Dtos/WorkShiftDto';
import { DayOfWeek, ListWorkShiftDto, WorkShiftDetailDto } from '../../../core/Models/Dtos/ListWorkShiftDto';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkShiftService } from '../../Services/work-shift.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-complex-work-shift',
  templateUrl: './add-complex-work-shift.component.html',
  styleUrl: './add-complex-work-shift.component.scss'
})

export class AddComplexWorkShiftComponent {
  workShiftData: WorkShiftDto | null = null;
  @Input() workShift: ListWorkShiftDto | any;
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<boolean>();
  @Output() workShiftCreated = new EventEmitter<void>();
  selectedDay: string = '';
  startTime: string = ''; 
  endTime: string = '';    
  addedShifts: { day: string, startTime: string, endTime: string }[] = []; // List of added shifts

  createComplexWorkShiftForm: FormGroup;
  shiftTypes: any[] = [];
  daysOfWeek: any[] = [];

  constructor(
    private fb: FormBuilder,
    private workShiftService: WorkShiftService,
    private toastr: ToastrService
  ) {
    this.createComplexWorkShiftForm = this.fb.group({
      shiftName: ['', Validators.required],
      shiftType: ['', Validators.required],
      workShiftDetails: this.fb.array([]) // WorkShiftDetails will be dynamically added
    });
    this.fetchShiftTypes();
    this.fetchDayofTheWeek();
  }

  ngOnInit(): void {
    
  }

  fetchDayofTheWeek(): void {
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

  fetchShiftTypes(): void {
    this.workShiftService.getShiftTypes().subscribe({
      next: (response) => {
        if (response && Array.isArray(response)) {
          this.shiftTypes = response;
        }else{
          this.toastr.error('Failed to load shift types', 'Error');
        }
      },
      error: () => {
        console.error('Error fetching shift types.');
      }
    });
  }

  get workShiftDetails(): FormArray {
    return this.createComplexWorkShiftForm.get('workShiftDetails') as FormArray;
  }



  selectDayForShift() {
    // Ensure day, start time, and end time are all selected before adding shift
    if (this.selectedDay && this.startTime && this.endTime) {
      this.addShiftToList();
    }
  }

 // Add shift details to the FormArray
addShiftToList() {
  if (this.selectedDay && this.startTime && this.endTime) {
    const shift = this.fb.group({
      day: [this.selectedDay, Validators.required],
      startTime: [this.startTime, Validators.required],
      endTime: [this.endTime, Validators.required]
    });

    this.workShiftDetails.push(shift);
    this.selectedDay = '';  // Reset selection after adding
    this.startTime = '';     // Reset time after adding
    this.endTime = '';       // Reset time after adding
  } else {
    this.toastr.error('Please select a day, start time, and end time.');
  }
}

// Handle form submission
onSubmit(): void {
  if (this.createComplexWorkShiftForm.invalid) {
    return;
  }

  const formData = { ...this.createComplexWorkShiftForm.value };
  formData.shiftType = Number(formData.shiftType);
  formData.isComplex = true;

  // Prepare the workShiftDetails to send to the server
  formData.workShiftDetails = this.workShiftDetails.value.map((shift: any) => {
    return {
      day: shift.day,
      startTime: this.convertToTimeOnly(shift.startTime),
      endTime: this.convertToTimeOnly(shift.endTime)
    };
  });

  this.workShiftData = formData;

  console.log(this.workShiftData);

  // Call the service to create the work shift
  this.workShiftService.createWorkShift(this.workShiftData).subscribe({
    next: (response) => {
      if (response.success) {
        this.toastr.success('Work Shift created successfully!');
        this.workShiftCreated.emit();
        this.closeModal();
      } else {
        this.toastr.error(response.message, 'Error');
      }
    },
    error: () => {
      console.error('Error creating work shift.');
    }
  });
}
  removeShift(index: number) {
    this.workShiftDetails.removeAt(index);
  }


  // Convert time to "HH:mm:ss" format
  convertToTimeOnly(time: string): string {
    const timeParts = time.split(':');
    if (timeParts.length === 2) {
      return `${timeParts[0].padStart(2, '0')}:${timeParts[1].padStart(2, '0')}:00`;
    }
    return time;
  }

  closeModal(): void {
    this.close.emit(false);
  }
}

 
