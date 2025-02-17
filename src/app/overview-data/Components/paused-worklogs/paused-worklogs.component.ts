import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-paused-worklogs',
  templateUrl: './paused-worklogs.component.html',
  styleUrl: './paused-worklogs.component.scss'
})
export class PausedWorklogsComponent implements OnInit {
  constructor(private toastr:ToastrService) {}

ngOnInit(): void {
}
@Input() isVisible: boolean = false;
@Input() pausedWorkLogsToday:any = null;
@Input() todayDate : string = '';
@Output() close = new EventEmitter<boolean>();

closeModal() {
  this.close.emit(false);
}
formatMinutes(data: any): string {
  return data > 0 ? `${Math.floor(data)} min` : '-';
}
formatTime(dateTime: string): string {
  return dateTime ? new Date(dateTime).toLocaleTimeString('en-US', { hour12: false }) : "-";
}
formatDate(dateTime: string): string {
  return dateTime ? new Date(dateTime).toDateString() : "-";
}
downloadCSV() {
  if (!this.pausedWorkLogsToday || this.pausedWorkLogsToday.length === 0) {
    this.toastr.warning("No data available to export.");
    return;
  }

  // Define CSV headers
  const headers = ["Id", "Employee Name", "Date", "Email",
    "Shift Name", "Shift Type",
    "Actual CheckIn Time"];
  
  // Format data as CSV
  // Format data as CSV
  const csvRows = this.pausedWorkLogsToday.map((data: any) => [
    data.user?.employeeSerialNumber || "-",
    `${data.user?.firstName || "-"} ${data.user?.lastName || "-"}`,
    this.formatDate(this.todayDate),
    data.user?.email || "-",
    data.user?.workShift?.shiftName || "-",
    data.user?.workShift?.shiftTypeName || "-",
    this.formatTime(data.workTimeStart), // Actual Check-In
  ]);

  // Convert array to CSV format
  let csvContent = "data:text/csv;charset=utf-8," 
                   + [headers.join(","), ...csvRows.map((row: any[]) => row.join(","))].join("\n");

  // Create a link and trigger download
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Paused_Logs_Users_${this.formatDate(this.todayDate)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
}
