import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlaylistItem, Playlists } from './playlist.interface';
import { PlaylistService } from './service/playlist.service';
import { take } from 'rxjs';
import { LoginService } from '../../auth-service/login.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../confirm/confirm.component';
import { Content } from '../content/content.interface';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.scss'
})
export class PlaylistComponent implements OnInit {

  playlists: Playlists[] = [];
  playlistNameControl = new FormControl('');
  playlist: any = { contents: [] };
  playlistForm!: FormGroup;

  createdPlaylist: boolean = false;
  selectedPlaylist: any = null;
  isEditing: boolean = false;
  showErrorMsg: boolean = false;
  playlistContents : Content[] = [];
  emptyPlaylist:boolean = false;

  constructor(
    private playlistService: PlaylistService,
    private loginService: LoginService,
    private dialog: MatDialog,
  ){}

  ngOnInit():void {
    const userId = this.loginService.getUser();
    this.fetchPlaylists(userId);
    this.playlistForm = new FormGroup({});
  }

  createPlaylist():void {
    const userId = this.loginService.getUser();
    const playlistName = this.playlistNameControl.value;

    if(!playlistName || playlistName.trim() === ' ') {
      console.log('Playlist name is required');
      return;
    }
    
    const duplicate = this.playlists.some(playlist => playlist.name === playlistName)
    if(duplicate) {
      console.log("A playlist with this name already exists");
      this.showErrorMsg = true;
      setTimeout(() => {
        this.showErrorMsg = true; 
      },2000);
      return;
    }

    this.playlistService.createPlaylist(userId,playlistName, []).pipe(take(1)).subscribe((response) => {
      console.log('Playlist created! ', response);
      this.createdPlaylist=true;
      setTimeout(() => {
        this.createdPlaylist = false;
      }, 3000);
      this.fetchPlaylists(userId);
      this.playlistNameControl.reset();
    },
    (error) => {
      console.log(error);
    })
  }

  fetchPlaylists(userId: string): void {
    this.playlistService.getPlaylists(userId).pipe(take(1)).subscribe((playlists) => {
      console.log('Fetched playlists:', playlists);
      if( playlists && playlists.length >0) {
        const filterAndSortPlaylist = playlists
        .filter(playlist => playlist.userId === userId)
        .sort((a, b) => {
          const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
          const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
          return dateB - dateA;
        });
        this.playlists = filterAndSortPlaylist;
      } else {
        this.playlists = [];
      }
    }, (error) => {
      console.log("Failed to load playlists: ", error);
        this.playlists = [];
    })
  }

  updatePlaylistName(playlistId: string): void {    
    const newPlaylistName = this.playlistForm.get(playlistId)?.value;

    if(!newPlaylistName || newPlaylistName.trim() === ' ') {
      console.log('Playlist name is required');
      return;
    }

    this.playlistService.changePlaylistName(playlistId, newPlaylistName)
    .pipe(take(1))
    .subscribe(
      (response) => {
        console.log("Playlist name updated!", response);

        const playlist = this.playlists.find(p => p._id === playlistId);
        if(playlist) {
          playlist.name = newPlaylistName;
        }
        this.playlistForm.get(playlistId)?.reset();
      },
      (error) => {
        console.log("Error updating playlist name", error);
      }
    )
  }
  

  loadPlaylistContent() {

    this.playlistContents = [];

    if(  this.emptyPlaylist = !this.selectedPlaylist || !this.selectedPlaylist.contentArray?.length ){
      this.emptyPlaylist = true;
    } else {
      this.playlistContents= [];
    }

    if (this.selectedPlaylist?.contentArray.length>0) {
      console.log("Sending contentIds:");
      this.playlistService.getContentByIds(this.selectedPlaylist.contentArray).subscribe(
        (contents) => {
          console.log("contentsss", contents);
          if(!Array.isArray(contents)) {
            console.log("Error: Content is not an array");
            this.playlistContents = [];
            return;
          }
          this.playlistContents = contents;
        },
        (error) => console.log("Failed to load contents ", error)
      )
    }
  }

  isImage(fileurl: string): boolean{
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const fileExtension = fileurl.split('.').pop()?.toLowerCase() || '';
    return imageExtensions.includes(fileExtension);
  }

  updateDuration(contentId: string, newDuration: number): void {
    if (!this.selectedPlaylist) {
      console.log("No playlist selected");
      return;
    }

    const playlistItem = this.selectedPlaylist.contentArray.find((item: PlaylistItem) => item.contentId === contentId);

        if(!playlistItem) {
          console.log("Item not found");
          return;
        }

        playlistItem.duration = newDuration;

        this.playlistService.updateDuration(this.selectedPlaylist._id, contentId, newDuration)
        .pipe(take(1))
        .subscribe(
          () => {
            console.log("Duration updated successfully!", contentId);
          },
          (error) => {
            console.log("Failed to update duration", error);
          }
        )
  }

  getTotalDuration():number {
    return this.playlistContents.reduce((total, content) => total + (content.duration || 0), 0);
  }

  handleDeletePlaylist(playlistId: string): void { 

    const confirmRemove = this.dialog.open(ConfirmComponent,
      { data: { playllistId : playlistId }
    });

  confirmRemove.afterClosed().pipe(take(1)).subscribe( result => {
    if (result === true ) {
      this.playlistService.deletePlaylist(playlistId).subscribe(
        () => {
          console.log('Playlist deleted: ' , playlistId);
          this.playlists = this.playlists.filter( c => c._id !== playlistId);
          this.isEditing = false;
      },
    (error) => {
      console.log("Error deleting playlist", error);
    })
    }  
  })
}

editPlaylist(playlist: any): void {
  this.selectedPlaylist = {...playlist};
  this.isEditing = true;
  this.loadPlaylistContent();

  if (!this.playlistForm.contains(playlist._id)) {
    this.playlistForm.addControl(playlist._id, new FormControl(''));

    console.log(this.playlistForm.controls);
  }
}

deleteContentFromPlaylist(contentId: string): void {
  if (!this.selectedPlaylist) return;
  const confirmRemove = this.dialog.open(ConfirmComponent,
    { data: { contentId : contentId }
  });

confirmRemove.afterClosed().pipe(take(1)).subscribe( result => {
  if (!result) {
    return;
  }
  const playlistId = this.selectedPlaylist._id;

  this.playlistService
  .removeContentFromPlaylist(playlistId, contentId)
  .pipe(take(1))
  .subscribe(
    (resp) => {
      console.log("Content removed from playlist! ", resp.updatedPlaylist);

      this.selectedPlaylist.contentArray = resp.updatedPlaylist.contentArray;
      this.playlistContents = this.playlistContents.filter((content) => content._id.toString() !== contentId)

    }, (error) => {
      console.log("Failed to remove content ", error);
    }
  )
})
}
}