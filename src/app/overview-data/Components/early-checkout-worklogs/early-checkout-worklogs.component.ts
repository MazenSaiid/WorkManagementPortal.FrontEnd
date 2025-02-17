import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-early-checkout-worklogs',
  templateUrl: './early-checkout-worklogs.component.html',
  styleUrl: './early-checkout-worklogs.component.scss'
})
export class EarlyCheckoutWorklogsComponent implements OnInit {
  constructor(private toastr:ToastrService) {}
  
ngOnInit(): void {
}
@Input() isVisible: boolean = false;
@Input() earlyCheckoutWorkLogsToday:any = null;
@Input() todayDate : string = '';
@Output() close = new EventEmitter<boolean>();
closeModal() {
  this.close.emit(false);
}
getRequiredCheckout(data: any): string {
  if (!data.user?.workShift?.workShiftDetails) return '-';
  
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  const shiftDetail = data.user.workShift.workShiftDetails.find(
    (shift: any) => shift.day === today
  );

  return shiftDetail ? shiftDetail.endTime : 'N/A';
}
getEarlyBy(data: any): string {
  const requiredCheckout = this.getRequiredCheckout(data);
  if (requiredCheckout === 'N/A' || !data.workTimeEnd) return '-';

  const requiredCheckOutTime = new Date(`${data.workDate}T${requiredCheckout}`);
  const actualCheckoutTime = new Date(data.workTimeEnd);

  const diffInMinutes = (requiredCheckOutTime.getTime() - actualCheckoutTime.getTime()) / 60000;

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
formatTimeInHoursAndMinutes(Workhours: number): string {
  const totalinMinutes = Workhours * 60 ;
  const hours = Math.floor(totalinMinutes / 60); // Get the whole number of hours
  const remainingMinutes = Math.round(totalinMinutes % 60); // Get the remaining minutes
  return `${hours} hours ${remainingMinutes} minutes`;
}
downloadCSV() {
  if (!this.earlyCheckoutWorkLogsToday || this.earlyCheckoutWorkLogsToday.length === 0) {
    this.toastr.warning("No data available to export.");
    return;
  }

  // Define CSV headers
  const headers = ["Id", "Employee Name", "Date", "Email",
    "Shift Name", "Shift Type",
    "Required CheckIn Time","Actual Check-In Time","Actual Check-Out Time","Required Checkout Time","Actual Work Duration","Early By"];
  
  // Format data as CSV
  // Format data as CSV
  const csvRows = this.earlyCheckoutWorkLogsToday.map((data: any) => [
    data.user?.employeeSerialNumber || "-",
    `${data.user?.firstName || "-"} ${data.user?.lastName || "-"}`,
    this.formatDate(this.todayDate),
    data.user?.email || "-",
    data.user?.workShift?.shiftName || "-",
    data.user?.workShift?.shiftTypeName || "-",
    this.getRequiredCheckIn(data),
    this.formatTime(data.workTimeStart), // Actual Check-In
    this.formatTime(data.workTimeEnd), // Actual Check-Out
    this.getRequiredCheckout(data),
    this.formatTimeInHoursAndMinutes(data.actualWorkDurationInHours),
    this.getEarlyBy(data),
  ]);

  // Convert array to CSV format
  let csvContent = "data:text/csv;charset=utf-8," 
                   + [headers.join(","), ...csvRows.map((row: any[]) => row.join(","))].join("\n");

  // Create a link and trigger download
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `EarlyCheckout_Working_Users_${this.formatDate(this.todayDate)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
}
