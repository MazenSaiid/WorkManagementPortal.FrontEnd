import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-active-worklogs',
  templateUrl: './active-worklogs.component.html',
  styleUrl: './active-worklogs.component.scss'
})
export class ActiveWorklogsComponent implements OnInit {
  constructor(private toastr:ToastrService) {}
ngOnInit(): void {
}
@Input() isVisible: boolean = false;
@Input() activeWorkLogsToday:any = null;
@Input() todayDate : string = '';
@Output() close = new EventEmitter<boolean>();

closeModal() {
  this.close.emit(false);
}
getRequiredCheckIn(data: any): string {
  if (!data.user?.workShift?.workShiftDetails) return '-';
  
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  const shiftDetail = data.user.workShift.workShiftDetails.find(
    (shift: any) => shift.day === today
  );

  return shiftDetail ? shiftDetail.startTime : 'N/A';
}
formatTime(dateTime: string): string {
  return dateTime ? new Date(dateTime).toLocaleTimeString('en-US', { hour12: false }) : "-";
}
formatDate(dateTime: string): string {
  return dateTime ? new Date(dateTime).toDateString() : "-";
}
downloadCSV() {
  if (!this.activeWorkLogsToday || this.activeWorkLogsToday.length === 0) {
    this.toastr.warning("No data available to export.");
    return;
  }

  // Define CSV headers
  const headers = ["Id", "Employee Name", "Date", "Email",
    "Shift Name", "Shift Type","Required CheckIn Time",
    "CheckIn Time","Status"];
  
  // Format data as CSV
  // Format data as CSV
  const csvRows = this.activeWorkLogsToday.map((data: any) => [
    data.user?.employeeSerialNumber || "-",
    `${data.user?.firstName || "-"} ${data.user?.lastName || "-"}`,
    this.formatDate(this.todayDate),
    data.user?.email || "-",
    data.user?.workShift?.shiftName || "-",
    data.user?.workShift?.shiftTypeName || "-",
    this.getRequiredCheckIn(data), // Required Check-In
    this.formatTime(data.workTimeStart), // Actual Check-In
    data.isWorking? "Currently Working": "-"
  ]);

  // Convert array to CSV format
  let csvContent = "data:text/csv;charset=utf-8," 
                   + [headers.join(","), ...csvRows.map((row: any[]) => row.join(","))].join("\n");

  // Create a link and trigger download
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Active_Working_Users_${this.formatDate(this.todayDate)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
}
