import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface MicrofrontendManifestEntry {
  id: string;
  nombre: string;
  remoteEntry: string;
  exposedModule: string;
  ruta: string;
  version: string;
  eventosEmitidos: string[];
  eventosEscuchados: string[];
  estado: 'activo' | 'inactivo' | 'error';
}

type ManifestFile = Record<string, Omit<MicrofrontendManifestEntry, 'id'> & { id?: string }>;

@Injectable({
  providedIn: 'root',
})
export class ManifestService {
  private static readonly MANIFEST_URL = 'assets/manifest.json';

  constructor(private readonly http: HttpClient) {}

  getModulos(): Observable<Record<string, MicrofrontendManifestEntry>> {
    return this.http.get<ManifestFile>(ManifestService.MANIFEST_URL).pipe(
      map((file) =>
        Object.entries(file).reduce<Record<string, MicrofrontendManifestEntry>>(
          (manifest, [key, value]) => ({
            ...manifest,
            [key]: {
              ...value,
              id: value.id ?? key,
            },
          }),
          {},
        ),
      ),
    );
  }

  getMicrofrontends(): Observable<MicrofrontendManifestEntry[]> {
    return this.getModulos().pipe(map((modulos) => Object.values(modulos)));
  }
}
