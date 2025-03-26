// login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { CommonModule } from '@angular/common';

// Import the login form interface
interface LoginForm {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  imports:[CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // Declare the form without initializing it here
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  loginAttempts = 0;
  maxLoginAttempts = 5;

  // Predefined credentials
  private readonly VALID_USERNAME = '51244';
  private readonly VALID_PASSWORD = 'pass@123';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.startAnimations();
    // Initialize the form in ngOnInit where dependencies are available
    this.loginForm = this.createLoginForm();
    this.startAnimations();
  }

  // Create the login form - can be called in the property initialization
  private createLoginForm(): FormGroup {
    return this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  startAnimations() {
    // Add animation classes with delays
    setTimeout(() => {
      const elements = document.querySelectorAll('.fadeIn');
      elements.forEach(element => {
        element.classList.add('active');
      });
    }, 100);
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.showError('Please enter both username and password');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formValue = this.loginForm.value as LoginForm;
    const username = formValue.username;
    const password = formValue.password;

    // For production, use the authService to authenticate
    // Simulate API call
    setTimeout(() => {
      if (this.validateCredentials(username, password)) {
        this.handleSuccessfulLogin();
      } else {
        this.handleFailedLogin();
      }
    }, 1500);
  }

  validateCredentials(username: string, password: string): boolean {
    // In a real app, this would be handled by the AuthService
    return username === this.VALID_USERNAME && password === this.VALID_PASSWORD;
  }

  handleSuccessfulLogin() {
    // Scale up and fade out animation
    const container = document.querySelector('.container') as HTMLElement;
    if (container) {
      container.style.transform = 'scale(1.05)';
      container.style.opacity = '0';
    }

    // Store authentication token
    this.authService.setAuthToken('sample-jwt-token');
    
    // Redirect after animation to the register component
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/register']);
    }, 1000);
  }

  handleFailedLogin() {
    this.loginAttempts++;
    this.isLoading = false;
    
    if (this.loginAttempts >= this.maxLoginAttempts) {
      this.showError('Too many failed attempts. Please try again later.');
      this.loginForm.disable();
      setTimeout(() => {
        this.loginForm.enable();
        this.loginAttempts = 0;
      }, 30000); // Lock for 30 seconds
    } else {
      this.showError('Invalid username or password');
    }
    
    // Add shake animation
    const loginBtn = document.querySelector('.login-btn') as HTMLElement;
    if (loginBtn) {
      loginBtn.classList.add('shake');
      setTimeout(() => {
        loginBtn.classList.remove('shake');
      }, 500);
    }
  }

  showError(message: string) {
    this.errorMessage = message;
    const errorElement = document.getElementById('errorMessage');
    if (errorElement) {
      errorElement.classList.add('show');
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    const toggleIcon = document.getElementById('togglePassword') as HTMLElement;
    
    if (passwordInput) {
      passwordInput.type = this.showPassword ? 'text' : 'password';
      toggleIcon.textContent = this.showPassword ? '🔒' : '👁️';
    }
  }
}