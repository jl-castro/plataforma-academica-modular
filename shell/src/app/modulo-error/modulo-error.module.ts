import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ModuloErrorComponent } from './modulo-error.component';

@NgModule({
  declarations: [ModuloErrorComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: ModuloErrorComponent }]),
    LucideAngularModule,
  ],
  exports: [ModuloErrorComponent],
})
export class ModuloErrorModule {}
