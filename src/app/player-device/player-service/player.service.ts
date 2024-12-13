import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor(private http: HttpClient) { }

  private playerUrl = 'http://localhost:3000/api/playback-device/mediaplayer';

  getMediaPlayer(){
    return this.http.get(`${this.playerUrl}`, { responseType: 'text'});
  }
}
