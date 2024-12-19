import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { WorklogService } from '../../../core/Services/worklog.service';

@Component({
  selector: 'app-my-work',
  templateUrl: './my-work.component.html',
  styleUrl: './my-work.component.scss'
})
export class MyWorkComponent {
  workLog: any = null;
  selectedDate: string = '';
  constructor(private workLogService:WorklogService,private toastrService: ToastrService) { }

  // Fetch work logs for the selected date
  fetchWorkLogs(date: string){
    this.workLogService.getWorkLogsByDate().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          // Assuming only one log for the day
          this.workLog = data[0];
        } else {
          this.toastrService.error(data.message, 'Error');
        }
      },
      error: (err) => {
        this.toastrService.error('An error occurred while worklogs.', 'Error');
      }
    });
  }
  // Handle date change and fetch work logs
  onDateChange(event: any): void {
    this.selectedDate = event.target.value;
    if (this.selectedDate) {
      this.fetchWorkLogs(this.selectedDate);
    }
  }
}
