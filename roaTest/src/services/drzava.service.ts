import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Drzava} from '../models/drzava';
import {publishLast, refCount} from 'rxjs/operators';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DrzavaService {

  options: any;
  address = environment.url;

  constructor(private http: HttpClient) {
    this.options = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
  }

  getDrzave(): Observable<Drzava[]> {
    return this.http.get(this.address + 'drzava', this.options).pipe(publishLast(), refCount());
  }
}
