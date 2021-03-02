import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ErrorComponent } from "./auth/error/error.component";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private dialog: MatDialog){}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
    
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                
                // method 1 to display the default error message = alert(error.error.error.message)

                // method 2
                let errorMessage =  'An unknown error occurred'
                if(error.error.message) {
                    error.error.message = errorMessage;
                }
                this.dialog.open(ErrorComponent, {data: {message: errorMessage}});

                return throwError(error); 
            })
        );
    }
}