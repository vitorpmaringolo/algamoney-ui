import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { AuthService } from './../../seguranca/auth.service';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { LancamentoFiltro, LancamentoService } from './../lancamento.service';

import {
  LazyLoadEvent,
  MessageService,
  ConfirmationService,
} from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-lancamentos-pesquisa',
  templateUrl: './lancamentos-pesquisa.component.html',
  styleUrls: ['./lancamentos-pesquisa.component.css'],
})
export class LancamentosPesquisaComponent implements OnInit {
  totalRegistros = 0;
  filtro = new LancamentoFiltro();
  lancamentos: any[] = [];

  @ViewChild('tabela') grid!: Table;

  constructor(
    private auth: AuthService,
    private lancamentoService: LancamentoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private errorHandler: ErrorHandlerService,
    private title: Title
  ) {}

  ngOnInit() {
    this.title.setTitle('Pesquisa de lançamentos');
  }

  pesquisar(pagina = 0) {
    this.filtro.pagina = pagina;

    this.lancamentoService
      .pesquisar(this.filtro)
      .then((resultado) => {
        this.totalRegistros = resultado.total;
        this.lancamentos = resultado.lancamentos;
      })
      .catch((erro) => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    let pagina = 0;
    if (event.first && event.rows) {
      pagina = event.first / event.rows;
    }
    this.pesquisar(pagina);
  }

  confirmarExclusao(lancamento: any) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(lancamento);
      },
    });
  }

  excluir(lancamento: any) {
    this.lancamentoService
      .excluir(lancamento.codigo)
      .then(() => {
        this.grid.reset();
        this.messageService.add({
          severity: 'success',
          detail: 'Lançamento excluído com sucesso!',
        });
      })
      .catch((erro) => this.errorHandler.handle(erro));
  }

  naoTemPermissao(permissao: string) {
    return !this.auth.temPermissao(permissao);
  }
}
