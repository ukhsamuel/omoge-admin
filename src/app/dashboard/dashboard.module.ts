import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';
import { ChartistModule } from 'ng-chartist';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CalendarModule, CalendarDateFormatter } from 'angular-calendar';

import { DashboardRoutes } from './dashboard.routing';

import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { QRCodeModule } from 'angularx-qrcode';

import {
  ActivevisitComponent,
  VisitorComponent,
  ActivitypagesComponent,
  CamStatsComponent,
  CamoverComponent,
  ConversionEarningsComponent,
  ChartComponent,
  CurrencyComponent,
  MarketComponent,
  OrderComponent,
  CryptoComponent,
  TradeComponent,
  DeviceSalesComponent,
  EarningsComponent,
  EcomSalesComponent,
  EcomorderComponent,
  EcomproductComponent,
  EcomReviewComponent,
  StatsComponent,
  EmailComponent,
  Emailcompaign2Component,
  FeedsComponent,
  InfocardComponent,
  MixstatsComponent,
  MonthoverviewComponent,
  MonthscheduleComponent,
  MonthviewComponent,
  PollComponent,
  ProapprComponent,
  ProfileactivityComponent,
  ProjectComponent,
  Project2Component,
  RealdataComponent,
  RealtimevisitComponent,
  ChatComponent,
  CommentComponent,
  RpbComponent,
  RevenueviewsComponent,
  ReviewComponent,
  SalelocationComponent,
  SalesComponent,
  SocialComponent,
  TasklistComponent,
  ToplocationsComponent,
  TopreferralsComponent,
  TopsellComponent,
  UserprofileComponent,
  WeatherheaderComponent,
  WeathercardComponent,
  WeekpollComponent
} from './dashboard-components';
import { AddproductComponent } from '../dashboard/addproduct/addproduct.component';
import { ProductsComponent } from '../dashboard/products/products.component';
import { ProductbatchesComponent } from '../dashboard/productbatches/productbatches.component';
import { AddproductbatchComponent } from '../dashboard/addproductbatch/addproductbatch.component';
import { AddmiddlemanComponent } from '../dashboard/addmiddleman/addmiddleman.component';
import { MiddlemenComponent } from '../dashboard/middlemen/middlemen.component';
import { RevokeModalContent } from '../dashboard/middlemen/middlemen.component';

import { ViewProductModalContent } from '../dashboard/products/products.component';
import { EditProductModalContent } from '../dashboard/products/products.component';
import { DeleteProductModalContent } from '../dashboard/products/products.component';

