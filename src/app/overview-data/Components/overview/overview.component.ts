import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService
import { forkJoin } from 'rxjs'; // Import forkJoin for parallel requests
import { WorklogService } from '../../../core/Services/worklog.service';
import { UserService } from '../../../user-management/Services/user.service';
import { UserDto } from '../../../core/Models/Dtos/UserDto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  absentUsersModalVisible: boolean = false;
  lateCheckInModalVisible: boolean = false;
  earlyCheckOutModalVisible: boolean = false;
  activeWorkingModalVisible: boolean = false;
  pausedModalVisible: boolean = false;
  finishedWorkingModalVisible: boolean = false;
  outOfScheduleModalVisible: boolean = false;

  finishedWorkLogs: any = null;
  outOfScheduleActiveLogs: any = null;
  pausedWorkLogs: any = null;
  activeWorkLogs: any = null;
  lateCheckinWorkLogs: any = null;
  earlyCheckoutWorkLogs: any = null;
  selectedDate: string = ''; // Store selected date
  absenceToday: any;
  usersCount: number = 0;
  absentUsers: UserDto[] = [];

  constructor(
    private worklogService: WorklogService,
    private toastr: ToastrService,
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Set the selected date to today's date with current time on page reload
    const today = new Date();
    this.selectedDate = this.formatDateWithTime(today);
    // Fetch work logs for the current date with time
    this.fetchWorkLogs();
  }
  routeToAllTeam() {
    this.router.navigate(['data/all-team']);
    }
  // Handle date change and fetch work logs for the selected date
  onDateChange(event: any): void {
    this.selectedDate = event.target.value; // Get the selected date (date part)
    if (this.selectedDate) {
      this.selectedDate = this.appendCurrentTime(this.selectedDate); // Append current time
      this.fetchWorkLogs(); // Fetch logs for the selected date
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
    const allUsersCount$ = this.userService.getAllUsersCount();
    const finishedWorkLogs$ = this.worklogService.getFinishedWorkLogs(
      this.selectedDate
    );
    const pausedWorkLogs$ = this.worklogService.getPausedWorkLogs(
      this.selectedDate
    );
    const activeWorkLogs$ = this.worklogService.getActiveWorkLogs(
      this.selectedDate
    );
    const lateCheckinWorkLogs$ = this.worklogService.getLateCheckinWorkLogs(
      this.selectedDate
    );
    const earlyCheckoutWorkLogs$ = this.worklogService.getEarlyCheckoutWorkLogs(
      this.selectedDate
    );
    const absentWorkLogs$ = this.userService.getAllAbsentUsers(
      this.selectedDate
    );
    const outofScheduleWorkLogs$ =
      this.worklogService.getOutOfScheduleActiveLogs(this.selectedDate);
    // Execute all requests in parallel using forkJoin
    forkJoin([
      allUsersCount$,
      finishedWorkLogs$,
      pausedWorkLogs$,
      activeWorkLogs$,
      lateCheckinWorkLogs$,
      earlyCheckoutWorkLogs$,
      absentWorkLogs$,
      outofScheduleWorkLogs$,
    ]).subscribe({
      next: ([
        allUsersCountResponse,
        finishedResponse,
        pausedResponse,
        activeResponse,
        lateCheckinResponse,
        earlyCheckoutResponse,
        absentWorkLogsResponse,
        outofScheduleWorkLogsResponse,
      ]) => {
        // Store the successful responses for each request
        this.usersCount = allUsersCountResponse.count;
        this.finishedWorkLogs = finishedResponse;
        this.pausedWorkLogs = pausedResponse;
        this.activeWorkLogs = activeResponse;
        this.lateCheckinWorkLogs = lateCheckinResponse;
        this.earlyCheckoutWorkLogs = earlyCheckoutResponse;
        this.absentUsers = absentWorkLogsResponse.users;
        this.outOfScheduleActiveLogs = outofScheduleWorkLogsResponse;
      },
      error: (err) => {
        // Handle errors for any of the requests
        console.error('Error fetching work logs. Please try again.', 'Error');
      },
      complete: () => {},
    });
  }

  openAbsentUsersModal(): void {
    this.absentUsersModalVisible = true;
  }
  closeAbsentUsersModal(event: boolean): void {
    this.absentUsersModalVisible = event;
  }

  openLateCheckInModal(): void {
    this.lateCheckInModalVisible = true;
  }
  closeLateCheckInModal(event: boolean): void {
    this.lateCheckInModalVisible = event;
  }

  openActiveWorkLogsModal(): void {
    this.activeWorkingModalVisible= true;
  }
  closeActiveWorkLogsModal(event: boolean): void {
    this.activeWorkingModalVisible = event;
  }

  openPausedWorkLogsModal(): void {
    this.pausedModalVisible= true;
  }
  closePausedWorkLogsModal(event: boolean): void {
    this.pausedModalVisible = event;
  }

  openFinishedWorkLogsModal(): void {
    this.finishedWorkingModalVisible= true;
  }
  closeFinishedWorkLogsModal(event: boolean): void {
    this.finishedWorkingModalVisible = event;
  }

  openEarlyCheckoutModal(): void {
    this.earlyCheckOutModalVisible= true;
  }
  closeEarlyCheckoutModal(event: boolean): void {
    this.earlyCheckOutModalVisible = event;
  }
  openOutofScheduleModal(): void {
    this.outOfScheduleModalVisible= true;
  }
  closeOutofScheduleModal(event: boolean): void {
    this.outOfScheduleModalVisible = event;
  }
}
