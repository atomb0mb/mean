import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';

@Injectable({providedIn: 'root'})
export class AuthService {

    private apilocalPath = 'http://localhost:3000/api/';

    private token: string;

    private isAuthenticated = false;

    // to serve as different status listerner for login or logout display
    private authStatusListener = new Subject<boolean>();

    constructor(private http: HttpClient) {}

    getIsAuth(){
        return this.isAuthenticated;
    }

    getAuthStatListerner(){
        return this.authStatusListener.asObservable();
    }

    // to get the token
    getToken(){
        return this.token;
    }

    // http request for creating the user account
    createUser(email: string, password: string) {
        const authData: AuthData = { email: email, password: password};

        this.http.post<{ email: string }>(this.apilocalPath +'user/signup', authData).subscribe(response => {
            console.log(response);
        })
    }

    // http request for login 
    login(email: string, password: string) {
        const authData: AuthData = { email: email, password: password};
        this.http.post<{ token: string }>(this.apilocalPath + 'user/login', authData).subscribe(response => {
            // response like this from routes/user
            // res.status(200).json({
            //      token: token
            // })
            const restoken = response.token; // this requires the <{ token: string }> to works
            this.token = restoken;
            if(restoken) {
                this.isAuthenticated = true;
                this.authStatusListener.next(true);
            }
            
        })

    }

}