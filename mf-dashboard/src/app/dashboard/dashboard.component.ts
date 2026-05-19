import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  stats: any = null;
  loading = true;
  readonly skeletonItems = [1, 2, 3, 4];
  readonly skeletonBars = [1, 2, 3];

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('http://localhost:4204/assets/data/dashboard.json').subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loading = false;
      },
      error: () => {
        this.stats = null;
        this.loading = false;
      },
    });
  }
}
