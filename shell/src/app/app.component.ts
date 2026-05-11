import { Component, OnInit, inject } from '@angular/core';
import { ManifestService, MicrofrontendManifestEntry } from './services/manifest.service';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly manifestService = inject(ManifestService);

  protected titulo = 'Plataforma Académica Modular';
  protected microfrontends: MicrofrontendManifestEntry[] = [];

  ngOnInit(): void {
    this.manifestService.getMicrofrontends().subscribe({
      next: (lista) => {
        this.microfrontends = lista;
      },
      error: () => {
        this.microfrontends = [];
      },
    });
  }
}
