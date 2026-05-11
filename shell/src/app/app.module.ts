import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import {
  AppRoutingModule,
  NoCacheRouteReuseStrategy,
  PAM_MODULO_CARGADO_INITIALIZER,
} from './app-routing.module';
import { AppComponent } from './app.component';
import { ModuloHealthGuard } from './guards/modulo-health.guard';
import { EventBusService, eventBusInstance } from './services/event-bus.service';
import { NavbarComponent } from './navbar/navbar.component';
import { ArquitecturaConsoleComponent } from './arquitectura-console/arquitectura-console.component';
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  Award,
  BookMarked,
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronRight,
  ClipboardList,
  Clock,
  GraduationCap,
  Hash,
  LayoutDashboard,
  LucideAngularModule,
  RefreshCw,
  TrendingUp,
  User,
  Users,
  XCircle,
} from 'lucide-angular';

@NgModule({
  declarations: [AppComponent, NavbarComponent, ArquitecturaConsoleComponent],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    LucideAngularModule.pick({
      Users,
      GraduationCap,
      BookOpen,
      ClipboardList,
      LayoutDashboard,
      Activity,
      BookMarked,
      Calendar,
      User,
      Hash,
      Clock,
      ChevronRight,
      Award,
      AlertCircle,
      ArrowLeft,
      RefreshCw,
      CheckCircle,
      XCircle,
      TrendingUp,
    }),
  ],
  providers: [
    PAM_MODULO_CARGADO_INITIALIZER,
    ModuloHealthGuard,
    { provide: RouteReuseStrategy, useClass: NoCacheRouteReuseStrategy },
    { provide: EventBusService, useValue: eventBusInstance },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
