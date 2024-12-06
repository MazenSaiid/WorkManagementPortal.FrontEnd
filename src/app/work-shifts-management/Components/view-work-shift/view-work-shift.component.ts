import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ListWorkShiftDto } from '../../../core/Models/Dtos/ListWorkShiftDto';

@Component({
  selector: 'app-view-work-shift',
  templateUrl: './view-work-shift.component.html',
  styleUrl: './view-work-shift.component.scss'
})
export class ViewWorkShiftComponent {
  @Input() workShift: ListWorkShiftDto | null = null; // Receive the workshift object to display
  @Input() isVisible: boolean = false; // Controls modal visibility
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>(); // Emit event to close modal

  // Method to close the modal
  closeModal(): void {
    this.close.emit(false); // Emit false to close the modal
  }
  formatTimeToDate(timeString: string): Date {
    const [hours, minutes, seconds] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    date.setSeconds(parseInt(seconds, 10));
    return date;
  }
}
