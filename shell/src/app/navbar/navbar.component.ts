import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  protected readonly enlaces = [
    { ruta: '/estudiantes', etiqueta: 'Estudiantes' },
    { ruta: '/inscripciones', etiqueta: 'Inscripciones' },
    { ruta: '/calificaciones', etiqueta: 'Calificaciones' },
  ] as const;
}
