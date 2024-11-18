import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Content } from '../content/content.interface';
import { LoginService } from '../../auth-service/login.service';


@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private contentUrl = 'http://localhost:3000/api/content';

  constructor(
    private loginService: LoginService,
    private http: HttpClient,
  ) { }

  fileHandler(
    filename: string, 
    type: string, 
    fileurl:string, 
    userId: String, 
    timestamp?: Date,
    hasPlaylists: boolean =false, 
    playlists: string[] = []
  ): Observable<any>
  {
    const token = localStorage.getItem('token');
    console.log("Token in localStorage:", token);

    if (!token) {
      throw new Error("No token found in local storage");
    }
    
    const currentUser = this.loginService.currentUserValue;
    userId= currentUser.userId;

    const contentData = {
      filename: filename,
      type: type,
      fileurl: fileurl,
      timestamp: timestamp,
      userId: userId,
      hasPlaylists: hasPlaylists,
      playlists: playlists
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })

    return this.http.post<any>(this.contentUrl, contentData, {headers});
  }

  getAllFiles(userId: string): Observable<Content[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`.trim()
    });

    const params = new HttpParams().set('userId', userId);

    return this.http.get<Content[]>(`${this.contentUrl}`, {headers});
  }

  //Not using right now.
  getFileById(id: string): Observable<Content>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`.trim() 
    })
    
    return this.http.get<Content>(`${this.contentUrl}/${id}`, {headers})
  }

  deleteFile(contentId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`.trim()
    })

    console.log(headers);
    
      return this.http.delete(`${this.contentUrl}/${contentId}`, {headers});
  }
}