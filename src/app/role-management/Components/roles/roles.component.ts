import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RoleService } from '../../Services/role.service';
import { RolesListDto } from '../../../core/Models/Dtos/RolesListDto';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent implements OnInit{
  allRoles: RolesListDto[] = [];
  selectedRole: RolesListDto | any = null; // To store the selected role for editing/viewing/deleting
  filteredRoles: RolesListDto[] = [];   // This will hold the filtered roles
  searchText: string = '';  // This binds to the search input field
  createRoleModalVisible: boolean = false;
  editRoleModalVisible: boolean = false;
  viewRoleModalVisible: boolean = false;
  deleteRoleModalVisible:boolean = false;
  constructor(private toastrService: ToastrService, private rolesService: RoleService) {
    
  }
  ngOnInit(): void {
    this.loadAllRolesAndCount();
  }
  filterRoles() {
    if (!this.searchText) {
      // If no search text, show all roles
      this.filteredRoles = this.allRoles;
    } else {
      // Filter roles based on the search text (by name)
      this.filteredRoles = this.allRoles.filter(role => {
        const roleName =  role.roleName.toLowerCase(); 
        return roleName.includes(this.searchText.toLowerCase());
      });
    }
  }
  
  loadAllRolesAndCount() {
    this.rolesService.getUserCountPerRole().subscribe({
      next: (response) => {
        if (response.success) {
          this.allRoles = response.roles; // Now contains allroles
          this.filteredRoles = response.roles;
        } else {
          this.toastrService.error(response.message, 'Error'); // Show error using Toastr
        }
      },
      error: (err) => {
        this.toastrService.error('An error occurred while fetching roles.', 'Error'); // Show error using Toastr
      }
    });
  }
// Method to open Create Role Modal
  openCreateRoleModal(): void {
    this.createRoleModalVisible = true;
  }
   // Method to close Create Role Modal
   closeCreateRoleModal(event: boolean): void {
    this.createRoleModalVisible = event;
  }
   // Method to delete Role Modal
   openDeleteConfirmationModal(role: RolesListDto) {
    this.selectedRole = role;
   this.deleteRoleModalVisible =true;
  }
  // Method to close Create Role Modal
  closeDeleteRoleModal(event: boolean): void {
    this.deleteRoleModalVisible = event;
  }
  // Method to open Edit Role Modal
  openEditRoleModal(role: RolesListDto): void {
    this.selectedRole = role; // Set the user to be edited
    this.editRoleModalVisible = true;
  }

  // Method to close Edit Role Modal
  closeEditRoleModal(event: boolean): void {
    this.editRoleModalVisible = event;
  }

  // Method to open View Role Modal
  openViewRoleModal(role: RolesListDto): void {
    this.selectedRole = role; // Set the role to be viewed
    this.viewRoleModalVisible = true;
  }

  // Method to close View Role Modal
  closeViewRoleModal(event: boolean): void {
    this.viewRoleModalVisible = event;
  }

}
