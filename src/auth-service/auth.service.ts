import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private userUrl = 'http://localhost:3000/api/auth';
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor( 
    private http: HttpClient,
    private router: Router
  ) {
    if (typeof localStorage !== 'undefined'){
      const storedUser = localStorage.getItem('currentUser');
      this.currentUserSubject = new BehaviorSubject<any>(storedUser ? JSON.parse(storedUser): null);
      this.currentUser = this.currentUserSubject.asObservable();
    } else {
      this.currentUserSubject = new BehaviorSubject<any>(null);
      this.currentUser = this.currentUserSubject.asObservable();
    }
  }

     public get currentUserValue () {
      return this.currentUserSubject.value;
     }

     login(email: string, password: string) {
        return this.http.post(`${this.userUrl}/login`, {email, password})
        .subscribe(res => {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('currentUser', JSON.stringify(res));
          }
          this.currentUserSubject.next(res);
          this.router.navigate(['/home']);
          console.log('You are logged in!');
        }, error => {
          console.log('Login failed!' , error);
        })
     }

     isAuthenticated() {
      return this.currentUserSubject.value != null;
     }

     isLoggedIn():boolean {
      return this.currentUserSubject.value !== null;
     }

     logout() {
      
      localStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);

      this.router.navigate(['/login']);
      console.log('You are logged out!');
     }
}
