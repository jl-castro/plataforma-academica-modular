import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { EstudiantesModule } from './estudiantes/estudiantes.module';
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
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule.forRoot([]),
    EstudiantesModule,
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
  bootstrap: [AppComponent],
})
export class AppModule {}
