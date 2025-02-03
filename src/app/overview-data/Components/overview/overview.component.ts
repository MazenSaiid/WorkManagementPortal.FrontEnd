import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService
import { forkJoin } from 'rxjs';  // Import forkJoin for parallel requests
import { WorklogService } from '../../../core/Services/worklog.service';
import { UserService } from '../../../user-management/Services/user.service';
import { UserDto } from '../../../core/Models/Dtos/UserDto';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  finishedWorkLogs: any = null;  
  pausedWorkLogs: any = null;    
  activeWorkLogs: any = null;    
  lateCheckinWorkLogs:any= null;
  earlyCheckoutWorkLogs:any=null;
  selectedDate: string = '';     // Store selected date
  absenceToday: any;
  lateClockInEmployees: any;
  users: UserDto[] = [];
  absentUsers: UserDto[] = [];

  constructor(private worklogService: WorklogService, private toastr: ToastrService,private userService: UserService) {}

  ngOnInit(): void {
    // Set the selected date to today's date with current time on page reload
    const today = new Date();
    this.selectedDate = this.formatDateWithTime(today);

    // Fetch work logs for the current date with time
    this.fetchWorkLogs();
    this.loadAllUsers();
    this.loadAllAbsentUsers(this.selectedDate);
  }
  loadAllUsers() {
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        if (response.success) {
          this.users = response.users;
        } else {
          this.toastr.error(response.message, 'Error');
        }
      },
      error: (err) => {
        console.error('An error occurred while fetching users.', 'Error');
      }
    });
  }
  loadAllAbsentUsers(selectedDate: string) {
    console.log(selectedDate);
    this.userService.getAllAbsentUsers(selectedDate).subscribe({
      next: (response) => {
        if (response.success) {
          this.absentUsers = response.users;
          console.log(response.users);
        } else {
          this.toastr.error(response.message, 'Error');
        }
      },
      error: (err) => {
        console.error('An error occurred while fetching users.', 'Error');
      }
    });
  }
  // Handle date change and fetch work logs for the selected date
  onDateChange(event: any): void {
    this.selectedDate = event.target.value;  // Get the selected date (date part)
    if (this.selectedDate) {
      this.selectedDate = this.appendCurrentTime(this.selectedDate);  // Append current time
      this.fetchWorkLogs(); // Fetch logs for the selected date
      this.loadAllAbsentUsers(this.selectedDate);
    }
  }
   // Format the date with time (YYYY-MM-DD HH:mm:ss)
   formatDateWithTime(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  // Append the current time to the selected date (in case user selects a date)
  appendCurrentTime(date: string): string {
    const currentDate = new Date();
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');
    
    return `${date} ${hours}:${minutes}:${seconds}`;
  }
  // Fetch work logs for the selected date using forkJoin to execute all requests in parallel
  fetchWorkLogs(): void {
    const finishedWorkLogs$ = this.worklogService.getFinishedWorkLogs(this.selectedDate);
    const pausedWorkLogs$ = this.worklogService.getPausedWorkLogs(this.selectedDate);
    const activeWorkLogs$ = this.worklogService.getActiveWorkLogs(this.selectedDate);
    const lateCheckinWorkLogs$ = this.worklogService.getLateCheckinWorkLogs(this.selectedDate);
    const earlyCheckoutWorkLogs$ = this.worklogService.getEarlyCheckoutWorkLogs(this.selectedDate);
     // Execute all requests in parallel using forkJoin
     forkJoin([finishedWorkLogs$, pausedWorkLogs$, activeWorkLogs$,lateCheckinWorkLogs$,earlyCheckoutWorkLogs$]).subscribe({
      next: ([finishedResponse, pausedResponse, activeResponse,lateCheckinResponse,earlyCheckoutResponse]) => {
        // Store the successful responses for each request
        this.finishedWorkLogs = finishedResponse;  
        this.pausedWorkLogs = pausedResponse;      
        this.activeWorkLogs = activeResponse; 
        this.lateCheckinWorkLogs = lateCheckinResponse;
        this.earlyCheckoutWorkLogs = earlyCheckoutResponse;     
      },
      error: (err) => {
        // Handle errors for any of the requests
        console.error('Error fetching work logs. Please try again.', 'Error');
      },
      complete: () => {
      }
    });
  }
}
