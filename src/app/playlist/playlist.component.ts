import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Playlists } from './playlist.interface';
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
  createdPlaylist: boolean = false;
  selectedPlaylist: any = null;
  isEditing: boolean = false;
  showErrorMsg: boolean = false;
  playlistContents : Content[] = [];

  constructor(
    private playlistService: PlaylistService,
    private loginService: LoginService,
    private dialog: MatDialog,
  ){}

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
        this.showErrorMsg = false; 
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

  ngOnInit():void {
    const userId = this.loginService.getUser();
    this.fetchPlaylists(userId);
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

  loadPlaylistContent() {
    console.log("Selected Playlist contentArray:", this.selectedPlaylist?.contentArray);
    if (this.selectedPlaylist?.contentArray.length>0) {
      console.log("Sending contentIds:");
      this.playlistService.getContentByIds(this.selectedPlaylist.contentArray).subscribe(
        (contents) => {
          console.log('ooooooooooooooooo',contents);
          this.playlistContents = contents;
        },
        (error) => console.log("Failed to load contents ", error)
      )
    }
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
          this.playlists = this.playlists.filter( c => c._id !== playlistId)
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
}

deleteContentFromPlaylist(contentId: string): void {
  if (!this.selectedPlaylist) return;

  const playlistId = this.selectedPlaylist._id;

  this.playlistService
  .removeContentFromPlaylist(playlistId, contentId)
  .pipe(take(1))
  .subscribe(
    (updatedPlaylist) => {
      console.log("Content removed from playlist! ", updatedPlaylist);

      this.selectedPlaylist.contentArray = this.selectedPlaylist.contentArray.filter((content: string) => content.toString() !== contentId);

    }, (error) => {
      console.log("Failed to remove content ", error);
    }
  )
}
}