import { ViewProductBatchModalContent } from '../dashboard/productbatches/productbatches.component';
import { EditProductBatchModalContent } from '../dashboard/productbatches/productbatches.component';
import { DeleteProductBatchModalContent } from '../dashboard/productbatches/productbatches.component';
import { ProductBatchQRModalContent } from '../dashboard/productbatches/productbatches.component';
import { AgentsComponent } from './agents/agents.component';
import { RemoveAgentModalContent } from './agents/agents.component';
import { AddAgentComponent } from './add-agent/add-agent.component';
import { RequestDeliveryComponent } from './request-delivery/request-delivery.component';
import { IncomingRequestsComponent } from './incoming-requests/incoming-requests.component';
import { RequestsComponent } from './requests/requests.component';
import { ViewRequestModalContent } from './incoming-requests/incoming-requests.component';
import { RequestPickupComponent } from './request-pickup/request-pickup.component';
import { DeliveriesComponent } from './deliveries/deliveries.component';
import {NgxPrintModule} from 'ngx-print';
import { ViewDeliveryComponent } from './view-delivery/view-delivery.component';
import { allBoxesQRModalContent } from './view-delivery/view-delivery.component';
import { ProfileComponent } from './profile/profile.component';
import { StaffComponent } from './staff/staff.component';
import { StaffModule } from './staff/staff.module';
import { AllDriversComponent } from './drivers/all-drivers/all-drivers.component';
import { ViewDriverModalContent } from './drivers/all-drivers/all-drivers.component';
import { RidersComponent } from './riders/riders.component';
import { OngoingTripsComponent } from './trips/ongoing-trips/ongoing-trips.component';
import { CancelledTripsComponent } from './trips/cancelled-trips/cancelled-trips.component';
import { CompletedTripsComponent } from './trips/completed-trips/completed-trips.component';
import { DriversPayoutRequestsComponent } from './drivers-payout-requests/drivers-payout-requests.component';
import { ViewPayoutRequestModalContent } from './drivers-payout-requests/drivers-payout-requests.component';
import { DriversProcessedRequestsComponent } from './drivers-processed-requests/drivers-processed-requests.component';
import { ViewProcessedRequestModalContent } from './drivers-processed-requests/drivers-processed-requests.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    NgbModule,
    ChartsModule,
    QRCodeModule,
    StaffModule,
    ChartistModule,
    RouterModule.forChild(DashboardRoutes),
    AgmCoreModule,
    PerfectScrollbarModule,
    CalendarModule.forRoot(),
    NgxChartsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    NgxPrintModule
  ],
  declarations: [
    AllDriversComponent,
    ViewDriverModalContent,
    ViewPayoutRequestModalContent,
    EditProductModalContent,
    ViewProductModalContent,
    DeleteProductModalContent,
    HomeComponent,
    SettingsComponent,
    ActivevisitComponent,
    VisitorComponent,
    ActivitypagesComponent,
    CamStatsComponent,
    CamoverComponent,
    ConversionEarningsComponent,
    ChartComponent,
    CurrencyComponent,
    MarketComponent,
    OrderComponent,
    CryptoComponent,
    TradeComponent,
    DeviceSalesComponent,
    EarningsComponent,
    EcomSalesComponent,
    EcomorderComponent,
    EcomproductComponent,
    EcomReviewComponent,
    StatsComponent,
    EmailComponent,
    Emailcompaign2Component,
    FeedsComponent,
    InfocardComponent,
    MixstatsComponent,
    MonthoverviewComponent,
    MonthscheduleComponent,
    MonthviewComponent,
    PollComponent,
    ProapprComponent,
    ProfileactivityComponent,
    ProjectComponent,
    Project2Component,
    RealdataComponent,
    RealtimevisitComponent,
    ChatComponent,
    CommentComponent,
    RpbComponent,
    RevenueviewsComponent,
    ReviewComponent,
    SalelocationComponent,
    SalesComponent,
    SocialComponent,
    TasklistComponent,
    ToplocationsComponent,
    TopreferralsComponent,
    TopsellComponent,
    UserprofileComponent,
    WeatherheaderComponent,
    WeathercardComponent,
    WeekpollComponent,
    AddproductComponent,
    ProductsComponent,
    ProductbatchesComponent,
    AddproductbatchComponent,
    AddmiddlemanComponent,
    MiddlemenComponent,
    RevokeModalContent,
    ViewProcessedRequestModalContent,
    ViewProductBatchModalContent,
    EditProductBatchModalContent,
    DeleteProductBatchModalContent,  
    allBoxesQRModalContent,      
    ProductBatchQRModalContent,
    AgentsComponent,
    AddAgentComponent,
    RemoveAgentModalContent,
    RequestDeliveryComponent,
    IncomingRequestsComponent,
    RequestsComponent,
    ViewRequestModalContent,
    RequestPickupComponent,
    DeliveriesComponent,
    ViewDeliveryComponent,
    ProfileComponent,
    RidersComponent,
    OngoingTripsComponent,
    CancelledTripsComponent,
    CompletedTripsComponent,
    DriversPayoutRequestsComponent,
    DriversProcessedRequestsComponent
    // Drivers.RoutingComponent,
    // AllDriversComponent,
   ],
    entryComponents: [
        ViewDriverModalContent,
        ViewPayoutRequestModalContent,
        ViewProductModalContent,
        EditProductModalContent,
        DeleteProductModalContent,
        ViewProductBatchModalContent,
        EditProductBatchModalContent,
        DeleteProductBatchModalContent,
        IncomingRequestsComponent,
        ViewRequestModalContent,
        ProductBatchQRModalContent,
        allBoxesQRModalContent,
        RevokeModalContent,
        RemoveAgentModalContent,
        ViewProcessedRequestModalContent
    ]
})
export class DashboardModule {}
