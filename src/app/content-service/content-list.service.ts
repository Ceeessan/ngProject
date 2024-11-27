import { Injectable } from '@angular/core';
import { FileUploadService } from './file-upload.service';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { Content } from '../content/content.interface';

@Injectable({
  providedIn: 'root'
})
export class ContentListService {
  private contentSubject = new BehaviorSubject<Content[]>([]);
  contents$: Observable<Content[]> = this.contentSubject.asObservable();

  private selectedContentSubject = new BehaviorSubject<Content | null>(null);
  selectedContent$ : Observable<Content | null> = this.selectedContentSubject.asObservable();
  private cachedContent: Content[] = [];

  constructor( private fileUploadService: FileUploadService,
  ) { }

  showSavedContent(userId: string) { 

    if (this.cachedContent.length>0){
      this.contentSubject.next(this.cachedContent);
      return;
    }

    this.fileUploadService.getAllFiles(userId).pipe(take(1)).subscribe(
      (contents) => {
        if(contents && contents.length > 0){
          const filterAndSortContent = contents
          .filter(contents => contents.userId === userId)
          .sort((a,b) => {
            const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
            const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
            return dateB - dateA;
          });

          this.cachedContent = filterAndSortContent;

          this.contentSubject .next(filterAndSortContent);
          console.log("Updated content list:", filterAndSortContent);
        } else {
          this.contentSubject.next([]);
        }
      },
      (error) => {
        console.log("Failed to load content: " , error);
        this.contentSubject.next([]);
      }
    )
  }

  showContentById(contentId: string) {
    this.contents$.pipe(take(1)).subscribe((contents) => {
      const selectedContentById = contents.find(content => content._id === contentId);

        if(selectedContentById) {
          this.selectedContentSubject.next(selectedContentById);
        } else {
          this.selectedContentSubject.next(null);

        }
    });
  }

  clearUserContent(userId: string) {
    localStorage.removeItem(`content_${userId}`);
    this.contentSubject.next([]);
  }
}
