import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalService } from '../modal.service';
import { CommonModule } from '@angular/common';
import { RegisterService } from './service/register.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // HttpClientModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})

export class RegisterComponent {
  isActive=true;
  registerForm : FormGroup;

  // confirmPassword!: string;

  constructor(
    private modalService: ModalService,
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

    if(this.registerForm.valid) {
      console.log(this.registerForm.value);

      const { confirmPassword, ...userData} = this.registerForm.value;

      if (this.registerForm.value.password !== confirmPassword) {
        console.log('Lösenordet matchar inte!');
        return;
      }

      this.registerService.registerUser(userData).subscribe((response) => {
        console.log('User registered successfully', response);
        // this.router.navigate(['/login']);
      }, 
    (error) => {
      console.log("Error registering user:", error);
    })
    } else {
      console.log('Form not valid');
    }
  }
}
