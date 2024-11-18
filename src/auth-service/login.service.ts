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
    this.http.post<any>(`${this.userUrl}/login`, {email, password})
      .subscribe(res => {
        if (res.token && res.user) {

          localStorage.setItem('token', res.token);

          const userData = { userId: res.user.id, email: res.user.email}

          localStorage.setItem('currentUser', JSON.stringify(userData));
          console.log('userData:', userData);
          this.currentUserSubject.next(userData);
          
        this.router.navigate(['/home']);
        console.log('You are logged in!');
        }
    }, error => {
      console.log('Login failed!' , error);
   })
 }

  getUser(): string{
    const currentUser = this.currentUserSubject.value;
    console.log('currentUser:', currentUser?.userId); 
    if (currentUser && currentUser.userId) {
      return currentUser.userId;
    } else {
      throw new Error('User is not logged in or data is missing');
    }
  }

  checkAuthentication() {
    if (!this.isAuthenticated()) {
      this.router.navigate(['/login']);
      console.log('User not authenticated');
    }
  }

  isAuthenticated() {
    return this.currentUserSubject.value != null;
  }

  isLoggedIn():boolean {
   return this.currentUserSubject.value !== null;
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
    console.log('You are logged out!');
  }
}
