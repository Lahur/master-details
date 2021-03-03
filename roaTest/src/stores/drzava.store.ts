import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Drzava} from '../models/drzava';
import {Korisnik} from '../models/korisnik';
import {DrzavaService} from '../services/drzava.service';

@Injectable({
  providedIn: 'root'
})
export class DrzavaStore {

  private drzaveSubject: BehaviorSubject<Drzava[]> = new BehaviorSubject<Drzava[]>([]);
  public readonly drzave$: Observable<Drzava[]> = this.drzaveSubject.asObservable();

  constructor(private drzavaService: DrzavaService) {
  }

  getDrzave(): Observable<Drzava[]> {
    const obs = this.drzavaService.getDrzave();
    obs.subscribe(res => {
      this.drzaveSubject.next(res);
    });

    return obs;
  }
}
