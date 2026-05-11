import { Injectable } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/module-federation';

@Injectable({ providedIn: 'root' })
export class EventBusLoaderService {
  private eventBus: any = null;

  async getEventBus(): Promise<any> {
    if (this.eventBus) {
      return this.eventBus;
    }
    const m = await loadRemoteModule({
      type: 'module',
      remoteEntry: 'http://localhost:4200/remoteEntry.js',
      exposedModule: './EventBusService',
    });
    this.eventBus = m.eventBusInstance;
    return this.eventBus;
  }
}
