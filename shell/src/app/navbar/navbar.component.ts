import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  protected readonly enlaces = [
    { ruta: '/estudiantes', etiqueta: 'Estudiantes', inicial: 'ES' },
    { ruta: '/inscripciones', etiqueta: 'Inscripciones', inicial: 'IN' },
    { ruta: '/calificaciones', etiqueta: 'Calificaciones', inicial: 'CA' },
  ] as const;
}
