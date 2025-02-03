import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Globals } from '../../globals';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  // Injecting necessary services
  const globals = inject(Globals);
  const router = inject(Router);
  const toastr = inject(ToastrService);
  // Check if the user is logged in (using the Globals service)
  if (globals.loggedIn) {
    // User is logged in, allow access
    return true;
  } else {
    router.navigate(['']);
    toastr.warning('You must be logged in to access this page. Please log in and try again.');
    return false;
  }
};

