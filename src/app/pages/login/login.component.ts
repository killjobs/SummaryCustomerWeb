import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = "";

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router) {
    this.loginForm = this.formBuilder.group({
      userName: ['',[Validators.required]],
      password: ['',[Validators.required]]
    });
  }

  OnSubmit(): void {
    if(this.loginForm?.valid){
      this.authService.Login(this.loginForm.value).subscribe({
        next: () => this.router.navigate(['/home']),
        error: err => this.errorMessage = 'Invalid credentials'
      })
    }
  }
}
