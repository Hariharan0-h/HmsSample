// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_info';
  
  // In a real app, this would come from environment configuration
  private apiUrl = 'api/auth';

  constructor(private http: HttpClient) { }

  /**
   * Authenticate user with backend service
   * In a real application, this would make an API call
   */
  login(username: string, password: string): Observable<any> {
    // For demo purposes, we're checking credentials locally
    // In production, this should be a server request
    const credentials = { username, password };
    
    // For demo, hard-coded credentials
    if (username === '51244' && password === 'pass@123') {
      const mockResponse = {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1MTI0NCIsIm5hbWUiOiJBcmF2aW5kIFVzZXIiLCJpYXQiOjE2MTYxODE5MjJ9',
        user: {
          id: '51244',
          name: 'Doctor John Doe',
          role: 'physician'
        }
      };
      
      // Store auth data in local storage
      this.setAuthToken(mockResponse.token);
      this.setUserInfo(mockResponse.user);
      
      return of(mockResponse);
    }
    
    // Simulate failed login
    return throwError(() => new Error('Invalid username or password'));

    /* 
    // Real API implementation would look like this:
    return this.http.post<any>(`${this.apiUrl}/login`, credentials)
      .pipe(
        map(response => {
          // Store token and user info
          this.setAuthToken(response.token);
          this.setUserInfo(response.user);
          return response;
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
    */
  }

  /**
   * Log out user by clearing stored tokens
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return !!this.getAuthToken();
  }

  /**
   * Store auth token
   */
  setAuthToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Get stored auth token
   */
  getAuthToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Store user information
   */
  setUserInfo(user: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Get stored user information
   */
  getUserInfo(): any {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  /**
   * Get user role
   */
  getUserRole(): string | null {
    const user = this.getUserInfo();
    return user ? user.role : null;
  }
}