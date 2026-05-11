import { Component, OnInit } from '@angular/core';
import { ManifestService, MicrofrontendManifestEntry } from '../services/manifest.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  modulos: MicrofrontendManifestEntry[] = [];

  constructor(private readonly manifestService: ManifestService) {}

  ngOnInit(): void {
    this.manifestService.getModulos().subscribe((modulos) => {
      this.modulos = Object.values(modulos).filter((modulo) => modulo.estado === 'activo');
    });
  }
}
