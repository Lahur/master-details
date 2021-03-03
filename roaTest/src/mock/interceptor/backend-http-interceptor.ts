import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {KorisnikService} from '../mockServices/korisnik.service';
import {DrzavaService} from '../mockServices/drzava.service';
import {Drzava} from '../../models/drzava';
import {Korisnik} from '../../models/korisnik';
import {map} from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import {LoginRequest} from '../../models/loginRequest';

@Injectable()
export class BackendHttpInterceptor implements HttpInterceptor {

  private drzave: Drzava[] = null;
  private korisnici: Korisnik[] = null;

  constructor(private mockKorisnikService: KorisnikService, private mockDrzavaService: DrzavaService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method === 'GET' && req.url.endsWith('korisnik')) {
      if (this.korisnici === null)
      {
        const obs = this.mockKorisnikService.getKorisnici();
        obs.subscribe(res => {
          this.korisnici = res;
        });
        return obs.pipe(
          map(m => new HttpResponse({status: 200, body: m}))
        );
      }
      else
      {
        return of(new HttpResponse({status: 200, body: this.korisnici}));
      }
    }
    if (req.method === 'POST' && req.url.endsWith('korisnik')) {
      if (this.korisnici === null)
      {
        const obs = this.mockKorisnikService.getKorisnici();
        obs.subscribe(res => {
          this.korisnici = res;
        });
      }
      const korisnik: Korisnik = req.body;
      if (korisnik.id) {
        this.korisnici = this.korisnici.filter(f => f.id !== korisnik.id);
      }
      else {
        korisnik.id = uuidv4();
      }
      this.korisnici = this.korisnici.concat(korisnik);
      return of(new HttpResponse({status: 200, body: korisnik}));
    }
    if (req.method === 'DELETE' && req.url.includes('korisnik'))
    {
      const id = req.url.split('/').pop();
      this.korisnici = this.korisnici.filter(f => f.id !== id);
      return of(new HttpResponse({status: 204}));
    }
    if (req.method === 'POST' && req.url.endsWith('login'))
    {
      const loginReq: LoginRequest = req.body;
      let obs = of([]);
      if (this.korisnici === null)
      {
        obs = this.mockKorisnikService.getKorisnici();
      }
      else
      {
        obs = of(this.korisnici);
      }
      return obs.pipe(
        map(m => {
          const kors = m.filter(f => f.username === loginReq.username && f.lozinka === loginReq.lozinka);
          const korisnik = kors.length > 0 ? kors[0] : null;
          return new HttpResponse({status: 200, body: korisnik});
        })
      );

    }
    if (req.method === 'GET' && req.url.endsWith('drzava'))
    {
      const obs = this.mockDrzavaService.getDrzave();
      if (this.drzave === null)
      {
        obs.subscribe(res => {
          this.drzave = res;
        });
      }
      return obs.pipe(
        map(m => new HttpResponse({status: 200, body: m}))
      );
    }
    return next.handle(req);
  }

}
