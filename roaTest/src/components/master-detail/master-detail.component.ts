import { Component, OnInit } from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {Drzava} from '../../models/drzava';
import {DrzavaStore} from '../../stores/drzava.store';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Korisnik} from '../../models/korisnik';
import {KorisnikStore} from '../../stores/korisnik.store';
import {MatSnackBar} from '@angular/material/snack-bar';
import {map, take} from 'rxjs/operators';

@Component({
  selector: 'app-master-detail',
  templateUrl: './master-detail.component.html',
  styleUrls: ['./master-detail.component.scss']
})
export class MasterDetailComponent implements OnInit {

  drzave$: Observable<Drzava[]> = of([]);
  korisnici$: Observable<Korisnik[]> = of([]);
  detailGroup: FormGroup;
  displayedColumn: string[] = ['ime', 'prezime', 'oib', 'drzava', 'username'];
  korisnikSubject: BehaviorSubject<Korisnik> = new BehaviorSubject<Korisnik>(new Korisnik());
  passwordChange: boolean;
  edit = false;

  constructor(private drzavaStore: DrzavaStore, private korisnikStore: KorisnikStore, private snackBar: MatSnackBar) {
    this.drzave$ = this.drzavaStore.drzave$;
    this.drzavaStore.getDrzave();
    this.korisnici$ = this.korisnikStore.korisnici$.pipe(
      map(m => m.sort((x, y) => x.prezime < y.prezime ? -1 : 1))
    );
    this.korisnikStore.getKorisnike();
  }

  ngOnInit(): void {
    this.korisnikSubject.asObservable().subscribe(res => {
      this.edit = res.id !== null && res.id !== undefined;
      this.detailGroup = new FormGroup({
        ime: new FormControl(res.ime, [Validators.required]),
        prezime: new FormControl(res.prezime, [Validators.required]),
        oib: new FormControl(res.oib, [Validators.required, Validators.pattern('^(?:HR)?(\\d{10}(\\d))$')]),
        drzavaId: new FormControl(res.drzavaId, [Validators.required]),
        username: new FormControl(res.username, [Validators.required]),
        lozinka: new FormControl(null, [Validators.required]),
        lozinka_rep: new FormControl(null, [Validators.required])
      });
      this.detailGroup.markAsPristine();
      this.detailGroup.markAsUntouched();
      this.passChange();
    });
  }

  getDrzava(drzavaId: string, drzava: Drzava[]): string {
    return drzava.filter(f => f.id === drzavaId).length > 0 ? drzava.filter(f => f.id === drzavaId)[0].naziv : '';
  }

  save(): void {
    const formInput = this.detailGroup.value;
    if (this.passwordChange && formInput.lozinka !== formInput.lozinka_rep)
    {
      this.snackBar.open('Lozinke se ne podudaraju', 'x', {
        verticalPosition: 'top',
        horizontalPosition: 'end',
        duration: 2000
      });
      return;
    }
    if (this.detailGroup.valid)
    {
      delete formInput.lozinka_rep;
      const korisnik: Korisnik = formInput;
      this.korisnikSubject.asObservable().pipe(take(1)).subscribe(res => {
        let obs;
        if (res.id)
        {
          korisnik.id = res.id;
          if (!this.passwordChange)
          {
            korisnik.lozinka = res.lozinka;
          }
          obs = this.korisnikStore.update(korisnik);
        }
        else
        {
          obs = this.korisnikStore.save(korisnik);
        }
        obs.subscribe(() => {
          this.korisnikSubject.next(new Korisnik());
        });
      });
    }
  }

  getData(row): void {
    this.passwordChange = false;
    this.korisnikSubject.next(row);
  }

  delete(): void {
    this.korisnikSubject.asObservable().pipe(take(1)).subscribe(res => {
      this.korisnikStore.delete(res.id);
      this.korisnikSubject.next(new Korisnik());
    });
  }

  passChange(): void {
    !this.passwordChange && this.edit ? this.detailGroup.get('lozinka').disable() : this.detailGroup.get('lozinka').enable();
    !this.passwordChange && this.edit ? this.detailGroup.get('lozinka_rep').disable() : this.detailGroup.get('lozinka_rep').enable();
  }

  cancel(): void {
    this.korisnikSubject.next(new Korisnik());
  }
}
