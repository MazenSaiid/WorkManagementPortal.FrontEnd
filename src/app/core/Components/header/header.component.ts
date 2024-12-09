import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Globals } from '../../globals';
import { AccountService } from '../../Services/account.service';
import { AccountServiceValidationResponse } from '../../Models/Responses/UserValidationResponse';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  constructor(private accountService:AccountService,private globals: Globals,private router:Router) {
  }
  currentUser: any | null = null;
  ngOnInit(): void {
  this.checkUserSession();
  }

  checkUserSession(){
    this.accountService.currentUser$.subscribe({
      next: (user: AccountServiceValidationResponse | null) => {
        this.currentUser = user;
        if (user) {
          this.globals.loggedIn = true;
        } else {
          this.globals.loggedIn = false;
          this.router.navigateByUrl('login');
        }
      },
      error: (error) => {
        console.error('Error fetching current user:', error);
      }
    });
  }
  logout() {
    this.currentUser.next(null); // Clear the current user
    this.globals.clearSession();
  }
  changePassword() {
  }

}
