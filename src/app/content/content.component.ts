import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Content } from './content.interface';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../confirm/confirm.component';
import { map, take, tap } from 'rxjs';
import { FileUploadService } from '../content-service/file-upload.service';
import { LoginService } from '../../auth-service/login.service';
import { Router } from '@angular/router';
import { ContentPlaylistModalComponent } from '../content-playlist-modal/content-playlist-modal.component';

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
  isAlreadySaved: boolean = false;
  activeDropdownContentId: string | null = null;

  constructor(
    private dialog: MatDialog,
    private fileUploadService: FileUploadService,
    private loginService: LoginService,
    private router: Router,
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
    this.isAlreadySaved = false;
    
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
      const customTimestamp = new Date(now.getTime());
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
    const userId = this.loginService.currentUserValue.userId;
  
    if (!userId) {
      console.log("No userId found!");
      return;
    }
    this.showSavedContent(userId);
  }

  handleSaveContent (): void {
    const userId = this.loginService.currentUserValue.userId;

    if (!this.selectedContent || !this.selectedContent.actualFile) {
      console.error('No content selected!');
      return;
    }
   
    const file = this.selectedContent.actualFile;

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
   
    this.fileUploadService.fileHandler(formData)
    .pipe(
      map((response) => {
        const savedContent = response.saveContent;
        this.contents.push(savedContent);

        this.contents.sort((a,b) => {
          const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
          const dateB = b.timestamp ? new Date(b.timestamp)?.getTime() : 0;
          return dateB - dateA;
        })
        this.resetContent();
        return this.contents;
      }),
      tap((contents) => console.log('Contents',contents))     
    ).subscribe( (response) => {
      console.log('Content saved ',response);
      },
      (error) => {
        console.error('Error during upload', error)
      }
    )
  }

  private resetContent() {
    this.selectedContent = undefined;
    this.showContent = false;
  }

  showSavedContent(userId: string) {
    this.fileUploadService.getAllFiles(userId).pipe(take(1)).subscribe(
      (contents) => {
        if (contents && contents.length > 0) {
          const filterAndSortContent = contents
            .filter(content => content.userId === userId)
            .sort((a, b) => {
              const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
              const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
              return dateB - dateA;
            });
  
          this.contents = filterAndSortContent;
          console.log("Updated content list:", filterAndSortContent);
        } else {
          this.contents = [];
        }
      },
      (error) => {
        console.log("Failed to load content: ", error);
        this.contents = [];
      }
    );
  }

  showContentById(contentId: string) {
    const selectedContentById = this.contents.find(content => content._id === contentId)
    if (selectedContentById) {
      this.selectedContent = selectedContentById;
      this.contentType = selectedContentById.type as ContentType;
      this.showContent = true;
      this.isAlreadySaved = true;

    } else {
      this.selectedContent = undefined;
      this.showContent = false;
      this.isAlreadySaved = false;
    }
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

  deleteNoSavedContent() {

    if( this.isAlreadySaved) {
      return;
    }

    const confirmRemove = this.dialog.open(ConfirmComponent,
      { data: {
        title: "Remove unsaved content"
       }
    });

    confirmRemove.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.selectedContent = undefined;
        this.showContent = false;
        this.isAlreadySaved = false;
      }
    })
  }

toggleDropdown(contentId: string): void {

  if(this.activeDropdownContentId === contentId) {
    this.activeDropdownContentId = null;
  } else {
    this.activeDropdownContentId = contentId;
  }
}

editContent(content: Content) {
  console.log("edit content ", content);
  this.router.navigate(['/playlist']);
}

openAddToPlaylistModal(contentId: string): void {
  const dialogRef = this.dialog.open(ContentPlaylistModalComponent, {
    data: {contentId}
  });

  dialogRef.afterClosed().subscribe(result => {
    if(result) {
      console.log("Content is added to the playlist :", result);
    }
  })
}

addToPlaylist(contentId: string): void {
  this.openAddToPlaylistModal(contentId);
}
}