import { Injectable } from '@angular/core';
import { App } from '../../../media-player/src/App';


@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private app: App|null = null;

  constructor() {}

   initializePlayer(playlist: string[]): void {
    this.app = new App(playlist);
    this.app.run();
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
