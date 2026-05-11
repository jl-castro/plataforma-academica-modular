import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  Activity,
  AlertCircle,
  Award,
  BarChart2,
  BookOpen,
  CheckCircle,
  Clock,
  GraduationCap,
  LucideAngularModule,
  TrendingUp,
  Users,
} from 'lucide-angular';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    DashboardRoutingModule,
    LucideAngularModule.pick({
      Users,
      GraduationCap,
      BookOpen,
      TrendingUp,
      Award,
      BarChart2,
      Activity,
      CheckCircle,
      Clock,
      AlertCircle,
    }),
  ],
})
export class DashboardModule {}
