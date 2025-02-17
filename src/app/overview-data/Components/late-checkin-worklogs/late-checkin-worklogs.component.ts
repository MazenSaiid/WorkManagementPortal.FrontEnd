import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-late-checkin-worklogs',
  templateUrl: './late-checkin-worklogs.component.html',
  styleUrl: './late-checkin-worklogs.component.scss'
})
export class LateCheckinWorklogsComponent implements OnInit {
  constructor(private toastr:ToastrService) {}
ngOnInit(): void {
}
@Input() isVisible: boolean = false;
@Input() lateCheckinToday:any = null;
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
getLateBy(data: any): string {
  const requiredCheckIn = this.getRequiredCheckIn(data);
  if (requiredCheckIn === 'N/A' || !data.workTimeStart) return '-';

  const requiredCheckInTime = new Date(`${data.workDate}T${requiredCheckIn}`);
  const actualCheckInTime = new Date(data.workTimeStart);

  const diffInMinutes = (actualCheckInTime.getTime() - requiredCheckInTime.getTime()) / 60000;

  if (diffInMinutes > 0) {
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = Math.floor(diffInMinutes % 60);
    
    if (hours > 0 && minutes > 0) {
      return `${hours} hours ${minutes} minutes`;
    } else if (hours > 0) {
      return `${hours} hours`;
    } else {
      return `${minutes} minutes`;
    }
  } else {
    return "On Time";
  }
}

downloadCSV() {
  if (!this.lateCheckinToday || this.lateCheckinToday.length === 0) {
    this.toastr.warning("No data available to export.");
    return;
  }

  // Define CSV headers
  const headers = ["Id", "Employee Name", "Date", "Email",
    "Shift Name", "Shift Type",
    "Actual CheckIn Time", "Required CheckIn Time", "Late By"];
  
  // Format data as CSV
  // Format data as CSV
  const csvRows = this.lateCheckinToday.map((data: any) => [
    data.user?.employeeSerialNumber || "-",
    `${data.user?.firstName || "-"} ${data.user?.lastName || "-"}`,
    this.formatDate(this.todayDate),
    data.user?.email || "-",
    data.user?.workShift?.shiftName || "-",
    data.user?.workShift?.shiftTypeName || "-",
    this.formatTime(data.workTimeStart), // Actual Check-In
    this.getRequiredCheckIn(data), // Required Check-In
    this.getLateBy(data) // Late By
  ]);

  // Convert array to CSV format
  let csvContent = "data:text/csv;charset=utf-8," 
                   + [headers.join(","), ...csvRows.map((row: any[]) => row.join(","))].join("\n");

  // Create a link and trigger download
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Late_CheckIn_Users_${this.formatDate(this.todayDate)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
}


