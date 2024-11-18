import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserDto } from '../../../core/Models/UserDto';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent {
  @Input() user: UserDto | null = null; // Receive the user object to display
  @Input() isVisible: boolean = false; // Controls modal visibility
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>(); // Emit event to close modal

  // Method to close the modal
  closeModal(): void {
    this.close.emit(false); // Emit false to close the modal
  }
}
