import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoginService } from '../../auth-service/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  showLoginModal: boolean = false;
  submitted: boolean = false;

  constructor(
    private loginService: LoginService 
  ) {
    this.loginForm = new FormGroup({
      loginEmail: new FormControl('', [Validators.required, Validators.email]),
      loginPassword: new FormControl('', Validators.required)
    })

    if(this.loginService.isLoggedIn()){
      this.showLoginModal = true;
    }
  }

  loginSubmit(){
    this.submitted= true;

    const emailControl = this.loginForm.get('loginEmail');
    const passwordControl = this.loginForm.get('loginPassword');

    if (emailControl && passwordControl) {

      const email=emailControl.value;
      const password=passwordControl.value;

      if(!email || !password){
        console.log('Form cannot be empty');
        return;
      }
      this.loginService.login(email.toString(),password.toString());
    } else {
      console.log('Form i sinvalid');
    }
  } 
}