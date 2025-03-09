import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service'; 
import { Router } from '@angular/router';  

@Component({
  selector: 'app-new-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.css'
})
export class NewUserComponent implements OnInit {
  userForm: FormGroup;
  roles: string[] = ['student', 'teacher', 'admin'];

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', [Validators.required]]
    });
  }
  ngOnInit(){
    
  }

  onSubmit() {
    if (this.userForm.valid) {
      const userData = this.userForm.value;
      
      this.authService.register(userData).subscribe(
        (response) => {
          sessionStorage.setItem('token', response.token); // שמירה של התוקן
          this.router.navigate(['/courses']); // ניווט לדף הקורסים
          alert('Registration successful');
        },
        (error) => {
          console.error('Registration failed', error);
          alert('Registration failed');
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}
