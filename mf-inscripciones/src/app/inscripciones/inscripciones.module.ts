import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InscripcionesRoutingModule } from './inscripciones-routing.module';
import { InscripcionesComponent } from './inscripciones.component';

@NgModule({
	declarations: [InscripcionesComponent],
	imports: [CommonModule, InscripcionesRoutingModule],
})
export class InscripcionesModule {}
