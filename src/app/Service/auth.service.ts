import { Injectable, OnInit } from '@angular/core';
import { environment } from '../../environments/enviroment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthService  {
  private apiUrl = `${environment.apiBaseUrl}/Accounts`; 
  
  public isLoggIn:BehaviorSubject<boolean>=new BehaviorSubject<boolean>( this.isLoggedIn());
  public userName :BehaviorSubject<string>=new BehaviorSubject<string>("");

  constructor(private httpClient:HttpClient,private router:Router) { 
    this.isLoggIn.next(this.isLoggedIn());
    this.userName.next(this.GetUserName())
    console.log(this.userName.value)
  }
  register(requestData:any):Observable<any>{
    return this.httpClient.post(`${this.apiUrl}/Register`, requestData).pipe(
      tap((Response:any) => {
        console.log(Response.token)
        if (Response&&Response.token) {
          /*
          localStorage.setItem('token', Response.token);
          localStorage.setItem('userName', Response.displayName);
          
          this.isLoggIn.next(true) ;    
          */               
        }
      })
    );
  }
  Login(requestData:any):Observable<any>{
    return this.httpClient.post(`${this.apiUrl}/Login`, requestData).pipe(
      tap((Response:any) => {
        console.log(Response)
        console.log(Response.token)
        if (Response&&Response.token) {
          localStorage.setItem('token', Response.token);  
          localStorage.setItem('userName', Response.displayName);
          localStorage.setItem('role', Response.role);  

          this.isLoggIn.next(true) ;   
          this.userName.next(this.GetUserName())                
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('role');

    this.isLoggIn.next(false) ;                   
  }
  isLoggedIn(): boolean {
    console.log(localStorage.getItem('token'));
    return !!localStorage.getItem('token');
  }
  GetUserName():string{
    return localStorage.getItem('userName')||""
  }
  GetUserRole():string{
    return  localStorage.getItem('role')||"";
  }
  public IsAdmin():boolean{
    const role= localStorage.getItem('role')||""
    return role === 'Admin'
  }
    public IsCustomer():boolean{
    const role= localStorage.getItem('role')||""
    return role === 'Customer'
  }
  public IsAuthenticated(): boolean {
    if (!this.isLoggIn.value) {
      this.router.navigate(['login'], { queryParams: { returnUrl: this.router.url } });
      return false;
    }
    return true;
  }

}
