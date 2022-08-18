import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { LancamentoCadastroComponent } from './lancamento-cadastro/lancamento-cadastro.component';
import { LancamentosPesquisaComponent } from './lancamentos-pesquisa/lancamentos-pesquisa.component';

import { SharedModule } from '../shared/shared.module';

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [LancamentoCadastroComponent, LancamentosPesquisaComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,

    SharedModule,

    ButtonModule,
    CalendarModule,
    DropdownModule,
    InputMaskModule,
    InputNumberModule,
    InputTextareaModule,
    InputTextModule,
    SelectButtonModule,
    TableModule,
    TooltipModule,
  ],
  exports: [LancamentoCadastroComponent, LancamentosPesquisaComponent],
})
export class LancamentosModule {}
