import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Autorizar el llamado a nuestro end point, pasar el Bearer token atraves de header
    const authRequest = request.clone({ // Se va a clonar para poder editar
      setHeaders:{
        'Authorization': this.cookieService.get('Authorization') // Modificamos el parametro Authorization
      }
    })
    return next.handle(authRequest);
  }
}
