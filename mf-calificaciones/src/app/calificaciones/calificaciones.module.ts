import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalificacionesRoutingModule } from './calificaciones-routing.module';
import { CalificacionesComponent } from './calificaciones.component';

@NgModule({
  declarations: [CalificacionesComponent],
  imports: [CommonModule, CalificacionesRoutingModule],
})
export class CalificacionesModule {}
