import { Component } from '@angular/core';
import { esModoIndependiente } from '../../../shared/runtime/modo-independiente';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
})
export class AppComponent {
  readonly modoIndependiente = esModoIndependiente('4203');
}
