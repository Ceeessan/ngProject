import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegisterService } from './service/register.service';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule

  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})

export class RegisterComponent {
  isActive=true;
  registerForm : FormGroup;
  registerComplete: boolean = false;
  submitted: Boolean = false;

  constructor(
    private registerService: RegisterService,
    private router: Router
  ){
    this.registerForm = new FormGroup({
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required)
    })
  }

  createUserSubmit() {

    this.submitted=true;

    if(this.registerForm.valid) {

      const { confirmPassword, ...userData} = this.registerForm.value;


      if (this.registerForm.value.password !== confirmPassword) {
        console.log('Lösenordet matchar inte!');
        return;
      }

      this.registerService.registerUser(userData).subscribe(
        (response) => {
        console.log('User registered successfully', response);
        this.registerComplete = true;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      }, 
    (error) => {
      console.log("Error registering user:", error);
    })
    } else {
      console.log('Form not valid');
    }
  }
}
