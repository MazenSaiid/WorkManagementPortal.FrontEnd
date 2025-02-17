import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Globals } from '../../globals';
import { AccountService } from '../../Services/account.service';
import { AccountServiceValidationResponse } from '../../Models/Responses/UserValidationResponse';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  constructor(private accountService:AccountService,private globals: Globals,private router:Router,private toastr:ToastrService) {
  }

  currentUser: any = null;
  ngOnInit(): void {
    // Subscribe to the currentUser$ observable to get updates
    this.globals.currentUser$.subscribe({
      next: (user: AccountServiceValidationResponse | null) => {
        this.currentUser = user;  // Update the local user state when currentUser changes
        if (user) {
          this.globals.loggedIn = true;
        } else {
          this.globals.loggedIn = false;
        }
      },
      error: (error) => {
        console.error('Error fetching current user:', error);
      }
    });
  }  

  logout() {
    this.globals.clearSession();
    this.router.navigate(['']);
    this.toastr.success("Logout Completed Successfully");
  }
  

}
