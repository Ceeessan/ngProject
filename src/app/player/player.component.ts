import { Component, OnInit, HostListener, Input } from '@angular/core';
import { PlayerService } from './player-service/player.service';
import { PlaylistItem, Playlists } from '../playlist/playlist.interface';
import { PlaylistService } from '../playlist/service/playlist.service';
import { Content } from '../content/content.interface';

 
@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  standalone: true
})
export class PlayerComponent implements OnInit {
  @Input() playlist: Playlists | null = null;

 
  constructor(
    private playerService: PlayerService,
    private playlistService: PlaylistService
  ) {}

  ngOnInit(): void {

  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.playerService.resizeHandler();
  }
}