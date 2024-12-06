import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Globals } from '../../globals';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  constructor(//private accountService:AccountService,
     private globals: Globals,private router:Router) {
  }
  currentUser: any | null = null;
  ngOnInit(): void {

    //this.checkUserSession();
  }
  logout() {}
  changePassword() {
  }
}
