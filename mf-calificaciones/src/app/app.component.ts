import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
})
export class AppComponent {
  readonly modoIndependiente =
    typeof window !== 'undefined' && window.location.port === '4203';
}
