import { Component } from '@angular/core';
import { SavedContent } from './content.interface';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../confirm/confirm.component';



@Component({
  selector: 'app-content',
  standalone: true,
  imports: [ CommonModule, ConfirmComponent ],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss'
})

export class ContentComponent {
  savedContent : SavedContent[] = [];
  selectedContent?: SavedContent;

  constructor(
    private dialog: MatDialog
  ) {}

  addFileHandler() {
    const addFile = document.getElementById('fileInput') as HTMLInputElement;
    addFile.click();
  }

  setStyleOnContent(element: HTMLImageElement | HTMLVideoElement){
          element.style.maxWidth = '90%';
          element.style.maxHeight = '90%';
          element.style.objectFit = 'contain';
          element.style.objectPosition = 'center';    
  }

  redirectFileHandler(fileEvent: Event){
    const input =fileEvent.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      console.log('Selected file', file);

      const content = document.getElementById('content') as HTMLDivElement;
      content.innerHTML = ''; 
      const fileType = file.type;

      const uniqueId = `file-${Date.now()}-${Math.random()}`;
      

      if (fileType.startsWith('image/')) {
          const img = document.createElement('img');
          img.id= "contentImg";
          this.setStyleOnContent(img);
          img.src = URL.createObjectURL(file);

          this.selectedContent ={ id: uniqueId, name: file.name, url: img.src, type: 'image' };
          content.appendChild(img);

      } else if (fileType.startsWith('video/')) {
          const video = document.createElement('video');
          video.id= "contentVideo";
          this.setStyleOnContent(video);
          video.src = URL.createObjectURL(file);

          this.selectedContent = { id: uniqueId, name: file.name, url: video.src, type: 'video' };
          content.appendChild(video); 

      } else {
          content.textContent += `\nFile type not supported for preview: ${fileType}`;
      }
    }
  }

  handleSaveContent (): void {

    if(this.selectedContent){
      this.savedContent.push(this.selectedContent);
      console.log('saved', this.savedContent); 
      this.selectedContent = undefined;
      
    }
  }

  handleDeleteContent() {
    
  }

  deleteContentFile(content : SavedContent): void{
    const confirmRef = this.dialog.open(ConfirmComponent);

    confirmRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.savedContent = this.savedContent.filter(item => item.id !== content.id);
        console.log('Deleted content with ID:', content.id);
      } else {
        console.log('Deletion canceled.');
      }
    })
}
}



