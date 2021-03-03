import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {KorisnikStore} from '../../stores/korisnik.store';
import {LoginRequest} from '../../models/loginRequest';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginGroup: FormGroup;

  constructor(private korisnikStore: KorisnikStore, private snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
    this.loginGroup = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      lozinka: new FormControl(null, [Validators.required])
    });
  }

  login(): void {
    const loginObj: LoginRequest = this.loginGroup.value;
    this.korisnikStore.login(loginObj.username, loginObj.lozinka).subscribe(res => {
        if (res === null)
        {
          this.snackBar.open('Pogrešna prijava', 'X', {
            horizontalPosition: 'end',
            verticalPosition: 'top',
            duration: 2000
          });
        }
        else
        {
          this.router.navigate(['details']);
        }
    });
  }
}
