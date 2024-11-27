import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Content } from '../content/content.interface';
import { ContentListService } from '../content-service/content-list.service';
import { LoginService } from '../../auth-service/login.service';
import { take } from 'rxjs';

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
    private contentListService: ContentListService,
    private loginService: LoginService
  ){}

  ngOnInit():void {
    const userId = this.loginService.currentUserValue.userId;

    if(!userId) {
      console.log('No user found');
      return;
    }

    this.contentListService.showSavedContent(userId);

    this.contentListService.contents$.pipe(take(1)).subscribe((contents) => {
      this.contents = contents;
      console.log("content in playlist", contents);
    });
  }

  showContentById(contentId: string) {
    this.contentListService.showContentById(contentId);
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
