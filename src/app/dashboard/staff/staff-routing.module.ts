import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddComponent } from './add/add.component';
import { StaffComponent } from './staff.component';
import { Routes, RouterModule } from '@angular/router';


export const staffRoutes: Routes = [
    {
      path: '',
      children: [
        {
          path: '',
          loadChildren: './staff.component#StaffModule' ,
          // component: StaffComponent,
          data: {
            title: '',
            urls: [
              { title: 'Dashboard', url: '/dashboard' },
              { title: 'Staff List' }
            ]
          }
        },
        {
          path: '',
          component: AddComponent,
          data: {
            title: 'add',
            urls: [
              { title: 'Dashboard', url: '/dashboard' },
              { title: 'Add Staff' }
            ]
          }
        }
      ]
    }
  ];
  
@NgModule({
    imports: [RouterModule.forChild(staffRoutes)],
    exports: [RouterModule]
  })
export class StaffRoutingModule {}
  
  