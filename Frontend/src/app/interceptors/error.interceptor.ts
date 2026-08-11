import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req).pipe(
        catchError((error) => {
            let errorMessage: string;
            if (error.status === 0) {
                errorMessage = "Cannot connect to the server.";
            } else {
                errorMessage = error.error?.detail || error.error?.title || `${error.status} ${error.statusText}`;
            }
            alert(`Error: ${errorMessage}`);
            return throwError(() => error);
        })
    );
};
