import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Content } from './content.interface';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../confirm/confirm.component';
import { map, take, tap } from 'rxjs';
import { FileUploadService } from '../content-service/file-upload.service';
import { LoginService } from '../../auth-service/login.service';
import { Observable } from 'rxjs';

type  ContentType= 'image' | 'video' | 'invalid' | 'noContent';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [ 
    CommonModule, 
  ],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss'
})

export class ContentComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  contents : Content[] = [];
  selectedContent?:Content;
  contentType: ContentType = 'noContent';
  showContent: boolean = false;
  showModal: boolean = false;

  constructor(
    private dialog: MatDialog,
    private fileUploadService: FileUploadService,
    private loginService: LoginService
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
    
    this.selectedContent = {
      ...this.createContentObject(file, fileUrl),
      actualFile: file
    } 
  }
  
  private getContentType(fileType: string): ContentType {
    if (fileType.startsWith('image/')) return 'image';
    if (fileType.startsWith('video/')) return 'video';
    return 'invalid';
  }

  private createContentObject(file: File, fileUrl: string): Content {
      const now = new Date();
      const customTimestamp = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours(),
        now.getMinutes(),
        0,  
        0  
      );
    return {
      _id: '',
      filename: file.name,
      type: this.contentType,
      fileurl: fileUrl,
      timestamp: customTimestamp,
      userId: this.loginService.getUser() || '',
      hasPlaylists: false,
      playlists: []
    }
  }

  ngOnInit() {

    this.showSavedContent();
  }

  showSavedContent() { 
    const userId = this.loginService.currentUserValue.userId;

    if (!userId) {
      console.log("No userId found!");
      return;
    }
    this.fileUploadService.getAllFiles(userId).subscribe(
      (response) => {
        if(response && response.length > 0){
          this.contents = response.filter(content => content.userId === userId);
        }
      },
      (error) => {
        console.log("Failed to load content: " , error);
        this.contents = [];
      }
    )
  }

  handleSaveContent (): void {
    const userId = this.loginService.currentUserValue.userId;

    if (!this.selectedContent || !this.selectedContent.actualFile) {
      console.error('No content selected!');
      return;
    }

   
    const file = this.selectedContent.actualFile;
    console.log(file);

    let formData = new FormData();
    formData.append('file', file);
    formData.append('type', this.selectedContent.type);
    if (this.selectedContent.timestamp) {
      formData.append('timestamp', this.selectedContent.timestamp.toISOString()); 
    }
    formData.append('userId', userId); 
    if (this.selectedContent!.hasPlaylists) {
      console.log('BLAH2')
      formData.append('hasPlaylists', this.selectedContent.hasPlaylists!.toString()); 
    }
    formData.append('playlists', JSON.stringify(this.selectedContent!.playlists));
   
    this.fileUploadService.fileHandler(formData).pipe(
      map((response) => {
        const savedContent = response.saveContent;
        this.contents.push(savedContent);
        console.log(this.contents);
        this.resetContent();
        return this.contents;
      }),
      tap((contents) => console.log('contents',contents))     
    ).subscribe( (response) => {
      console.log('content sparat ',response);
      this.showSavedContent();
      },
      (error) => {
        console.error('error during upload', error)
      }
    )
  }

  private resetContent() {
    this.selectedContent = undefined;
    this.showContent = false;
  }

  handleDeleteContent(content: Content): void { 

      const confirmRemove = this.dialog.open(ConfirmComponent,
        { data: { contentId : content._id }
      });

    confirmRemove.afterClosed().pipe(take(1)).subscribe( result => {
      if (result === true ) {
        this.fileUploadService.deleteFile(content._id).subscribe(
          () => {
            console.log('Content deleted: ' , content._id);
            this.contents = this.contents.filter( c => c._id !== content._id)
        },
      (error) => {
        console.log("Error deleting content", error);
      })
      }  
    })
  }
}