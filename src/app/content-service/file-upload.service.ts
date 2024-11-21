import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Content } from '../content/content.interface';


@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private contentUrl = 'http://localhost:3000/api/content';

  constructor(
    private http: HttpClient,
  ) { }

  fileHandler(formData: FormData ): Observable<any>
  {
    const token = localStorage.getItem('token');
    console.log("Token in localStorage:", token);

    if (!token) {
      throw new Error("No token found in local storage");
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })

    return this.http.post<any>(this.contentUrl, formData, {headers});
  }

  getAllFiles(userId: string): Observable<Content[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`.trim()
    });
    const params = new HttpParams().set('userId', userId);

    return this.http.get<Content[]>(`${this.contentUrl}`, {headers,params});
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