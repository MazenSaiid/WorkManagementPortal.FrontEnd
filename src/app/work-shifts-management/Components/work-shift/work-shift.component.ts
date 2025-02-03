import { Component, OnInit } from '@angular/core';
import { ListWorkShiftDto } from '../../../core/Models/Dtos/ListWorkShiftDto';
import { WorkShiftService } from '../../Services/work-shift.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-work-shift',
  templateUrl: './work-shift.component.html',
  styleUrl: './work-shift.component.scss'
})
export class WorkShiftComponent implements OnInit {

  workShifts: ListWorkShiftDto[] = [];
  selectedWorkShift: ListWorkShiftDto | any = null; // To store the selected workshifts for editing/viewing/deleting
  filteredWorkShifts: ListWorkShiftDto[] = [];   // This will hold the filtered workshifts
  searchText: string = '';  // This binds to the search input field
  createComplexWorkShiftModalVisible: boolean = false;
  editWorkShiftModalVisible: boolean = false;
  viewWorkShiftModalVisible: boolean = false;
  deleteWorkShiftModalVisible:boolean = false;
  currentPage: number =1;
  itemsPerPage: number = 5; 
  constructor(private toastrService: ToastrService, private http: HttpClient, private workShiftService: WorkShiftService) {

  }
  formatTimeToDate(timeString: string): Date {
    const [hours, minutes, seconds] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    date.setSeconds(parseInt(seconds, 10));
    return date;
  }
  ngOnInit(): void {
    this.loadAllWorkShifts();
  }
  loadAllWorkShifts() {
    this.workShiftService.getAllWorkShifts().subscribe({
      next: (response) => {
        if (response.success) {
          this.workShifts = response.workShifts;
          this.filteredWorkShifts = response.workShifts;
        } else {
          this.toastrService.error(response.message, 'Error'); // Show error using Toastr
        }
      },
      error: (err) => {
       console.error('An error occurred while fetching Work Shifts.', 'Error'); // Show error using Toastr
      }
    });
  }

  filterWorkShifts() {
    if (!this.searchText) {
      // If no search text, show all WorkShifts
      this.filteredWorkShifts = this.workShifts;
    } else {
      // Filter WorkShifts based on the search text (by full name)
      this.filteredWorkShifts = this.workShifts.filter(workshift => {
        const WorkShiftName = (workshift.shiftName).toLowerCase();
        return WorkShiftName.includes(this.searchText.toLowerCase());
      });
    }
  }
  // Method to open Create WorkShift Modal
  openCreateComplexWorkShiftModal(): void {
    this.createComplexWorkShiftModalVisible = true;
  }
  // Method to close Create WorkShift Modal
  closeCreateComplexWorkShiftModal(event: boolean): void {
    this.createComplexWorkShiftModalVisible = event;
  }
  // Method to delete WorkShift Modal
  openDeleteConfirmationModal(workshift: ListWorkShiftDto) {
    this.selectedWorkShift = workshift;
   this.deleteWorkShiftModalVisible =true;
  }
  // Method to close delete WorkShift Modal
  closeDeleteWorkShiftModal(event: boolean): void {
    this.deleteWorkShiftModalVisible = event;
  }
  // Method to open Edit WorkShift Modal
  openEditWorkShiftModal(workshift: ListWorkShiftDto): void {
    this.selectedWorkShift = workshift; // Set the WorkShift to be edited
    this.editWorkShiftModalVisible = true;
  }
  // Method to close Edit WorkShift Modal
  closeEditWorkShiftModal(event: boolean): void {
    this.editWorkShiftModalVisible = event;
  }

  // Method to open View WorkShift Modal
  openViewWorkShiftModal(workshift: ListWorkShiftDto): void {
    this.selectedWorkShift = workshift; // Set the WorkShift to be viewed
    this.viewWorkShiftModalVisible = true;
  }
  // Method to close View WorkShift Modal
  closeViewWorkShiftModal(event: boolean): void {
    this.viewWorkShiftModalVisible = event;
  }
}
