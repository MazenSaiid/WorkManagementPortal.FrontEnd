import { Component } from '@angular/core';

@Component({
  selector: 'app-worklog-reports',
  templateUrl: './worklog-reports.component.html',
  styleUrl: './worklog-reports.component.scss'
})
export class WorklogReportsComponent {
  selectedRange: string = 'Select Date Range'; // Default dropdown text
  selectedMonth: string = '';

  // Handle the selection from the dropdown
  selectRange(range: string): void {
    this.selectedRange = range;
    if (range !== 'customMonth') {
      this.selectedMonth = '';  // Reset selected month if not "Specific Month"
    }
  }

  // Form submission logic
  onSubmit(): void {
    let reportPeriod = this.selectedRange;

    if (this.selectedRange === 'customMonth' && this.selectedMonth) {

    }
  }
}
