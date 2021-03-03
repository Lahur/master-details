import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {KorisnikStore} from '../stores/korisnik.store';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SessionGuard implements CanActivate {

  constructor(private router: Router, private korisnikStore: KorisnikStore) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.korisnikStore.getKorisnike().pipe(
      map(m => {
        const username = sessionStorage.getItem('user');
        const matchKorisnik = m.filter(f => f.username === username);
        if (matchKorisnik.length > 0)
        {
          return true;
        }
        else
        {
          this.router.navigate(['login']);
          return false;
        }
      })
    );
  }

}
