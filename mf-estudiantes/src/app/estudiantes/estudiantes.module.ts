import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstudiantesRoutingModule } from './estudiantes-routing.module';
import { EstudiantesComponent } from './estudiantes.component';

@NgModule({
  declarations: [EstudiantesComponent],
  imports: [CommonModule, EstudiantesRoutingModule],
})
export class EstudiantesModule {}
