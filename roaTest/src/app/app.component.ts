import {Component, ViewChild} from '@angular/core';
import {DrzavaService} from '../mock/mockServices/drzava.service';
import {KorisnikStore} from '../stores/korisnik.store';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {SatPopover} from '@ncstate/sat-popover';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'roaTest';
  @ViewChild('p') popover: SatPopover;
  constructor(private korisnikStore: KorisnikStore, private router: Router) {
    this.korisnikStore.getKorisnike();
  }

  getCurrentKorisnik(): Observable<string> {
    return this.korisnikStore.korisnici$.pipe(
      map(m => {
        const username = sessionStorage.getItem('user');
        const kor = m.filter(f => f.username === username);
        if (kor.length === 0)
        {
          return '';
        }
        else
        {
          return kor[0].ime + ' ' + kor[0].prezime;
        }
      })
    );
  }

  odjava(): void {
    this.popover.close();
    sessionStorage.removeItem('user');
    this.router.navigate(['login']);
  }

  checkSession(): boolean {
    return !!sessionStorage.getItem('user');
  }
}
