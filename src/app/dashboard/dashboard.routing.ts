import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { AddproductComponent } from '../dashboard/addproduct/addproduct.component';
import { ProductsComponent } from '../dashboard/products/products.component';
import { ProductbatchesComponent } from '../dashboard/productbatches/productbatches.component';
import { AddproductbatchComponent } from '../dashboard/addproductbatch/addproductbatch.component';
import { AddmiddlemanComponent } from '../dashboard/addmiddleman/addmiddleman.component';
import { MiddlemenComponent } from '../dashboard/middlemen/middlemen.component';
import { AgentsComponent } from './agents/agents.component';
import { AddAgentComponent } from './add-agent/add-agent.component';
import { RequestDeliveryComponent } from './request-delivery/request-delivery.component';
import { IncomingRequestsComponent } from './incoming-requests/incoming-requests.component';
import { RequestsComponent } from './requests/requests.component';
import { AllDriversComponent } from './drivers/all-drivers/all-drivers.component';
import { RequestPickupComponent } from './request-pickup/request-pickup.component';
import { DeliveriesComponent } from './deliveries/deliveries.component';
import { ViewDeliveryComponent } from './view-delivery/view-delivery.component';
import { ProfileComponent } from './profile/profile.component';
import { StaffModule } from './staff/staff.module';
import { AddComponent } from './staff/add/add.component';
import { RidersComponent } from './riders/riders.component';
import { OngoingTripsComponent } from './trips/ongoing-trips/ongoing-trips.component';
import { CompletedTripsComponent } from './trips/completed-trips/completed-trips.component';
import { CancelledTripsComponent } from './trips/cancelled-trips/cancelled-trips.component';
import { DriversPayoutRequestsComponent } from './drivers-payout-requests/drivers-payout-requests.component';
import { DriversProcessedRequestsComponent } from './drivers-processed-requests/drivers-processed-requests.component';

export const DashboardRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: HomeComponent,
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
  {
    path: '',
    children: [
      {
        path: 'riders',
        component: RidersComponent,
        data: {
          title: 'Riders',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Riders' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'products',
        component: ProductsComponent,
        data: {
          title: 'Products',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Products' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'add-product',
        component: AddproductComponent,
        data: {
          title: 'Products',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Add Product' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'add-product-batch',
        component: AddproductbatchComponent,
        data: {
          title: 'Add Product Batch',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Add Product Batch' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'product-batches',
        component: ProductbatchesComponent,
        data: {
          title: 'Product Batches',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Product Batches' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'add-middleman',
        component: AddmiddlemanComponent,
        data: {
          title: 'Add Distributor',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Add Distributor' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'middlemen',
        component: MiddlemenComponent,
        data: {
          title: 'Distributors',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Distributors' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'agents',
        component: AgentsComponent,
        data: {
          title: 'Agents',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Agents' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'add-agent',
        component: AddAgentComponent,
        data: {
          title: 'Add Agents',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Add Agent' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'request-pickup',
        component: RequestPickupComponent,
        data: {
          title: 'Request Pickup',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Request Pickup' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'incoming-requests',
        component: IncomingRequestsComponent,
        data: {
          title: 'Incoming Requests',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Incoming Requests' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'pickup-requests',
        component: RequestsComponent,
        data: {
          title: 'Your Pickups',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Pickup Requests' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'deliveries',
        component: DeliveriesComponent,
        data: {
          title: 'Deliveries',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Deliveries' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'profile',
        component: ProfileComponent,
        data: {
          title: 'Profile',
          urls: [
            { title: 'Profile', url: '/profile' },
            { title: 'Profile' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'drivers',
        component: AllDriversComponent,
        data: {
          title: 'Driver',
          urls: [
            { title: 'Driver', url: '/drivers' },
            { title: 'Driver' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'ongoing-trips',
        component: OngoingTripsComponent,
        data: {
          title: 'Ongoing Trips',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Ongoing Trips' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'cancelled-trips',
        component: CancelledTripsComponent,
        data: {
          title: 'Cancelled Trips',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Cancelled Trips' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'completed-trips',
        component: CompletedTripsComponent,
        data: {
          title: 'Completed Trips',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Completed Trips' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'payout-requests',
        component: DriversPayoutRequestsComponent,
        data: {
          title: 'Drivers Payout Requests',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Drivers Payout Requests' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'processed-requests',
        component: DriversProcessedRequestsComponent,
        data: {
          title: 'Drivers Processed Requests',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Drivers Processed Requests' }
          ]
        }
      }
    ]
  },

  // {
  //   path: '',
  //   component: AllDriversComponent,
  //   children: [
  //     {
  //       path: 'drivers',
  //       loadChildren:
  //         './drivers/drivers.module#DriversModule'
  //     }
  //   ]
  // },
  {
    path: '',
    children: [
      {
        path: 'deliveries/request',
        component: RequestDeliveryComponent,
        data: {
          title: 'Request Delivery',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Request Delivery' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'deliveries/view/:id',
        component: ViewDeliveryComponent,
        data: {
          title: 'View Delivery',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'View Delivery' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'staff',
        component: StaffModule,
        data: {
          title: 'Staff',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Staff' }
          ]
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'staff/add',
        component: AddComponent,
        data: {
          title: 'Add Staff',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Add Staff' }
          ]
        }
      }
    ]
  },
  // { path: 'staff', loadChildren: './staff/staff-routing.module#StaffRoutingModule' },
  {
    path: '',
    redirectTo: ''
  },
];
// import { StaffRoutingModule } from './staff/staff-routing.module';
