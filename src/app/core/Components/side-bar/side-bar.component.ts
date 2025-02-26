import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../Services/account.service';
import { Globals } from '../../globals';
import { Router } from '@angular/router';
import { AccountServiceValidationResponse } from '../../Models/Responses/UserValidationResponse';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent implements OnInit  {
  constructor(private accountService:AccountService,private globals: Globals,private router:Router) {
  }
  
  currentUser: AccountServiceValidationResponse | null = null;
  ngOnInit(): void {
  this.checkUserSession();
  this.hasAdminAccess();
  }
  hasAdminAccess(): boolean {
    return this.currentUser?.roles?.some(role => ['Admin', 'Manager'].includes(role)) ?? false;
  }
  hasSupervisorLeaderAccess(): boolean {
    return this.currentUser?.roles?.some(role => ['Supervisor', 'TeamLead'].includes(role)) ?? false;
  }
  checkUserSession(){
    this.globals.currentUser$.subscribe({
      next: (user: AccountServiceValidationResponse | null) => {
        if (user) {
          this.currentUser = user;
          this.globals.loggedIn = true;
        } else {
          this.globals.clearSession();
          this.globals.loggedIn = false;
          this.router.navigateByUrl('login');
        }
      },
      error: (error) => {
        console.error('Error fetching current user:', error);
      }
    });
  }
}
