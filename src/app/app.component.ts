import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { LoginService } from '../auth-service/auth.service';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet, 
    HeaderComponent,
    
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  showHeader: boolean = true;
  title = 'ngProject';

  constructor(
    private authService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.checkRoute();
    });
  }

  checkRoute():void {

    const currentRoute = this.router.url;

    if(currentRoute === '/login' || currentRoute === '/register' || !this.authService.isLoggedIn()){
      this.showHeader = false;
    } else {
      this.showHeader = true;
    }
  }
}
