import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {publishLast, refCount} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Korisnik} from '../models/korisnik';
import {LoginRequest} from '../models/loginRequest';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KorisnikService {

  options: any;
  address = environment.url + 'korisnik';

  constructor(private http: HttpClient) {
    this.options = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
  }

  getKorisnici(): Observable<Korisnik[]> {
    return this.http.get(this.address, this.options).pipe(publishLast(), refCount());
  }

  login(username: string, lozinka: string): Observable<Korisnik> {
    const body = new LoginRequest();
    body.username = username;
    body.lozinka = lozinka;
    return this.http.post(environment.url + 'login', body, this.options).pipe(publishLast(), refCount());
  }

  save(korisnik: Korisnik): Observable<Korisnik> {
    return this.http.post(this.address, korisnik, this.options).pipe(publishLast(), refCount());
  }

  delete(id: string): Observable<void> {
    return this.http.delete(this.address + '/' + id, this.options).pipe(publishLast(), refCount());
  }

}
