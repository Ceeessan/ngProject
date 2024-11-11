import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { registerForm } from '../register.interface';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private userUrl = 'http://localhost:3000/api/user';

  constructor(private http: HttpClient) { }

  registerUser(userData: registerForm): Observable<registerForm>{
    return this.http.post<registerForm>(this.userUrl, userData);
  }
}

