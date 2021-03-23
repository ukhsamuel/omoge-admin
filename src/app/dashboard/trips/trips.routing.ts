import { Routes, RouterModule } from '@angular/router';

import { OngoingTripsComponent } from './ongoing-trips/ongoing-trips.component';

export const TripsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'ongoing-trips',
        component: OngoingTripsComponent,
        data: {
          title: 'Home',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Ongoing Trips' }
          ]
        }
      }
    ]
  },
];