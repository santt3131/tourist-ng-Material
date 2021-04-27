import { Injectable } from '@angular/core';
import { Credentials } from '../models/credentials';
import { User } from '../../profile/models/user';
import { throwError, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, exhaustMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private usersUrl = 'api/users';  // URL to web api

  constructor(private http: HttpClient) {}

  login({ email, password }: Credentials): Observable<any> {
    return this.http.get<User[]>(this.usersUrl).pipe(
      map((users) => {
        const user = users.find(x => x.profile.email === email && x.profile.password === password);
        if (user !== undefined){
          return user;
        }
        else
        {
          throw throwError('Invalid username or password');
        }
      })
    );
  }

}
