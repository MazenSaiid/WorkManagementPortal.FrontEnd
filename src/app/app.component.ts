import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Globals } from './core/globals';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  isLogggedIn = false;
  title = 'client';

  constructor(private globals: Globals) {}

  ngOnInit(): void {
    this.globals.currentUser$.subscribe({
      next: (user) => {
        this.isLogggedIn = !!user;  
      },
      error: (error) => {
        console.error('Error fetching current user:', error);
      }
    });
    this.globals.loadUserInfo();
  }
}

