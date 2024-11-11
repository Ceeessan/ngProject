import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ModalService } from '../modal.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

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
export class LoginComponent implements OnInit {
  isActive = true;
  loginName = new FormControl('', Validators.required);
  loginPassword = new FormControl('', Validators.required);


  constructor( private modalService: ModalService) {}

  ngOnInit() {
    this.modalService.isActive$.subscribe(active => {
      this.isActive = active;
    })

  }

  closeModal() {
    this.modalService.closeModal();
  }

  loginSubmit(){}

}
