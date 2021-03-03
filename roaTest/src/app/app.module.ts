import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BackendHttpInterceptor} from '../mock/interceptor/backend-http-interceptor';
import { LoginComponent } from '../components/login/login.component';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MasterDetailComponent } from '../components/master-detail/master-detail.component';
import {MatOptionModule} from '@angular/material/core';
import {SatPopoverModule} from '@ncstate/sat-popover';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MasterDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatButtonModule,
    MatSnackBarModule,
    MatSelectModule,
    MatTableModule,
    MatCheckboxModule,
    MatIconModule,
    ReactiveFormsModule,
    MatOptionModule,
    FormsModule,
    SatPopoverModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BackendHttpInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
