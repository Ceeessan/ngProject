import { Component, OnInit, HostListener, Input } from '@angular/core';
import { PlayerService } from './player-service/player.service';
import { PlaylistItem, Playlists } from '../playlist/playlist.interface';
import { PlaylistService } from '../playlist/service/playlist.service';
import { Content } from '../content/content.interface';
import { CommonModule } from '@angular/common';
import { ContentLoader, Player } from '../../media-player/src/mediaPlayer';

 
@Component({
  selector: 'app-player',
  imports: [CommonModule],
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  standalone: true
})
export class PlayerComponent implements OnInit {
  // @Input() playlist: Playlists | null = null;
  @Input() contentUrls: string[] = [];
  private player!: Player;

 
  constructor(
    private playerService: PlayerService
  ) {}

  ngOnInit(): void {
    const contentLoader = new ContentLoader(this.contentUrls);
    this.player = new Player(contentLoader);
    this.player.startLoop();
  }


  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.playerService.resizeHandler();
  }
}