// import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { stringify } from 'querystring';
import { Observable } from 'rxjs';

//________________WIP! This is currently on pause to fix the backend first __________________________


@Injectable({
  providedIn: 'root'
})
export class FileUploadService {



  //Yout backendUrl here:
  // private uploadUrl = '';

  constructor(
    // private http: HttpClient
  ) { }

  // RedirectFileHandler(fileEvent: Event): any{

    
    // const input = fileEvent.target as HTMLInputElement;

    // if (input.files && input.files[0] ){
    //   const file = input.files[0];
    //   const fileType = file.type;
    //   const fileUrl = URL.createObjectURL(file);

    //   const timestamp = new Date().toISOString();

    //   let fileMetadata: any = {
    //     name: file.name,
    //     type: fileType,
    //     url: fileUrl,
    //     timestamp: timestamp
    //   }
      
    //   this.uploadFile(file, fileMetadata).subscribe({
    //     next: response => console.log('Upload successful:', response),
    //     error: error => console.error('Upload failed:', error)
    //   });
    // }
  // }

  // uploadFile(file: File, fileMetadata: any): Observable<any> {
  //   const formData = new FormData();
  //   formData.append('file', file, file.name);
  //   formData.append('metadata', JSON.stringify(fileMetadata));

  //   return this.http.post(this.uploadUrl, formData);  
  // }
}