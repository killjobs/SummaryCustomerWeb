import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { map, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { mensajeError, mensajeInformativo } from '../Common/utils/HandleMessages';

export interface User {
  token:string;
  userId: number;
  role:string;
}

export interface DecodedToken{
  userId: string;
  role: string;
  exp?: number;
}

export interface Authentication{
  UserName:string,
  Password:string
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  readonly PATH: string = "https://localhost:44326/Auth";
  private userToken:string = "";
  private userId:number = 0;
  private user:User | null = null;

  constructor(private http : HttpClient, private router : Router) { 
    this.ReadToken();
  }

  ReadToken(){
    this.userToken = sessionStorage.getItem('token') || '';
    this.userId = parseInt(sessionStorage.getItem('userId') || '0', 0);
  }

  Login(userAuthentication : Authentication): Observable<any>{
    return this.http.post<any>(`${this.PATH}/Login`, userAuthentication)
    .pipe(
      map(resp =>{
        //console.log(resp);
        if(resp.success && resp.result){
          this.SaveToken(resp.result);
        }
        return resp;    
      })
    );
  }

  private SaveToken(userTokenValue: string){
    this.userToken = userTokenValue;
    const decoded = this.DecodedToken(userTokenValue);

    if(decoded){
      this.userId = Number(decoded.userId);
      this.user = {
        token: userTokenValue,
        userId: this.userId,
        role: decoded.role
      };
      sessionStorage.setItem('token', userTokenValue);
      sessionStorage.setItem('userId', this.userId.toString());
      sessionStorage.setItem('role', decoded.role);
    }
  }

  IsAuthenticate() : boolean{
    if(!this.userToken){
      return false
    }
    try{
      const decodedToken: any = this.DecodedToken(this.userToken);
      const expirationTime = decodedToken?.exp || 0;
      const nowExpirationTime = Math.floor(Date.now() / 1000);
      
      return expirationTime > nowExpirationTime;

    }catch(error){
      return false
    }
  }

  private DecodedToken(token: string): DecodedToken | null{
    try{
      return jwtDecode<DecodedToken>(token);
    }catch(error){
      mensajeError("Error interno, contactar a soporte técnico");
      return null;
    }
  }

  LogOut(){
    mensajeInformativo("Cerro sesion");
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
    this.userToken = '';
    this.userId = 0;
    this.user = null;
    this.router.navigate(['/login']);
  }
}
