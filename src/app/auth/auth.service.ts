import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';

@Injectable({providedIn: 'root'})
export class AuthService {

    private apilocalPath = 'http://localhost:3000/api/';

    constructor(private http: HttpClient) {}

    // http request for creating the user account
    createUser(email: string, password: string) {
        const authData: AuthData = { email: email, password: password};

        this.http.post<{ email: string, password: string }>(this.apilocalPath +'user/signup', authData).subscribe(response => {
            console.log(response);
        })
    }

    // http request for login 
    login(email: string, password: string) {
        const authData: AuthData = { email: email, password: password};
        this.http.post<{ email: string, password: string }>(this.apilocalPath + 'user/login', authData).subscribe(response => {
            console.log(response);
        })

    }

}