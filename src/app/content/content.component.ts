import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Content } from './content.interface';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../confirm/confirm.component';
import { map, take, tap } from 'rxjs';
import { FileUploadService } from '../content-service/file-upload.service';
import { LoginService } from '../../auth-service/login.service';
import { ContentPlaylistModalComponent } from '../content-playlist-modal/content-playlist-modal.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

type  ContentType= 'image' | 'video' | 'invalid' | 'noContent';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [ 
    CommonModule,
    ReactiveFormsModule,
    FormsModule
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
  showInputChangeName: boolean = false;
  contentForm!: FormGroup;
  selectedImageUrl: string | undefined;
  isNotEditing: boolean = true;

  constructor(
    private dialog: MatDialog,
    private fileUploadService: FileUploadService,
    private loginService: LoginService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef
  ) {}

  addFileHandler() {
    if(!this.isNotEditing) {
      this.resetSelectedContent();
    }
    this.fileInput.nativeElement.click();
  }

  private resetSelectedContent() {
    this.selectedContent = undefined;
    this.selectedImageUrl = undefined;
    this.contentType = 'noContent';
    this.isNotEditing = true;
    this.showInputChangeName = false;
    this.isAlreadySaved= false;
  }

  redirectFileHandler(fileEvent: Event){
    const input = fileEvent.target as HTMLInputElement;
    const file = input.files ? input.files[0] : null;
    
    if (!file) return;
  
    const fileUrl = URL.createObjectURL(file);
    this.contentType = this.getContentType(file.type);

    this.selectedContent = {
      ...this.createContentObject(file, fileUrl),
      actualFile: file,
    } 
    this.isNotEditing = true;
    this.showContent = false;
    this.isAlreadySaved = false;
  }
  
  private getContentType(fileType: string): ContentType {
    if (fileType.startsWith('image/')) return 'image';
    if (fileType.startsWith('video/')) return 'video';
    return 'invalid';
  }

  private createContentObject(file: File, fileUrl: string): Content {
      this.isNotEditing = true;
      const now = new Date();
      const customTimestamp = new Date(now.getTime());
    return {
      _id: '',
      filename: file.name,
      createdName: file.name,
      type: this.contentType,
      fileurl: fileUrl,
      timestamp: customTimestamp,
      userId: this.loginService.getUser() || '',
      duration: 10,
      hasPlaylists: false,
      playlists: []
    }
  }

  ngOnInit() {
    this.contentForm = this.fb.group({
      newContentName: ['', [Validators.required]]
    })

    const userId = this.loginService.currentUserValue.userId;
  
    if (!userId) {
      console.log("No userId found!");
      return;
    }
    this.showSavedContent(userId);
  }

  handleSaveContent (): void {
    this.contentType = 'noContent';
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

    formData.append('createdName', file.name)
   
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
            })
            .map(content => ({
              ...content,  
              displayName: content.createdName && content.createdName.trim() !== '' 
                ? content.createdName
                : content.filename  
            }));
  
          this.contents = filterAndSortContent;
          console.log("Updated content list:", filterAndSortContent);
        } else {
          this.contents = [];
        }
      },
      (error) => {
        console.log("Failed to load content: ", error);
        this.contents = [];
        this.showContent = true;
      }
    );
  }

editContent(contentId: string) {
  const contentToEdit = this.contents.find(content => content._id === contentId);

  if (contentToEdit){
    this.selectedContent = contentToEdit;
    this.selectedImageUrl = contentToEdit.fileurl;
    this.contentType = ['image', 'video', 'invalid', 'noContent'].includes(contentToEdit.type)
    ? contentToEdit.type as ContentType
    : 'invalid';
    this.showContent = true;
    this.showInputChangeName = true;
    this.isAlreadySaved = true;
    this.isNotEditing = false;
  } else {
    this.selectedContent = undefined;
    this.selectedImageUrl = undefined;
    this.showContent = false;
    this.isNotEditing = true;
  }
}

handleChangeContentName() {
  if (this.selectedContent && this.contentForm) {
    const updatedName = this.contentForm.get('newContentName')!.value;

    if (updatedName && updatedName.trim() !== '' ){
      const isDuplicated = this.contents.some( content => content.createdName === updatedName.trim() || content.filename === updatedName.trim())

      if(isDuplicated) {
        console.log('This name is already in use.');
        return;
      }
    }

    if(updatedName !== null && updatedName !== ' '){

      this.selectedContent!.createdName = updatedName;

      this.fileUploadService.updateContent(this.selectedContent._id, updatedName)
      .pipe(take(1)).subscribe(
        (updatedContent) => {
            const index = this.contents.findIndex(c => c._id === updatedContent._id);
            if (index > -1) {
              this.contents[index].createdName = updatedContent.createdName;
              this.cdr.detectChanges();
            }
        },
        (error) => {
          console.log("Error updating content name: ", error);
        }
      )
    }
  }
}

  handleDeleteContent(content: Content): void { 
      const confirmRemove = this.dialog.open(ConfirmComponent,
        { data: { contentId : content._id }
      });

    confirmRemove.afterClosed().pipe(take(1)).subscribe( result => {
      if (result) {
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
        this.selectedImageUrl = undefined;
        this.isAlreadySaved = false;
        this.contentType = 'noContent'; 
      }
    })
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
  const clickedInside = this.elementRef.nativeElement.contains(event.target);
  if (!clickedInside) {
    console.log('Document clicked');
    this.activeDropdownContentId = null; 
  }
}

  toggleDropdown(contentId: string): void {
    if (this.activeDropdownContentId === contentId) {
      this.activeDropdownContentId = null; 
    } else {
      this.activeDropdownContentId = contentId;
    }
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