import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../user-management/Services/user.service';
import { UserDto } from '../../../core/Models/Dtos/UserDto';
import { Globals } from '../../../core/globals';
import { forkJoin, Observable } from 'rxjs';
import { UserValidationPaginatedResponse } from '../../../core/Models/Responses/UserValidationResponse';
import { RoleService } from '../../../role-management/Services/role.service';
import { RolesListDto } from '../../../core/Models/Dtos/RolesListDto';

@Component({
  selector: 'app-my-team',
  templateUrl: './my-team.component.html',
  styleUrl: './my-team.component.scss'
})
export class MyTeamComponent implements OnInit {
  users: UserDto[] = [];
  filteredUsers: UserDto[] = [];
  selectedFilter: string = 'All'; // Default filter
  roles: { name: string; count: number }[] = []; // Holds role names & counts dynamically
  currentPage: number = 1;
  itemsPerPage: number = 12; 
  totalCount: number = 0;
  totalPages: number = 0; 

  constructor(
    private toastrService: ToastrService,
    public globals: Globals,
    private rolesService: RoleService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.fetchUsersCountLogs();
    this.loadPaginatedUsers();
    this.loadAllRoles();
  }

  loadPaginatedUsers(page: number = this.currentPage) {
    let request$: Observable<UserValidationPaginatedResponse>;
    
    if (this.selectedFilter === 'All') {
      request$ = this.userService.getAllUsersPaginated(page, this.itemsPerPage);
    } else {
      request$ = this.userService.getUsersByRolePaginated(this.selectedFilter, page, this.itemsPerPage);
    }
  
    request$.subscribe({
      next: (response) => {
        if (response.success) {
          this.users = response.users;
          this.filteredUsers = response.users;
          this.totalCount = response.totalCount;
          this.totalPages = response.totalPages;
        } else {
          this.toastrService.error(response.message, 'Error');
        }
      },
      error: (err) => {
        console.error('An error occurred while fetching users.', 'Error');
      }
    });
  }

  loadAllRoles() {
    this.rolesService.getAllRoles().subscribe({
      next: (response) => {
        if (response.success) {
          this.roles = response.roles.map((role: RolesListDto) => ({
            name: role.roleName,
            count: role.userCount || 0
          }));
          this.roles.unshift({ name: 'All', count: this.totalCount }); // Add "All" role at the beginning
        } else {
          this.toastrService.error(response.message, 'Error');
        }
      },
      error: (err) => {
        console.error('Error fetching roles.', err);
      }
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadPaginatedUsers(page); // Preserve filter during pagination
  }

  fetchUsersCountLogs(): void {
    const allUsersCount$ = this.userService.getAllUsersCount();
    const roleCounts$ = this.rolesService.getUserCountPerRole(); // Fetch all role counts

    forkJoin([allUsersCount$, roleCounts$]).subscribe({
      next: ([allUsersResponse, roleCountsResponse]) => {
        this.totalCount = allUsersResponse.count;
        this.roles = roleCountsResponse.roles.map((role: RolesListDto) => ({
          name: role.roleName,
          count: role.userCount || 0
        }));
        this.roles.unshift({ name: 'All', count: this.totalCount });
      },
      error: (err) => {
        console.error('Error fetching user counts.', err);
      }
    });
  }

  filterTeam(role: string) {
    this.selectedFilter = role;
    this.currentPage = 1;
    this.loadPaginatedUsers(1);
  }
}

