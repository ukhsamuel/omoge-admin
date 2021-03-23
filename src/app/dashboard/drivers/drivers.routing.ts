import { Routes, RouterModule } from '@angular/router';

import { AllDriversComponent } from './all-drivers/all-drivers.component';

export const DriverRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: AllDriversComponent,
        data: {
          title: 'Home',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Home' }
          ]
        }
      }
    ]
  },
//   {
//     path: '',
//     redirectTo: ''
//   },
];
// export class ChequeRoutingModule {}

// import { StaffRoutingModule } from './staff/staff-routing.module';
