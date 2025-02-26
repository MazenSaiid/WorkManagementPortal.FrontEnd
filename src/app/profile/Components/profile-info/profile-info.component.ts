import { Component, Input, OnInit } from '@angular/core';
import { Globals } from '../../../core/globals';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../user-management/Services/user.service';
import { UserDto } from '../../../core/Models/Dtos/UserDto';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrl: './profile-info.component.scss'
})
export class ProfileInfoComponent implements OnInit {
constructor(private userService:UserService,private globals: Globals,private router:Router,private toastr:ToastrService) {
  }

  currentUser: any | null = null;
  ngOnInit(): void {
    this.getCurrentUserInfo();
  }
  getCurrentUserInfo(){
    const currentUser = this.globals.currentUserInfo; // Store in a variable
    if(currentUser){
      this.userService.getUserById(currentUser.userId).subscribe({
        next: (response) => {
          if (response.success) {
            this.currentUser = response.users[0];
          } else {
            this.toastr.error(response.message, 'Error'); // Show error using Toastr
          }
        },
        error: (err) => {
          console.error('An error occurred while fetching the user.', 'Error'); // Show error using Toastr
        }
      })
    }
  }
}
