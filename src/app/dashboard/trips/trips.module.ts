import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { OngoingTripsComponent } from './ongoing-trips/ongoing-trips.component';
import { TripsRoutes } from './trips.routing';
import { CompletedTripsComponent } from './completed-trips/completed-trips.component';

@NgModule({
  declarations: [OngoingTripsComponent, CompletedTripsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(TripsRoutes),
  ]
})
export class TripsModule { }
