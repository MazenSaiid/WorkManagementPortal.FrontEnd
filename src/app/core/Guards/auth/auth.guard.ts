import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Globals } from '../../globals';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private toastr: ToastrService,
    private globals: Globals,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> {
    const user = this.globals.currentUserInfo; // Get the logged-in user info

    const requiredRoles = route.data['roles'] as Array<string>; // Get roles from route data
    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // If no specific roles are required, allow access
    }
    if (user) {
      const hasRole = user.roles.some((role: string) =>
        requiredRoles.includes(role)
      );
      if (!hasRole) {
        this.toastr.warning('You are not authorized');
        setTimeout(() => this.router.navigate(['/not-authorized']), 2000); // Redirect unauthorized users
        return false;
      }
    }

    return true;
  }
}
