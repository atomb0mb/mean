import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {

    private authListenerSub: Subscription;

    userIsAuthenticated = false;

    constructor(private authService: AuthService){}


    ngOnDestroy(): void {
        this.authListenerSub.unsubscribe();
    }

    ngOnInit(): void {
        this.authListenerSub = this.authService.getAuthStatListerner().subscribe((isAuthenticated) => {
            this.userIsAuthenticated = isAuthenticated;
        });
    }

    onLogout(){
        this.authService.logout();
    }

}