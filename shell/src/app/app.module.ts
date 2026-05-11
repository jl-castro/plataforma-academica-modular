import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule, PAM_MODULO_CARGADO_INITIALIZER } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ArquitecturaConsoleComponent } from './arquitectura-console/arquitectura-console.component';

@NgModule({
  declarations: [AppComponent, NavbarComponent, ArquitecturaConsoleComponent],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
  ],
  providers: [PAM_MODULO_CARGADO_INITIALIZER],
  bootstrap: [AppComponent],
})
export class AppModule {}
