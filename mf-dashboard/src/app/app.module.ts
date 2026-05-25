import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
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
import { AppComponent } from './app.component';
import { DashboardModule } from './dashboard/dashboard.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule.forRoot([]),
    DashboardModule,
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
  bootstrap: [AppComponent],
})
export class AppModule {}
