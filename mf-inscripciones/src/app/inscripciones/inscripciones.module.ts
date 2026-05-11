import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InscripcionesRoutingModule } from './inscripciones-routing.module';
import { InscripcionesComponent } from './inscripciones.component';
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
	declarations: [InscripcionesComponent],
	imports: [
		CommonModule,
		InscripcionesRoutingModule,
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
export class InscripcionesModule {}
