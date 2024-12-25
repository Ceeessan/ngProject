import { Injectable } from '@angular/core';
import { App } from '../../../media-player/src/App';
import { item } from '../../../media-player/src/type';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private app: App|null = null;

  constructor(  ) {}

   initializePlayer(playlist: item[]): void {
    this.app = new App(playlist);
    this.app.run();
    console.log(playlist);
  }
 
  resizeHandler(): void {
    if (this.app) {
      this.app['player']?.handleWindowResize();
    }
  }
 
  errorHandler(): void {
    if (this.app) {
      this.app['player']?.errorHandler();
    }
  }
}