import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-absent-users',
  templateUrl: './absent-users.component.html',
  styleUrl: './absent-users.component.scss'
})
export class AbsentUsersComponent implements OnInit {
constructor(private toastr:ToastrService) {}

ngOnInit(): void {
}
@Input() isVisible: boolean = false;
@Input() absentUsersToday:any = null;
@Input() todayDate : string = '';
@Output() close = new EventEmitter<boolean>();

closeModal() {
  this.close.emit(false);
}
formatDate(dateTime: string): string {
  return dateTime ? new Date(dateTime).toDateString() : "-";
}
downloadCSV() {
  if (!this.absentUsersToday || this.absentUsersToday.length === 0) {
    this.toastr.warning("No data available to export.");
    return;
  }
  
  // Define CSV headers
  const headers = ["Id", "Name","Date", "Email", "Phone", "Role", "Shift Name", "Shift Type", "Supervisor", "Team Leader"];
  
  // Format data as CSV
  const csvRows = this.absentUsersToday.map((employee: { employeeSerialNumber: any; firstName: any; lastName: any; email: any; phoneNumber: any; roleName: any; workShift: { shiftName: any; shiftTypeName: any; }; supervisor: { firstName: any; lastName: any; }; teamLeader: { firstName: any; lastName: any; }; }) => [
    employee.employeeSerialNumber || "-",
    `${employee.firstName || "-"} ${employee.lastName || "-"}`,
    this.formatDate(this.todayDate),
    employee.email || "-",
    employee.phoneNumber || "-",
    employee.roleName || "-",
    employee.workShift?.shiftName || "-",
    employee.workShift?.shiftTypeName || "-",
    employee.supervisor ? `${employee.supervisor.firstName || "-"} ${employee.supervisor.lastName || "-"}` : "-",
    employee.teamLeader ? `${employee.teamLeader.firstName || "-"} ${employee.teamLeader.lastName || "-"}` : "-"
  ]);

  // Convert array to CSV format
  let csvContent = "data:text/csv;charset=utf-8," 
                   + [headers.join(","), ...csvRows.map((row: any[]) => row.join(","))].join("\n");

  // Create a link and trigger download
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Absent_Users_${ this.formatDate(this.todayDate)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

}
