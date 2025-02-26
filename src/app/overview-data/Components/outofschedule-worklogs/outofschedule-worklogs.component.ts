import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-outofschedule-worklogs',
  templateUrl: './outofschedule-worklogs.component.html',
  styleUrl: './outofschedule-worklogs.component.scss'
})
export class OutofscheduleWorklogsComponent implements OnInit {
  constructor(private toastr:ToastrService) {}
  
ngOnInit(): void {
}
@Input() isVisible: boolean = false;
@Input() outOfScheduleLogsToday:any = null;
@Input() todayDate : string = '';
@Output() close = new EventEmitter<boolean>();
getEarlyOrLateBy(data: any): string {
  const requiredCheckIn = this.getRequiredCheckIn(data);
  const requiredCheckout = this.getRequiredCheckout(data);

  if (requiredCheckIn === 'N/A' || requiredCheckout === 'N/A') return '-';

  const actualCheckIn = new Date(data.workTimeStart);
  const actualCheckout = data.workTimeEnd ? new Date(data.workTimeEnd) : null;

  const requiredCheckInTime = new Date(`${data.workDate}T${requiredCheckIn}`);
  const requiredCheckOutTime = new Date(`${data.workDate}T${requiredCheckout}`);

  if (actualCheckIn < requiredCheckInTime) {
    const diffInMinutes = (requiredCheckInTime.getTime() - actualCheckIn.getTime()) / 60000;
    return `Early by ${this.formatDuration(diffInMinutes)}`;
  }

  if (actualCheckout && actualCheckout > requiredCheckOutTime) {
    const diffInMinutes = (actualCheckout.getTime() - requiredCheckOutTime.getTime()) / 60000;
    return `Late by ${this.formatDuration(diffInMinutes)}`;
  }

  return 'On Time';
}
getDayOfWeek(date: string): string {
  return date ? new Date(date).toLocaleDateString('en-US', { weekday: 'long' }) : '-';
}
formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);

  if (hours > 0 && mins > 0) {
    return `${hours} hours ${mins} minutes`;
  } else if (hours > 0) {
    return `${hours} hours`;
  } else {
    return `${mins} minutes`;
  }
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
      return `${hours} hr ${minutes} min`;
    } else if (hours > 0) {
      return `${hours} hr`;
    } else {
      return `${minutes} min`;
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
closeModal() {
  this.close.emit(false);
}
formatTime(dateTime: string): string {
  return dateTime ? new Date(dateTime).toLocaleTimeString('en-US', { hour12: false }) : "-";
}
formatDate(dateTime: string): string {
  return dateTime ? new Date(dateTime).toDateString() : "-";
}
downloadCSV() {
  if (!this.outOfScheduleLogsToday || this.outOfScheduleLogsToday.length === 0) {
    this.toastr.warning("No data available to export.");
    return;
  }

  // Define CSV headers
  const headers = ["Id", "Employee Name", "Date","Day", "Email",
    "Shift Name", "Shift Type",
    "Required Check-In Time","Actual Check-In Time","Required Check-Out Time","Actual Check-Out Time","Worked Overtime","Early By/Late By"];
  
  // Format data as CSV
  // Format data as CSV
  const csvRows = this.outOfScheduleLogsToday.map((data: any) => [
    data.user?.employeeSerialNumber || "-",
    `${data.user?.firstName || "-"} ${data.user?.lastName || "-"}`,
    this.formatDate(data.workDate),
    this.formatDate(this.todayDate),
    data.user?.email || "-",
    data.user?.workShift?.shiftName || "-",
    data.user?.workShift?.shiftTypeName || "-",
    this.getRequiredCheckIn(data),
    this.formatTime(data.workTimeStart), // Actual Check-In
    this.getRequiredCheckout(data),
    this.formatTime(data.workTimeEnd), // Actual Check-In
    data.workedOvertime? "No": this.formatDuration(data.overtimeWorkDurationInHours * 60),
    this.getEarlyOrLateBy(data)
  ]);

  // Convert array to CSV format
  let csvContent = "data:text/csv;charset=utf-8," 
                   + [headers.join(","), ...csvRows.map((row: any[]) => row.join(","))].join("\n");

  // Create a link and trigger download
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `OutOfSchecule_Working_Users_${this.formatDate(this.todayDate)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
}
