import { Component, ElementRef, ViewChild } from '@angular/core';
import { SavedContent } from './content.interface';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../confirm/confirm.component';
import { take } from 'rxjs';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [ 
    CommonModule, 
    ConfirmComponent, 
    ReactiveFormsModule, 
  ],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss'
})

export class ContentComponent {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  savedContent : SavedContent[] = [];
  selectedContent?:SavedContent;
  contentType: 'image' | 'video' | 'invalid' | 'noContent' = 'noContent';
  showContent: boolean = false;
  showModal: boolean = false;
  showListContentName: boolean = false;
  saveAttempt:boolean = false;
  listContentName = new FormControl('', [Validators.required]);

  constructor( private dialog: MatDialog ) {}

  addFileHandler() {
    this.fileInput.nativeElement.click();
  }

  redirectFileHandler(fileEvent: Event){
    const input =fileEvent.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      const fileType = file.type;
      const uniqueId = `file-${Date.now()}-${Math.random()}`;
      const fileUrl = URL.createObjectURL(file); 

      switch(true) {
        case fileType.startsWith('image/'):
        this.contentType = 'image';
        this.showContent= true;
        this.showListContentName = true;
        this.selectedContent = { id: uniqueId, name: file.name, url: fileUrl, type: 'image', listContentName: '' };
        break;

        case fileType.startsWith('video/'):
          this.contentType = 'video';
          this.showContent= true;
          this.showListContentName = true;
          this.selectedContent = { id: uniqueId, name: file.name, url: fileUrl, type: 'video', listContentName:  '' };
          break;

        default :
        this.contentType = 'invalid';
        this.showContent=true;
        this.selectedContent = { id: uniqueId, name: file.name, url: '', type: 'invalid', listContentName: '' };
        break;
      }
    }
  }

  updateListContentName(): void {
    if (this.selectedContent) {
      this.selectedContent.listContentName = this.listContentName.value || ''; 
    }
  }

  handleSaveContent (): void {
    if(this.listContentName.valid){
      this.updateListContentName();
      if(this.selectedContent){
        this.savedContent.push(this.selectedContent);
  
        this.selectedContent = undefined;
        this.showContent= false;
        this.showListContentName = false;
        this.listContentName.reset();
        this.saveAttempt = false;
      } 
    }  else if (this.listContentName.invalid) {
      this.saveAttempt = true;
      this.listContentName.reset();
    }
  }

  updateSavedContent() {

  }

  deleteSavedContent() {

  }

  handleDeleteContent(): void {
    if(this.showContent === true){
    const confirmRemove = this.dialog.open(ConfirmComponent);

      confirmRemove.afterClosed().pipe(take(1)).subscribe( result => {
        if ( result === true){
          this.showContent = false;
          this.selectedContent = undefined;
          this.showListContentName = false;
          this.fileInput.nativeElement.value = '';
          this.saveAttempt = false;
        } else {
          console.log('Deletion canceled');
        }
      })
    } else {
      console.log('No content to delete');
    }
  }

  showContentFile(): void {
    if (this.selectedContent){
      this.showContent = true;
    }
  }

  editContentFromList(content : SavedContent): void {
    this.selectedContent = content;
    this.showContent = true;
    this.showListContentName = true;
    this.listContentName.setValue(content.listContentName);
  }

  deleteContentFile(content : SavedContent): void{
    const confirmRef = this.dialog.open(ConfirmComponent);

    confirmRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (result === true) {
        this.savedContent = this.savedContent.filter(item => item.id !== content.id);
        console.log('Deleted content with ID:', content.id);
      } else {
        console.log('Deletion canceled.');
      }
    })
  }
}



