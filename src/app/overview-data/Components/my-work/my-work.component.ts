import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { WorklogService } from '../../../core/Services/worklog.service';
import { Globals } from '../../../core/globals';

@Component({
  selector: 'app-my-work',
  templateUrl: './my-work.component.html',
  styleUrl: './my-work.component.scss'
})
export class MyWorkComponent implements OnInit {
  workLog: any = null;
  selectedDate: string = '';
  user: any;
  totalPausedMinutes: number = 0;
  totalSpentHours: number = 0;
  totalActualWorkedHours: number =0;
  
  constructor(private workLogService:WorklogService,private toastrService: ToastrService,private globals:Globals) { }
  
  ngOnInit(): void {
    const today = new Date();
    this.selectedDate = this.formatDateWithTime(today);
    this.fetchWorkLogs(this.selectedDate);
    this.calculatePauseAndSpentTime();
  }
  // Fetch work logs for the selected date
  fetchWorkLogs(date: string){
    const currentUser = this.globals.currentUserInfo;
    if(currentUser){
      this.workLogService.getWorkLogsByDate(currentUser.userId,date).subscribe({
        next: (data) => {
          if (data.success) {
            this.toastrService.success(data.message, 'Success');
            this.workLog = data.workTrackingLog;
            this.calculatePauseAndSpentTime();
          } else {
            this.toastrService.error(data.message, 'Error');
          }
        },
        error: (err) => {
          this.toastrService.error('No work logs found for the given date', 'Error');
        }
      });
    }
    
  }
  calculatePauseAndSpentTime(): void {
    if (this.workLog) {
      // Calculate the total paused minutes
      if (this.workLog.pauseTrackingLogs) {
        this.totalPausedMinutes = this.workLog.pauseTrackingLogs.reduce((total: number, pauseLog: any) => {
          const pauseDuration = pauseLog.pauseDurationInMinutes && !isNaN(pauseLog.pauseDurationInMinutes)
            ? pauseLog.pauseDurationInMinutes
            : 0;
          return total + pauseDuration;
        }, 0);
      } else {
        this.totalPausedMinutes = 0;
      }
  
      // Calculate total spent hours based on actual work duration and paused time
      if (this.workLog.actualWorkDurationInHours) {
        this.totalActualWorkedHours = this.workLog.actualWorkDurationInHours;
        this.totalSpentHours = this.workLog.actualWorkDurationInHours + this.totalPausedMinutes / 60;
      } else if (this.workLog.workTimeStart) {
        // Calculate total spent time from workTimeStart if actualWorkDurationInHours is not set
        const workStart = new Date(this.workLog.workTimeStart); // Ensure workTimeStart is a valid Date
        const currentTime = new Date();
        const elapsedMinutes = (currentTime.getTime() - workStart.getTime()) / 60000; // Elapsed time in minutes
        this.totalSpentHours = elapsedMinutes / 60 + this.totalPausedMinutes / 60;
        this.totalActualWorkedHours = this.totalSpentHours - (this.totalPausedMinutes/60);
      } else {
        this.totalSpentHours = 0;
        this.totalActualWorkedHours = 0;
      }
    } else {
      this.totalPausedMinutes = 0;
      this.totalSpentHours = 0;
      this.totalActualWorkedHours = 0;
    }
  }
  
  formatTimeInHoursAndMinutes(minutes: number): string {
    const hours = Math.floor(minutes / 60); // Get the whole number of hours
    const remainingMinutes = Math.round(minutes % 60); // Get the remaining minutes
    return `${hours} hours ${remainingMinutes} minutes`;
  }
  
  formatSpentTime(): string {
    return this.formatTimeInHoursAndMinutes(this.totalSpentHours * 60); // Convert totalSpentHours to minutes and format
  }
  
  formatPausedTime(): string {
    return this.formatTimeInHoursAndMinutes(this.totalPausedMinutes); // Directly format totalPausedMinutes
  }
  
  formatActualWorkTime(): string {
    const actualWorkMinutes = this.totalActualWorkedHours * 60;
    return this.formatTimeInHoursAndMinutes(actualWorkMinutes);
  }
  

  // Handle date change and fetch work logs
  onDateChange(event: any): void {
    this.selectedDate = event.target.value;
    if (this.selectedDate) {
      this.fetchWorkLogs(this.selectedDate);
    }
  }
  formatTime(dateTime: string): string {
    return dateTime ? new Date(dateTime).toLocaleTimeString('en-US', { hour12: false }) : "-";
  }
  formatDate(dateTime: string): string {
    return dateTime ? new Date(dateTime).toDateString() : "-";
  }
  formatMinutes(data: any): string {
    return data > 0 ? `${Math.ceil(data)} min` : '-';
  }
  formatDateWithTime(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}
