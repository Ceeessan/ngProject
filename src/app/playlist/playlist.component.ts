import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Content } from '../content/content.interface';
import { LoginService } from '../../auth-service/login.service';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.scss'
})
export class PlaylistComponent implements OnInit {

  contents: Content[] = [];
  listContentName = new FormControl('', [Validators.required]);
  selectedContent= '';
  saveAttempt:boolean = false;
  showListContentName: boolean = false;
  showContent = false;
  content = true;

  constructor(
    private loginService: LoginService
  ){}

  ngOnInit():void {
    
  }

  showContentById(contentId: string) {

  }

  updateListContentName(): void {
    if (this.selectedContent) {
      // this.selectedContent.listContentName = this.listContentName.value || ''; 
    }
  }

  editContentFromList(content: boolean ): void {
    // this.selectedContent = content;
    this.showContent = true;
  }

}
