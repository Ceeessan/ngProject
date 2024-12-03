import { Component, Inject, OnInit } from '@angular/core';
import { Playlists } from '../playlist/playlist.interface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PlaylistService } from '../playlist/service/playlist.service';
import { LoginService } from '../../auth-service/login.service';
import { FileUploadService } from '../content-service/file-upload.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-content-playlist-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './content-playlist-modal.component.html',
  styleUrl: './content-playlist-modal.component.scss'
})
export class ContentPlaylistModalComponent implements OnInit{
  playlists: Playlists[] = [];
  contentId: string;

  constructor(
    private dialogRef: MatDialogRef<ContentPlaylistModalComponent>,
    private playlistService: PlaylistService,
    private loginService: LoginService,
    private fileUploadService: FileUploadService,
    @Inject(MAT_DIALOG_DATA) public data: {contentId: string}
  ) {
    this.contentId = data.contentId;
  }

  ngOnInit():void {
    this.contentId = this.data.contentId;
    this.loadPlaylists();
  }

  private loadPlaylists():void {
    const userId = this.loginService.currentUserValue.userId;

    this.playlistService.getPlaylists(userId).subscribe({
      next: (playlists) => {
        this.playlists = playlists;
      },
      error: (err) => {
        console.log("Failed to load playlists", err);
      }
    })
  }

  close():void {
    this.dialogRef.close();
  }

  addToPlaylist(playlistId: string): void {
    console.log('playlistId:', playlistId, 'contentId:', this.contentId);
    
    this.playlistService.addContentToPlaylist(playlistId, this.contentId).subscribe({
      next: () => {
        this.close();
        console.log('content added to playlist!');
      },
      error: (err) => {
        console.log("Failed to add content to playlist: ", err);
      }
    })
  }

}
