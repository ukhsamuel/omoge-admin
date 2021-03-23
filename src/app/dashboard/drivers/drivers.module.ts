import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AllDriversComponent } from './all-drivers/all-drivers.component';
import { DriverRoutes } from './drivers.routing';

@NgModule({
  declarations: [AllDriversComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(DriverRoutes),
  ]
})
export class DriversModule { }
