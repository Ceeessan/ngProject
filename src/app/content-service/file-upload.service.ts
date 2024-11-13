import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private contentUrl = 'http://localhost:3000/api/content';

  constructor(
    private http: HttpClient,
  ) { }

  fileHandler(name: string, type: string, url:string): Observable<any>{
    console.log('User data to send: ' , {name, type, url});

    const token = localStorage.getItem('token');
    console.log("Token in localStorage:", token);

    const contentData = {
      filename: name,
      type: type,
      fileurl: url
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })

    return this.http.post<any>(this.contentUrl, contentData, {headers});

  }
}