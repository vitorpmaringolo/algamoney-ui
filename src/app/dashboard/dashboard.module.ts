import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

import { PanelModule } from 'primeng/panel';
import { ChartModule } from 'primeng/chart';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,

    ChartModule,
    PanelModule,

    SharedModule,
    DashboardRoutingModule,
  ],
  declarations: [DashboardComponent],
  providers: [CurrencyPipe],
})
export class DashboardModule {}
