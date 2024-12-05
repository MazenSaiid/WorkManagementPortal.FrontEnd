import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-checkout-confirmation-modal',
  templateUrl: './checkout-confirmation-modal.component.html',
  styleUrl: './checkout-confirmation-modal.component.scss'
})
export class CheckoutConfirmationModalComponent {
  @Input() isVisible: boolean = false; 
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
  closeModal(): void {
    this.close.emit(false); // Emit false to close the modal
  }
  checkoutUser()  {
  }
}
