import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-finished-worklogs',
  templateUrl: './finished-worklogs.component.html',
  styleUrl: './finished-worklogs.component.scss'
})
export class FinishedWorklogsComponent implements OnInit {
  constructor(private toastr:ToastrService) {}
  
ngOnInit(): void {
}
@Input() isVisible: boolean = false;
@Input() finishedWorkLogsToday:any = null;
@Input() todayDate : string = '';
@Output() close = new EventEmitter<boolean>();
closeModal() {
  this.close.emit(false);
}
formatTime(dateTime: string): string {
  return dateTime ? new Date(dateTime).toLocaleTimeString('en-US', { hour12: false }) : "-";
}
formatTimeInHoursAndMinutes(Workhours: number): string {
  const totalinMinutes = Workhours * 60 ;
  const hours = Math.floor(totalinMinutes / 60); // Get the whole number of hours
  const remainingMinutes = Math.round(totalinMinutes % 60); // Get the remaining minutes
  return `${hours} hours ${remainingMinutes} minutes`;
}
formatDate(dateTime: string): string {
  return dateTime ? new Date(dateTime).toDateString() : "-";
}
downloadCSV() {
  if (!this.finishedWorkLogsToday || this.finishedWorkLogsToday.length === 0) {
    this.toastr.warning("No data available to export.");
    return;
  }

  // Define CSV headers
  const headers = ["Id", "Employee Name", "Date", "Email",
    "Shift Name", "Shift Type",
    "CheckIn Time","CheckOut Time","Actual Work Duration","Status"];
  
  // Format data as CSV
  // Format data as CSV
  const csvRows = this.finishedWorkLogsToday.map((data: any) => [
    data.user?.employeeSerialNumber || "-",
    `${data.user?.firstName || "-"} ${data.user?.lastName || "-"}`,
    this.formatDate(this.todayDate),
    data.user?.email || "-",
    data.user?.workShift?.shiftName || "-",
    data.user?.workShift?.shiftTypeName || "-",
    this.formatTime(data.workTimeStart), // Actual Check-In
    this.formatTime(data.workTimeEnd), // Actual Check-out
    this.formatTimeInHoursAndMinutes(data.actualWorkDurationInHours),
    data.hasFinished? "Finished Working": "-"
  ]);

  // Convert array to CSV format
  let csvContent = "data:text/csv;charset=utf-8," 
                   + [headers.join(","), ...csvRows.map((row: any[]) => row.join(","))].join("\n");

  // Create a link and trigger download
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Finished_Working_Users_${this.formatDate(this.todayDate)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
}
