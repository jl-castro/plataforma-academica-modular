import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstudiantesRoutingModule } from './estudiantes-routing.module';
import { EstudiantesComponent } from './estudiantes.component';
import {
  Activity,
  AlertCircle,
  Award,
  BookMarked,
  BookOpen,
  Calendar,
  Check,
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
  declarations: [EstudiantesComponent],
  imports: [
    CommonModule,
    EstudiantesRoutingModule,
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
      Check,
      CheckCircle,
      XCircle,
      TrendingUp,
    }),
  ],
})
export class EstudiantesModule {}
