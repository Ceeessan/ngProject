import { Component, OnInit } from '@angular/core';
import { PlaylistService } from '../playlist/service/playlist.service';
import { forkJoin, take, tap } from 'rxjs';
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
  selectedPlaylist: any = null;
  content: any = null;
  contentUrls: string[] = [];

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
      console.log('Fetched playlists:', playlists);
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

  selectPlaylist(playlistId:string): void {
    if (this.selectedPlaylist?._id === playlistId) {
      console.log('Already selected this playlist!');
      return; 
    }

    this.selectedPlaylist = this.playlists.find((playlist) => playlist._id === playlistId) || null;

    if (this.selectedPlaylist && this.selectedPlaylist.contentArray) {
      this.showContentFromPlaylist = true;

      const contentIdRequests = this.selectedPlaylist.contentArray.map((item: PlaylistItem) => {
        console.log('item log: ', item);
        return this.playlistService.getContentUrlByIds(this.selectedPlaylist._id, item.contentId);
      });

      forkJoin<Content[]>(contentIdRequests).pipe(
        tap((content) => {console.log('content string helloooo',content);
        })
      )
        .subscribe(
        (contents: Content[]) => {
          console.log(contents);
          this.contentUrls = contents.map((content) => {
            console.log(content);
            return content.fileurl;
          });
          this.playerService.initializePlayer(this.contentUrls);
        }
      )
    }
  }
    
  trackByPlaylistId(index: number, playlist: Playlists): string {
    return playlist._id;
  }
}
