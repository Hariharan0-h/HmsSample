import { Routes } from '@angular/router';
import { HmsRegistrationComponent } from './Components/hms-registration/hms-registration.component';
import { LoginComponent } from './Components/login/login.component';

export const routes: Routes = [
    {path: '', component: LoginComponent},
    {path: 'register', component: HmsRegistrationComponent}
];
