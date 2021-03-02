import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';

@Injectable({providedIn: 'root'})
export class AuthService {

    private apilocalPath = 'http://localhost:3000/api/';

    private token: string;

    private isAuthenticated = false;

    private tokenTimer: any; // to reset the token timer when log out

    // to serve as different status listerner for login or logout display
    private authStatusListener = new Subject<boolean>();

    constructor(private http: HttpClient, private router: Router) {}

    // User is authenticated and return true or false
    getIsAuth() {
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
            //console.log(response);
            this.router.navigate(['/']);
        })
    }

    // http request for login 
    login(email: string, password: string) {
        const authData: AuthData = { email: email, password: password};
        this.http.post<{ token: string, expiresIn: number }>(this.apilocalPath + 'user/login', authData).subscribe(response => {
            // response like this from routes/user
            // res.status(200).json({
            //      token: token
            // })
            const restoken = response.token; // this requires the  generic <{ token: string }> to works
            this.token = restoken;
            if(restoken) {

                const expiresInDuration = response.expiresIn;
                this.setAuthTimerHelper(expiresInDuration);
                this.isAuthenticated = true;
                this.authStatusListener.next(true);

                // Coverting time to date and save token to local storage
                const currentDate = new Date();
                const expirationDate =  new Date(currentDate.getTime() + (expiresInDuration * 1000));
                this.saveAuthData(restoken, expirationDate);

                this.router.navigate(['/']);
            }
            
        })

    }
    // auto auth user or auto login if token exists
    AutoLogin(){
        const authInformation = this.getAuthData();

        // It should not auto-login if the local storage is empty..
        if(!authInformation){
            return ;
        }
        
        const now = new Date();
        // get the time diff
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

        // console.log(authInformation.token);
        // console.log(expiresIn);

        // Expire time should be greater than current time
        if(expiresIn > 0){
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.setAuthTimerHelper(expiresIn / 1000);
            this.authStatusListener.next(true);
        }
    }


    // logout to clear the token and set auth status to false
    logout() {

        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(['/']);
        
    }

    // save token in local storage
    private saveAuthData(token: string, expirationDate: Date){
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
    }

    // clear token in local storage when clicks logout
    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
    }

    // Retrieve token from local storage 
    private  getAuthData() {

        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');

        if(!token || !expirationDate) {
            // to handle in case user cleared the cache/local storage manually via Devtools
            this.logout();
            return;
        }
        return { token: token, expirationDate: new Date(expirationDate)} 
    }
    // helper to set timer
    private setAuthTimerHelper(duration: number){
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000) // because it is in milliseconds
    }
}