import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-delete-confirmation-modal',
  templateUrl: './delete-confirmation-modal.component.html',
  styleUrl: './delete-confirmation-modal.component.scss'
})
export class DeleteConfirmationModalComponent {
  @Input() userId: string | null = null;
  @Input() userName: string = '';
  @Output() confirmDelete = new EventEmitter<string>();

  onDelete() {
    if (this.userId) {
      this.confirmDelete.emit(this.userId);
    }
  }
}
