import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { InscripcionesModule } from './inscripciones/inscripciones.module';
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
		InscripcionesModule,
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
