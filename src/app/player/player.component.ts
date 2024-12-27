import { Component, OnInit, HostListener, Input } from '@angular/core';
import { PlayerService } from './player-service/player.service';
import { CommonModule } from '@angular/common';
import { Player } from '../../media-player/src/mediaPlayer';
 
@Component({
  selector: 'app-player',
  imports: [CommonModule],
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  standalone: true
})
export class PlayerComponent implements OnInit {
  @Input() contentUrls: string[] = []; 
  private player!: Player;
 
  constructor(
    private playerService: PlayerService
  ) {}

  ngOnInit(): void {
    this.player.startLoop();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.playerService.resizeHandler();
  }
}