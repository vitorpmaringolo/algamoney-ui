import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { ErrorHandlerService } from './../../core/error-handler.service';
import { CategoriaService } from 'src/app/categorias/categoria.service';
import { PessoaService } from 'src/app/pessoas/pessoa.service';
import { Lancamento } from 'src/app/core/model';
import { LancamentoService } from '../lancamento.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-lancamento-cadastro',
  templateUrl: './lancamento-cadastro.component.html',
  styleUrls: ['./lancamento-cadastro.component.css'],
})
export class LancamentoCadastroComponent implements OnInit {
  tipos = [
    { label: 'Receita', value: 'RECEITA' },
    { label: 'Despesa', value: 'DESPESA' },
  ];

  categorias = [];
  pessoas = [];
  lancamento: Lancamento = new Lancamento();

  constructor(
    private categoriaService: CategoriaService,
    private pessoaService: PessoaService,
    private lancamentoService: LancamentoService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title
  ) {}

  ngOnInit(): void {
    this.title.setTitle('Novo lançamento');

    const codigoLancamento = this.route.snapshot.params['codigo'];

    if (codigoLancamento) {
      this.carregarLancamento(codigoLancamento);
    }

    this.carregarCategorias();
    this.carregarPessoas();
  }

  get editando() {
    return Boolean(this.lancamento.codigo);
  }

  carregarLancamento(codigo: number) {
    this.lancamentoService
      .buscarPorCodigo(codigo)
      .then((lancamento: Lancamento) => {
        this.lancamento = lancamento;
        this.atualizarTituloEdicao();
      })
      .catch((erro) => this.errorHandler.handle(erro));
  }

  salvar(form: NgForm) {
    if (this.editando) {
      this.atualizarLancamento(form);
    } else {
      this.adicionarLancamento(form);
    }
  }

  adicionarLancamento(form: NgForm) {
    this.lancamentoService
      .adicionar(this.lancamento)
      .then((lancamentoAdicionado) => {
        this.messageService.add({
          severity: 'success',
          detail: 'Lançamento adicionado com sucesso!',
        });

        this.router.navigate(['/lancamentos', lancamentoAdicionado.codigo]);
      })
      .catch((erro) => this.errorHandler.handle(erro));
  }

  atualizarLancamento(form: NgForm) {
    this.lancamentoService
      .atualizar(this.lancamento)
      .then((lancamento: Lancamento) => {
        this.lancamento = lancamento;

        this.messageService.add({
          severity: 'success',
          detail: 'Lançamento alterado com sucesso!',
        });
        this.atualizarTituloEdicao();
      })
      .catch((erro) => this.errorHandler.handle(erro));
  }

  carregarCategorias() {
    return this.categoriaService
      .listarTodas()
      .then((categorias) => {
        this.categorias = categorias.map((c: any) => ({
          label: c.nome,
          value: c.codigo,
        }));
      })
      .catch((erro) => this.errorHandler.handle(erro));
  }

  carregarPessoas() {
    return this.pessoaService
      .listarTodas()
      .then((pessoas) => {
        this.pessoas = pessoas.map((p: any) => ({
          label: p.nome,
          value: p.codigo,
        }));
      })
      .catch((erro) => this.errorHandler.handle(erro));
  }

  novo(form: NgForm) {
    form.reset();

    setTimeout(() => {
      this.lancamento = new Lancamento();
    }, 1);

    this.router.navigate(['/lancamentos/novo']);
  }

  private atualizarTituloEdicao() {
    this.title.setTitle(`Edição de lançamento: ${this.lancamento.descricao}`);
  }
}
