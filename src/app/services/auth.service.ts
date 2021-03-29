import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserModel } from '../models/user.model';
import {map} from 'rxjs/operators';
import {environment  as env} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://identitytoolkit.googleapis.com/v1/accounts:';
  private apiKey = env.apiKey;
  private tokenKey = 'token';
  private token: string;
  private expires:number;
  private tokenExpiresKey = "expires";
 /*  private expires: number; */

  constructor(private http: HttpClient) {
    this.token = this.getToken();
    this.expires = this.getWhenTokenWillExpires();
  }

  public login(user: UserModel): Observable<any>{
    const authPayload = {
      ...user,
      returnSecureToken : true
    }
    return this.http.post(`${this.url}signInWithPassword?key=${this.apiKey}`, authPayload)
    .pipe(map(res=>{
      this.saveToken(res['idToken']);
      this.saveWhenTokenWillExpires(3600);
      console.log('rxjs works!');
      return res;
    }));
  }

  public logout():void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.tokenExpiresKey);
  }

  public register(user: UserModel): Observable<any>{
    const authPayload = {
      ...user,
      returnSecureToken : true
    }
    return this.http.post(`${this.url}signUp?key=${this.apiKey}`, authPayload)
    .pipe(map(res=>{
      this.saveToken(res['idToken']);
      this.saveWhenTokenWillExpires(3600);
      return res;
    }));
  }

  private saveToken = (token:string) :void =>localStorage.setItem(this.tokenKey, token);

  private saveWhenTokenWillExpires(secoundsToExpire:number):void{
    let expires = new Date();
    expires.setSeconds(secoundsToExpire);
    const  numberExpires = expires.getTime();
    localStorage.setItem(this.tokenExpiresKey, numberExpires.toString());
  }

  private getToken = ():string => localStorage.getItem(this.tokenKey);

  private getWhenTokenWillExpires = ():number => Number(localStorage.getItem(this.tokenExpiresKey));

  public isAuthenticate():boolean{

    if(this.token && this.expires){
      const today = new Date().getTime();
      if(today < this.expires) return true;
    }
    return false;
  }
}



