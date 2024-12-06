import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RolesListDto } from '../../../core/Models/Dtos/RolesListDto';

@Component({
  selector: 'app-view-roles',
  templateUrl: './view-roles.component.html',
  styleUrl: './view-roles.component.scss'
})
export class ViewRolesComponent{
  
  @Input() role: RolesListDto | any ;
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<boolean>();

  closeModal(): void {
    this.close.emit(false); // Emit false to close the modal
  }
}
