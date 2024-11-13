import { Component, ElementRef, ViewChild } from '@angular/core';
import { SavedContent } from './content.interface';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../confirm/confirm.component';
import { Observable, take } from 'rxjs';
import { FileUploadService } from '../content-service/file-upload.service';

type  ContentType= 'image' | 'video' | 'invalid' | 'noContent';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [ 
    CommonModule, 
    // ConfirmComponent, 
  ],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss'
})

export class ContentComponent {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  savedContent : SavedContent[] = [];
  selectedContent?:SavedContent;
  contentType: ContentType = 'noContent';
  showContent: boolean = false;
  showModal: boolean = false;

  constructor(
    private dialog: MatDialog,
    private fileUploadService: FileUploadService
  ) {}

  addFileHandler() {
    this.fileInput.nativeElement.click();
  }

  redirectFileHandler(fileEvent: Event){
    const input = fileEvent.target as HTMLInputElement;
    const file = input.files ? input.files[0] : null;
    
    if (!file) return;
  
    const fileUrl = URL.createObjectURL(file);
    this.contentType = this.getContentType(file.type);
    this.showContent = true;
  
    this.selectedContent = this.createContentObject(file, fileUrl);
  }
  
  private getContentType(fileType: string): ContentType {
    if (fileType.startsWith('image/')) return 'image';
    if (fileType.startsWith('video/')) return 'video';
    return 'invalid';
  }

  private createContentObject(file: File, fileUrl: string): SavedContent {
    return {
      name: file.name,
      type: this.contentType,
      url: fileUrl
    }
  }

  handleSaveContent (): void {
      if(this.selectedContent){
        this.fileUploadService.fileHandler(
          this.selectedContent.name,
          this.selectedContent.type,
          this.selectedContent.url
        ).subscribe(
          (response) => {
            console.log('content saved! ' , response);

            this.savedContent.push(this.selectedContent!);
            this.resetContent();  
          },
          (error) => {
            console.log('fail!' , error);
          }
        )
      } 
  }

  private resetContent() {
    this.selectedContent = undefined;
    this.showContent = false;
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
          this.fileInput.nativeElement.value = '';
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

  deleteContentFile(content : SavedContent): void{
    const confirmRef = this.dialog.open(ConfirmComponent);

    confirmRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (result === true) {
        this.savedContent = this.savedContent.filter(item => item !== content);
        console.log('Deleted content with ID:', content);
      } else {
        console.log('Deletion canceled.');
      }
    })
  }
}



