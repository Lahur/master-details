import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Korisnik} from '../../models/korisnik';
import {map, publishLast, refCount, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class KorisnikService {

  options: any;

  constructor(private http: HttpClient) {
    this.options = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
  }

  getKorisnici(): Observable<Korisnik[]> {
    return this.http.get('assets/mockData/korisnici.json').pipe(publishLast(), refCount());
  }
}
