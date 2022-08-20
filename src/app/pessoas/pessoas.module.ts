import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PessoasRoutingModule } from './pessoas-routing.module';
import { PessoaCadastroComponent } from './pessoa-cadastro/pessoa-cadastro.component';
import { PessoasPesquisaComponent } from './pessoas-pesquisa/pessoas-pesquisa.component';

import { SharedModule } from '../shared/shared.module';

import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [PessoaCadastroComponent, PessoasPesquisaComponent],
  imports: [
    CommonModule,
    FormsModule,

    SharedModule,
    PessoasRoutingModule,

    ButtonModule,
    InputMaskModule,
    InputTextModule,
    TableModule,
    TooltipModule,
  ],
  exports: [],
})
export class PessoasModule {}
