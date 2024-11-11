import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { ModalService } from '../modal.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ 
    RouterModule,
    LoginComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isActive= true;

constructor( private modalService: ModalService ) {}

openModal() {
  this.modalService.openModal(); 
}

}
