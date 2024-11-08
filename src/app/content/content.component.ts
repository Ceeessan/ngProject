import { Component, ElementRef, ViewChild } from '@angular/core';
import { SavedContent } from './content.interface';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../confirm/confirm.component';
import { take } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { FileUploadService } from '../shared-services/services/file-upload.service';



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

  constructor(private dialog: MatDialog,
    private fileUploadService: FileUploadService
  ) {}

  // uploadService = inject(FileUploadService)

  addFileHandler() {
    this.fileInput.nativeElement.click();
  }

  redirectFileHandler(fileEvent: Event){
    // this.uploadService.RedirectFileHandler(fileEvent)
    const input =fileEvent.target as HTMLInputElement;

    console.log(input.files);
    const file =input.files![0];
    console.log(file.type);
    const fileUrl = URL.createObjectURL(file);
    console.log('file url',fileUrl);

    if (input.files && input.files[0]) {
      const file = input.files[0];
      const fileType = file.type;

      //Set the id that saves in backend here
      const uniqueId = ``;
      const fileUrl = URL.createObjectURL(file); 

      switch(true) {
        case fileType.startsWith('image/'):
        this.contentType = 'image';
        this.showContent= true;
        this.selectedContent = { 
          id: uniqueId, 
          name: file.name, 
          type: 'image', 
          url: fileUrl  };
        break;

        case fileType.startsWith('video/'):
          this.contentType = 'video';
          this.showContent= true;
          this.selectedContent = { 
            id: uniqueId, 
            name: file.name, 
            type: 'video', 
            url: fileUrl};
          break;

        default :
        this.contentType = 'invalid';
        this.showContent=true;
        this.selectedContent = { 
          id: uniqueId, 
          name: file.name, 
          type: 'invalid', 
          url: '',  };
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
        this.savedContent = this.savedContent.filter(item => item.id !== content.id);
        console.log('Deleted content with ID:', content.id);
      } else {
        console.log('Deletion canceled.');
      }
    })
  }
}



