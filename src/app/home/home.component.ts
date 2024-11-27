import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../auth-service/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [

  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  userName:string = '';

  constructor (
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit() {
    const currentUser = this.loginService.currentUserValue;
    if (currentUser) {
      this.userName = currentUser.firstname; 
    } else {
      this.userName = '';
    }
  }

  showContent(){
    this.router.navigate(['/content']); 

  }
}
