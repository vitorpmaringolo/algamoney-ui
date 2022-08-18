import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

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
  lancamento = new Lancamento();

  constructor(
    private categoriaService: CategoriaService,
    private pessoaService: PessoaService,
    private lancamentoService: LancamentoService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log(this.route.snapshot.params['codigo']);

    this.carregarCategorias();
    this.carregarPessoas();
  }

  salvar(form: NgForm) {
    this.lancamentoService
      .adicionar(this.lancamento)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          detail: 'Lançamento adicionado com sucesso!',
        });

        form.reset();
        this.lancamento = new Lancamento();
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
}
