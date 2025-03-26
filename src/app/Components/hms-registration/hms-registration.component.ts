// patient-registration.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-hms-registration',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './hms-registration.component.html',
  styleUrl: './hms-registration.component.css'
})
export class HmsRegistrationComponent implements OnInit {
  patientForm: FormGroup;
  activeTab = 'personal';
  photoIdSrc: string | null = null;
  talukOptions: string[] = [
    'Madurai',
    'Tirunelveli',
    'Chennai',
    'Coimbatore',
    'Theni',
    'Dindigul',
    'Trichy',
    'Salem',
    'Erode'
  ];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.patientForm = this.fb.group({
      // Top section
      patientInstance: ['new', Validators.required],
      payType: ['pay', Validators.required],
      patientType: ['direct', Validators.required],
      uin: ['Auto-generated'],
      mrn: ['Auto-generated'],
      allocation: [''],

      // Personal information
      firstName: ['', Validators.required],
      lastName: [''],
      ageYears: [null, [Validators.min(0), Validators.max(120)]],
      ageMonths: [null, [Validators.min(0), Validators.max(11)]],
      ageDays: [null, [Validators.min(0), Validators.max(31)]],
      dob: [''],
      gender: ['', Validators.required],
      nextOfKinRelation: [''],
      nextOfKinName: [''],
      normalReferral: ['normal'],
      doorStreet: [''],
      locality: [''],
      city: [''],
      pinCode: [''],
      taluk: ['', Validators.required],
      district: [''],
      state: [''],
      country: ['India'],
      mobileNo: [''],
      aadhaarNo: [''],
      phoneNo: [''],
      poBox: [''],
      mrtLocation: [''],
      email: ['', Validators.email],
      purposeOfVisit: ['', Validators.required],
      mobileAppConsent: ['no'],
      mobileAppNo: [''],
      previouslyRegistered: [false],
      hasInsurance: [false],
      assignDoctor: [false],

      // Payment information
      patientCategory: ['full'],
      patientSubCategory: [''],
      paymentType: ['cash'],
      fees: [100],

      // Additional information
      language: ['Auto-generated'],
      occupation: [''],
      education: [''],
      familyIncome: [''],
      religion: [''],
      nationality: ['Indian'],
      bloodGroup: [''],
      medicalHistory: ['']
    });
  }

  ngOnInit(): void {
    // Initialize form with default values or fetch from service
    this.setupFormListeners();
  }

  setupFormListeners(): void {
    // Listen for DOB changes to calculate age
    this.patientForm.get('dob')?.valueChanges.subscribe(value => {
      if (value) {
        const dob = new Date(value);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - dob.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        const years = Math.floor(diffDays / 365);
        const months = Math.floor((diffDays % 365) / 30);
        const days = Math.floor((diffDays % 365) % 30);
        
        this.patientForm.patchValue({
          ageYears: years,
          ageMonths: months,
          ageDays: days
        }, { emitEvent: false });
      }
    });

    // Listen for age changes to update DOB
    const ageControls = ['ageYears', 'ageMonths', 'ageDays'];
    ageControls.forEach(control => {
      this.patientForm.get(control)?.valueChanges.subscribe(() => {
        const years = this.patientForm.get('ageYears')?.value || 0;
        const months = this.patientForm.get('ageMonths')?.value || 0;
        const days = this.patientForm.get('ageDays')?.value || 0;
        
        if (years || months || days) {
          const today = new Date();
          today.setFullYear(today.getFullYear() - years);
          today.setMonth(today.getMonth() - months);
          today.setDate(today.getDate() - days);
          
          this.patientForm.patchValue({
            dob: today.toISOString().split('T')[0]
          }, { emitEvent: false });
        }
      });
    });

    // Disable MobileAppNo if consent is not given
    this.patientForm.get('mobileAppConsent')?.valueChanges.subscribe(value => {
      if (value === 'yes') {
        this.patientForm.get('mobileAppNo')?.enable();
      } else {
        this.patientForm.get('mobileAppNo')?.disable();
      }
    });

    // Initialize mobileAppNo state
    if (this.patientForm.get('mobileAppConsent')?.value !== 'yes') {
      this.patientForm.get('mobileAppNo')?.disable();
    }
  }

  onPhotoUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        this.photoIdSrc = e.target?.result as string;
      };
      
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.patientForm.invalid) {
      // Mark all fields as touched to trigger validation errors
      Object.keys(this.patientForm.controls).forEach(key => {
        const control = this.patientForm.get(key);
        control?.markAsTouched();
      });
      
      this.snackBar.open('Please fill all required fields', 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar'
      });
      return;
    }
    
    // Form is valid, proceed with submission
    console.log('Form submitted:', this.patientForm.value);
    
    // Here you would typically call a service to save the data
    // this.patientService.registerPatient(this.patientForm.value)
    //   .subscribe(response => {
    //     // Handle successful response
    //   });
    
    this.snackBar.open('Patient registration successful!', 'Close', {
      duration: 3000,
      panelClass: 'success-snackbar'
    });
  }

  onRecall(): void {
    // Implementation for recalling patient data
    console.log('Recall functionality clicked');
    this.snackBar.open('Recall functionality initiated', 'Close', { duration: 2000 });
  }

  onReprint(): void {
    // Implementation for reprinting
    console.log('Reprint functionality clicked');
    this.snackBar.open('Reprinting patient card...', 'Close', { duration: 2000 });
  }

  onCancel(): void {
    // Reset the form or navigate away
    this.patientForm.reset({
      patientInstance: 'new',
      payType: 'pay',
      patientType: 'direct',
      uin: 'Auto-generated',
      mrn: 'Auto-generated',
      normalReferral: 'normal',
      country: 'India',
      nationality: 'Indian',
      patientCategory: 'full',
      paymentType: 'cash',
      fees: 100,
      language: 'Auto-generated',
      mobileAppConsent: 'no'
    });
    this.photoIdSrc = null;
    this.snackBar.open('Form has been reset', 'Close', { duration: 2000 });
  }

  onRouteCard(): void {
    // Implementation for route card
    console.log('Route card functionality clicked');
    this.snackBar.open('Generating route card...', 'Close', { duration: 2000 });
  }

  onViewCollection(): void {
    // Implementation for viewing collection
    console.log('View collection functionality clicked');
    this.snackBar.open('Navigating to collections view...', 'Close', { duration: 2000 });
  }

  onUnitLoad(): void {
    // Implementation for unit load
    console.log('Unit load functionality clicked');
    this.snackBar.open('Loading unit data...', 'Close', { duration: 2000 });
  }
}
