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

  constructor(private globals: Globals, private router: Router) {}

  ngOnInit(): void {
    this.globals.currentUser$.subscribe({
      next: (user) => {
        this.isLogggedIn = !!user;

        // Redirect on app startup
        if (this.isLogggedIn && this.router.url === '/') {
          this.router.navigate(['/home']); // Redirect to home if logged in
        } else if (!this.isLogggedIn && this.router.url === '/') {
          this.router.navigate(['/login']); // Redirect to login if not logged in
        }
      },
      error: (error) => {
        console.error('Error fetching current user:', error);
      }
    });

    this.globals.loadUserInfo();
  }
}

