import { Component, OnInit } from '@angular/core';
import { PlaylistService } from '../playlist/service/playlist.service';
import { take } from 'rxjs';
import {  PlaylistItem, Playlists } from '../playlist/playlist.interface';
import { CommonModule } from '@angular/common';
import { Content } from '../content/content.interface';
import { LoginService } from '../../auth-service/login.service';
import { PlayerComponent } from '../player/player.component';
import { PlayerService } from './player-service/player.service';

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
  mediaFiles: Content[] = [];
  pageContent: string = '';


  constructor(
    private playlistService: PlaylistService,
    private loginService: LoginService,
    private playerService: PlayerService
  ){}

  ngOnInit(){
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

  playPlaylist(playlistId: string):void {
    this.showContentFromPlaylist = true;
    this.selectedPlaylist = this.playlists.find(playlist => playlist._id === playlistId) || null;

    if(this.selectedPlaylist) {
      this.selectedPlaylist = playlistId;
      const contentIds = this.selectedPlaylist.contentArray.map((item: PlaylistItem) => item.contentId);
      this.playerService.initializePlayer(contentIds);
    }
  }
}
