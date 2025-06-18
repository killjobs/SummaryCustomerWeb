import { Routes } from '@angular/router';
import { SummaryCustomerComponent } from './pages/summary-customer/summary-customer.component';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
    {path: 'home', component: SummaryCustomerComponent, canActivate: [authGuard]},
    {path: 'login', component: LoginComponent},
    {path: '**', redirectTo: 'login'}
];
