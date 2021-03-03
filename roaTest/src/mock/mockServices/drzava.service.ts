import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Drzava} from '../../models/drzava';
import {publishLast, refCount} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DrzavaService {

  options: any;

  constructor(private http: HttpClient) {
    this.options = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
  }

  getDrzave(): Observable<Drzava[]> {
    return this.http.get('assets/mockData/drzave.json').pipe(publishLast(), refCount());
  }
}
