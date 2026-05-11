import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { InscripcionesModule } from './inscripciones/inscripciones.module';

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		CommonModule,
		RouterModule.forRoot([]),
		InscripcionesModule,
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
