import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginService } from '../../auth-service/login.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ 
    RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isMenuOpen: boolean = false;

  constructor( private authService : LoginService ) {}

  logout() {
    this.authService.logout();
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
