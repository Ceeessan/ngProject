import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PlaylistItem, Playlists } from '../playlist.interface';
import { Content } from '../../content/content.interface';
import { url } from 'node:inspector';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  private selectedPlaylistSubject = new BehaviorSubject<any>(null);
  selectedPlaylist$ = this.selectedPlaylistSubject.asObservable();

  private playlistUrl = 'http://localhost:3000/api/playlist';

  constructor(private http: HttpClient) { }

  createPlaylist(userId: string, name: string, contentArray: PlaylistItem[]): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`.trim()
    })
    const body = { userId, name, contentArray};

    return this.http.post<any>(this.playlistUrl, body, { headers });
  }

  getPlaylists(userId : string): Observable<Playlists[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`.trim()
    });
    const params = new HttpParams().set('userId', userId);

    return this.http.get<Playlists[]>(this.playlistUrl, { headers, params });
  }

  getContentByIds(contentIds: PlaylistItem[]): Observable<Content[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization':`Bearer ${token}`.trim()
    })

    const body = { contentIds };  
    console.log("Sending body:", body);

    return this.http.post<Content[]>(`${this.playlistUrl}/contents`, {playlistItems: contentIds}, { headers });
  }

  getContentUrlByIds(playlistId: string, contentId: string): Observable<Content> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`.trim()
    });
  
    console.log("Sending playlistId", playlistId, "Sending contentId:", contentId);
  
    return this.http.get<Content>(`${this.playlistUrl}/${playlistId}/content/${contentId}`, { headers });
  }

  addContentToPlaylist(playlistId: string, contentId: string){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization':`Bearer ${token}`.trim()
    })

    const url = `${this.playlistUrl}/${playlistId}/content`;
    return this.http.put(url, {contentId},{headers});
  }

  updateDuration(playlistId: string, contentId: string, duration: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`.trim()
    })

    const url = `${this.playlistUrl}/${playlistId}/content/${contentId}/duration`;
    const body = {duration};
    return this.http.put<any>(url, body, {headers})
  }

  changePlaylistName(playlistId: string, newName: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`.trim()
    })

    const name = {name: newName}

    const url = `${this.playlistUrl}/${playlistId}/name`;

    return this.http.put(url, name, {headers});
  }

  deletePlaylist(playlistId:string): Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`.trim()
    });
    return this.http.delete<any>(`${this.playlistUrl}/${playlistId}`, {headers})
  }

  removeContentFromPlaylist(playlistId: string, contentId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`.trim()
    });
    return this.http.put<any>(`${this.playlistUrl}/${playlistId}/content/${contentId}`, {headers})
  }
}
