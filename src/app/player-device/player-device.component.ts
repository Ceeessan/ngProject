import { Component, OnInit } from '@angular/core';
import { PlaylistService } from '../playlist/service/playlist.service';
import { take } from 'rxjs';
import { Playlists } from '../playlist/playlist.interface';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../auth-service/login.service';

@Component({
  selector: 'app-player-device',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-device.component.html',
  styleUrl: './player-device.component.scss'
})
export class PlayerDeviceComponent implements OnInit {

  playlists: Playlists[] = [];
  isContentVisible: boolean = true
  showContentFromPlaylist: boolean = false;
  selectedPlaylist: any = null;


  constructor(
    private playlistService: PlaylistService,
    private loginService: LoginService
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

  playPlaylist() {
    this.showContentFromPlaylist = true;
  }
}
