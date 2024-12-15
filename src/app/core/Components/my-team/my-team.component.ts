import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../user-management/Services/user.service';
import { Globals } from '../../globals';
import { UserDto } from '../../Models/Dtos/UserDto';

@Component({
  selector: 'app-my-team',
  templateUrl: './my-team.component.html',
  styleUrl: './my-team.component.scss'
})
export class MyTeamComponent implements OnInit {
  users: UserDto[] = [];
  filteredUsers: UserDto[] = [];
  selectedFilter: string = 'All'; // Default filter
  employeesLength: number = 0;
  supervisorsLength: number = 0;
  teamLeaderLength : number = 0;
  constructor(
    private toastrService: ToastrService,
    public globals: Globals,
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadAllUsers(); // Initially load all users
    this.loadAllEmployees();
    this.loadAllSupervisors();
    this.loadAllTeamLeaders();
  }

  loadAllUsers() {
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        if (response.success) {
          this.users = response.users;
          this.filteredUsers = this.users; // Initially, all users are shown
        } else {
          this.toastrService.error(response.message, 'Error');
        }
      },
      error: (err) => {
        this.toastrService.error('An error occurred while fetching users.', 'Error');
      }
    });
  }

  loadAllEmployees() {
    this.userService.getAllEmployees().subscribe({
      next: (response) => {
        if (response.success) {
          this.users = response.users;
          this.filteredUsers = this.users;
          this.employeesLength = this.filteredUsers.length; 
        } else {
          this.toastrService.error(response.message, 'Error');
        }
      },
      error: (err) => {
        this.toastrService.error('An error occurred while fetching users.', 'Error');
      }
    });
  }

  loadAllSupervisors() {
    this.userService.getAllSupervisors().subscribe({
      next: (response) => {
        if (response.success) {
          this.users = response.users;
          this.filteredUsers = this.users;
          this.supervisorsLength =  this.filteredUsers.length; 
        } else {
          this.toastrService.error(response.message, 'Error');
        }
      },
      error: (err) => {
        this.toastrService.error('An error occurred while fetching users.', 'Error');
      }
    });
  }

  loadAllTeamLeaders() {
    this.userService.getAllTeamLeaders().subscribe({
      next: (response) => {
        if (response.success) {
          this.users = response.users;
          this.filteredUsers = this.users;
          this.teamLeaderLength =  this.filteredUsers.length
        } else {
          this.toastrService.error(response.message, 'Error');
        }
      },
      error: (err) => {
        this.toastrService.error('An error occurred while fetching users.', 'Error');
      }
    });
  }

  filterTeam(status: string) {
    this.selectedFilter = status;
    switch (status) {
      case 'All':
        this.filteredUsers = this.users;
        break;
      case 'Employees':
        this.filteredUsers = this.users.filter(user => user.roleName === 'Employee');
        break;
      case 'Supervisors':
        this.filteredUsers = this.users.filter(user => user.roleName === 'Supervisor');
        break;
      case 'TeamLeaders':
        this.filteredUsers = this.users.filter(user => user.roleName === 'TeamLead');
        break;
      default:
        this.filteredUsers = this.users;
    }
  }
}
