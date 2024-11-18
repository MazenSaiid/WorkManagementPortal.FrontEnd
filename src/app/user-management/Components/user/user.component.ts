import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Globals } from '../../../core/globals';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../../Services/user.service';
import { UserDto } from '../../../core/Models/UserDto';
import { DeleteConfirmationModalComponent } from '../../../core/Components/delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  constructor(private toastrService: ToastrService, public globals: Globals, private http: HttpClient, private router: Router, private userService: UserService) {
  }
  users: UserDto[] = [];
  selectedUser: UserDto | any = null; // To store the selected user for editing/viewing
  createUserModalVisible: boolean = false;
  editUserModalVisible: boolean = false;
  viewUserModalVisible: boolean = false;
  ngOnInit(): void {
    this.loadAllUsers();
  }
  loadAllUsers() {
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        if (response.success) {
          this.users = response.users; // Now contains supervisor and team leader
        } else {
          this.toastrService.error(response.message, 'Error'); // Show error using Toastr
        }
      },
      error: (err) => {
        this.toastrService.error('An error occurred while fetching users.', 'Error'); // Show error using Toastr
      }
    });
  }
  
 // Delete a user by ID
 deleteUser(id: string) {
  this.userService.deleteUser(id).subscribe({
    next: (response) => {
      if (response.success) {
        this.loadAllUsers(); // Reload the list after deletion
        this.toastrService.success('User deleted successfully', 'Success');
      } else {
        this.toastrService.error(response.message, 'Error');
      }
    },
    error: () => {
      this.toastrService.error('An error occurred while deleting the user.', 'Error');
    }
  });
}
  // Method to open Create User Modal
  openCreateUserModal(): void {
    this.createUserModalVisible = true;
  }

  // Method to close Create User Modal
  closeCreateUserModal(event: boolean): void {
    this.createUserModalVisible = event;
  }

  // Method to open Edit User Modal
  openEditUserModal(user: UserDto): void {
    this.selectedUser = user; // Set the user to be edited
    this.editUserModalVisible = true;
  }

  // Method to close Edit User Modal
  closeEditUserModal(event: boolean): void {
    this.editUserModalVisible = event;
  }

  // Method to open View User Modal
  openViewUserModal(user: UserDto): void {
    this.selectedUser = user; // Set the user to be viewed
    this.viewUserModalVisible = true;
  }

  // Method to close View User Modal
  closeViewUserModal(event: boolean): void {
    this.viewUserModalVisible = event;
  }
}
