import { SegurancaRoutingModule } from './seguranca-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

import { LoginFormComponent } from './login-form/login-form.component';

@NgModule({
  declarations: [LoginFormComponent],
  imports: [
    CommonModule,
    FormsModule,

    InputTextModule,
    ButtonModule,

    SegurancaRoutingModule,
  ],
})
export class SegurancaModule {}
