// auth.guard.ts
import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  Router
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isLoggedIn()) {
      // Check if route has data.roles and user has appropriate role
      if (route.data['roles'] && route.data['roles'].length) {
        const userRole = this.authService.getUserRole();
        if (route.data['roles'].includes(userRole)) {
          return true;
        } else {
          // User doesn't have required role, redirect to home page
          this.router.navigate(['/unauthorized']);
          return false;
        }
      }
      
      // No specific role required, user is authenticated
      return true;
    }

    // User not logged in, redirect to login page with return url
    this.router.navigate(['/login'], { 
      queryParams: { returnUrl: state.url }
    });
    return false;
  }
}