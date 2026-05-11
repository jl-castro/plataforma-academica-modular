import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { EstudiantesModule } from './estudiantes/estudiantes.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule.forRoot([]),
    EstudiantesModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
