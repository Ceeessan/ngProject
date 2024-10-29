import { Component, ElementRef, ViewChild } from '@angular/core';
import { SavedContent } from './content.interface';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../confirm/confirm.component';
import { take } from 'rxjs';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [ CommonModule, ConfirmComponent,  ],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss'
})

export class ContentComponent {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  savedContent : SavedContent[] = [];
  selectedContent?: SavedContent;
  contentType: 'image' | 'video' | 'invalid' | 'noContent' = 'noContent';
  showContent: boolean = false;
  showModal: boolean = false;

  constructor(
    private dialog: MatDialog
  ) {}

  addFileHandler() {
    this.fileInput.nativeElement.click();
  }

  redirectFileHandler(fileEvent: Event){
    const input =fileEvent.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      const fileType = file.type;
      const uniqueId = `file-${Date.now()}-${Math.random()}`;

      switch(true) {
        case fileType.startsWith('image/'):
        const imgUrl = URL.createObjectURL(file);
        this.selectedContent = { id: uniqueId, name: file.name, url: imgUrl, type: 'image' };
        this.contentType = 'image';
        console.log("contentttttt" , this.contentType);
        this.showContent= true;
        break;

        case fileType.startsWith('video/'):
          const videoUrl = URL.createObjectURL(file);
          this.selectedContent = { id: uniqueId, name: file.name, url: videoUrl, type: 'video' };
          this.contentType = 'video';
          this.showContent= true;
          break;

        default :
        this.selectedContent = { id: uniqueId, name: file.name, url: '', type: 'invalid' };
        this.contentType = 'invalid';
        this.showContent=true;
        break;
      }
    }
  }

  handleSaveContent (): void {
    if(this.selectedContent){
      this.savedContent.push(this.selectedContent);

      this.selectedContent = undefined;
      this.showContent= false;
    }
  }

  handleDeleteContent(): void {

    
    if(this.showContent === true){
    const confirmRemove = this.dialog.open(ConfirmComponent);

      confirmRemove.afterClosed().pipe(take(1)).subscribe( result => {
        if ( result === true){
          this.showContent = false;
          this.selectedContent = undefined;
        } else {
          console.log('Deletion canceled');
        }
      })
    } else {
      console.log('No content to delete');
    }
  }

  showContentFile() {
    if (this.selectedContent){
      this.showContent = true;
    }
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



