import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

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
export class PlaylistComponent {

  listContentName = new FormControl('', [Validators.required]);
  selectedContent= '';
  saveAttempt:boolean = false;
  showListContentName: boolean = false;
  showContent = false;
  content = true;

  constructor(){}

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
