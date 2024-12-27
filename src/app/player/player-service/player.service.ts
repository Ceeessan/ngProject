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
    if (this.app) {
        this.app.stopCurrentContent();  
    }
    this.app = new App(playlist);
    this.app.run(); 
    console.log(playlist);
}
 
  resizeHandler(): void {
    if (this.app) {
      this.app['player']?.handleWindowResize();
    }
  }

  public stopCurrentContent(): void {
    if (this.app) {
        this.app.stopCurrentContent();
    }
  }
 
  errorHandler(): void {
    if (this.app) {
      this.app['player']?.errorHandler();
    }
  }
}