import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CalificacionesRoutingModule } from './calificaciones-routing.module';
import { CalificacionesComponent } from './calificaciones.component';
import {
  Activity,
  AlertCircle,
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
  TrendingUp,
  User,
  Users,
  XCircle,
} from 'lucide-angular';

@NgModule({
  declarations: [CalificacionesComponent],
  imports: [
    CommonModule,
    RouterModule,
    CalificacionesRoutingModule,
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
      CheckCircle,
      XCircle,
      TrendingUp,
    }),
  ],
})
export class CalificacionesModule {}
