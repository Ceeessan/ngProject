import { Component, OnInit, HostListener, input, OnChanges, Input } from '@angular/core';
import { PlayerService } from '../player-device/player-service/player.service';
import { Playlists } from '../playlist/playlist.interface';

 
@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  standalone: true
})
export class PlayerComponent implements OnInit {

  @Input() playlist: Playlists | null = null;
 
  constructor(private playerService: PlayerService) {}
 
  

  ngOnInit(): void {
    if(this.playlist && this.playlist.contentArray) {
      const contentIds = this.playlist.contentArray.map(item => item.contentId);
      this.playerService.initializePlayer(contentIds);
      console.log(this.playerService.initializePlayer(contentIds));
    }
  }


  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.playerService.resizeHandler();
  }

}