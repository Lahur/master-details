import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, ReplaySubject} from 'rxjs';
import {Korisnik} from '../models/korisnik';
import {KorisnikService} from '../services/korisnik.service';
import {take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class KorisnikStore {
  private korisniciSubject: BehaviorSubject<Korisnik[]> = new BehaviorSubject<Korisnik[]>([]);
  public readonly korisnici$: Observable<Korisnik[]> = this.korisniciSubject.asObservable();

  constructor(private korisnikService: KorisnikService) {
  }

  getKorisnike(): Observable<Korisnik[]> {
    const obs = this.korisnikService.getKorisnici();
    obs.subscribe(res => {
      this.korisniciSubject.next(res);
    });

    return obs;
  }

  login(username: string, password: string): Observable<Korisnik> {
    const obs = this.korisnikService.login(username, password);
    obs.subscribe(res => {
      if (res !== null)
      {
        sessionStorage.setItem('user', res.username);
      }
    });

    return obs;
  }

  save(korisnik: Korisnik): Observable<Korisnik> {
    const obs = this.korisnikService.save(korisnik);
    obs.subscribe(res => {
      const korisnici = this.getSubjectData();
      this.korisniciSubject.next(korisnici.concat(res));
    });

    return obs;
  }

  update(korisnik: Korisnik): Observable<Korisnik> {
    const obs = this.korisnikService.save(korisnik);
    obs.subscribe(res => {
      let korisnici = this.getSubjectData();
      korisnici = korisnici.filter(f => f.id !== res.id);
      this.korisniciSubject.next(korisnici.concat(korisnik));
    });

    return obs;
  }

  delete(id: string): void {
    const obs = this.korisnikService.delete(id);
    obs.subscribe(() => {
      const korisnici = this.getSubjectData();
      this.korisniciSubject.next(korisnici.filter(f => f.id !== id));
    });
  }

  getSubjectData(): Korisnik[] {
    let korisnici = [];
    this.korisnici$.subscribe(res => {
      korisnici = res;
    });
    return korisnici;
  }
}
