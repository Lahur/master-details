import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';


@Injectable()
export class MainHttpInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method === 'POST' && req.url.endsWith('korisnik'))
    {
      req = req.clone({
        headers: new HttpHeaders({
          USER: sessionStorage.getItem('user')
        })
      });
    }
    return next.handle(req);
  }
}
