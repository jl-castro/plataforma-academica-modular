import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { CalificacionesModule } from './calificaciones/calificaciones.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule.forRoot([]),
    CalificacionesModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
