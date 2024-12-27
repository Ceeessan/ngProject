import { Component, OnInit } from '@angular/core';
import { PlaylistService } from '../playlist/service/playlist.service';
import { forkJoin, map, take, tap } from 'rxjs';
import {  PlaylistItem, Playlists } from '../playlist/playlist.interface';
import { CommonModule } from '@angular/common';
import { Content } from '../content/content.interface';
import { LoginService } from '../../auth-service/login.service';
import { PlayerComponent } from '../player/player.component';
import { PlayerService } from '../player/player-service/player.service';

@Component({
  selector: 'app-player-device',
  standalone: true,
  imports: [CommonModule, PlayerComponent],
  templateUrl: './player-device.component.html',
  styleUrl: './player-device.component.scss'
})
export class PlayerDeviceComponent implements OnInit {

  playlists: Playlists[] = [];
  showContentFromPlaylist: boolean = false;
  selectedPlaylist: Playlists | null = null;
  content: any = null;
  contentUrls: string[] | string = [];
  currentPlaylistId: string | null = null;
  noContent: boolean = false;

  constructor(
    private playlistService: PlaylistService,
    private loginService: LoginService,
    private playerService: PlayerService,
  ){}

  ngOnInit(){
    const userId = this.loginService.getUser();
    this.fetchPlaylists(userId);
  }

  fetchPlaylists(userId: string): void {
    this.playlistService.getPlaylists(userId).pipe(take(1)).subscribe((playlists) => {
      if( playlists && playlists.length > 0) {
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

  selectPlaylist(playlistId: string): void {
  
    if (this.selectedPlaylist && this.selectedPlaylist._id === playlistId) {
      console.log('This playlist is already playing');
      return;
    }

    this.playerService.stopCurrentContent();
  
    this.selectedPlaylist = this.playlists.find((playlist) => playlist._id === playlistId) || null;

    if (!this.selectedPlaylist || !this.selectedPlaylist.contentArray || this.selectedPlaylist.contentArray.length === 0) {
      this.noContent = true;
      this.showContentFromPlaylist = false; 
    } else {
      this.noContent = false;
      this.showContentFromPlaylist = true;  
    }
  
    if (this.selectedPlaylist && this.selectedPlaylist.contentArray) {
      this.showContentFromPlaylist = true;
 
      const contentIdRequests = this.selectedPlaylist.contentArray.map((item: PlaylistItem) => {
        return this.playlistService.getContentUrlByIds(this.selectedPlaylist!._id, item.contentId);
      });
  
      forkJoin<Content[]>(contentIdRequests).pipe(
        map((contents) => {
          console.log(contents);
          const fileUrls = contents.map((content) => {
            const contentUrl = content.fileurl;
            const duration = this.selectedPlaylist?.contentArray.find(item => item.contentId === content._id)?.duration;
            return {  
              url: `http://localhost:3000/${contentUrl}`, 
              duration: duration
            };
          });
          return fileUrls;
        }),
        tap((fileUrls) => {

          this.playerService.initializePlayer(fileUrls);
        })
      ).subscribe(
        () => {},
        (error) => {
          console.log("Failed to load content:", error);
        }
      );
    }
  }
    
  trackByPlaylistId(index: number, playlist: Playlists): string {
    return playlist._id;
  }
}