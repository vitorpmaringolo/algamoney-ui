import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { MessageService } from 'primeng/api';

import { Contato, Pessoa } from 'src/app/core/model';
import { PessoaService } from '../pessoa.service';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { updateFor } from 'typescript';

@Component({
  selector: 'app-pessoa-cadastro',
  templateUrl: './pessoa-cadastro.component.html',
  styleUrls: ['./pessoa-cadastro.component.css'],
})
export class PessoaCadastroComponent implements OnInit {
  pessoa = new Pessoa();
  estados: any[] = [];
  cidades: any[] = [];
  estadoSelecionado?: number;

  constructor(
    private pessoaService: PessoaService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title
  ) {}

  ngOnInit(): void {
    const codigoPessoa = this.route.snapshot.params['codigo'];

    this.title.setTitle('Nova pessoa');

    this.carregarEstados();

    if (codigoPessoa) {
      this.carregarPessoa(codigoPessoa);
    }
  }

  carregarEstados() {
    this.pessoaService
      .listarEstados()
      .then((lista) => {
        this.estados = lista.map((uf) => ({
          label: uf.nome,
          value: uf.codigo,
        }));
      })
      .catch((erro) => this.errorHandler.handle(erro));
  }

  carregarCidades() {
    this.pessoaService
      .pesquisarCidades(this.estadoSelecionado!)
      .then((lista) => {
        this.cidades = lista.map((c) => ({ label: c.nome, value: c.codigo }));
        if (
          this.estadoSelecionado !== this.pessoa.endereco.cidade.estado.codigo
        ) {
          this.pessoa.endereco.cidade.codigo = undefined;
        }
      })
      .catch((erro) => this.errorHandler.handle(erro));
  }

  get editando() {
    return Boolean(this.pessoa.codigo);
  }

  carregarPessoa(codigo: number) {
    this.pessoaService
      .buscarPorCodigo(codigo)
      .then((pessoa: Pessoa) => {
        this.pessoa = pessoa;

        this.estadoSelecionado = this.pessoa.endereco.cidade
          ? this.pessoa.endereco.cidade.estado.codigo
          : undefined;

        if (this.estadoSelecionado) {
          this.carregarCidades();
        }

        this.atualizarTituloEdicao();
      })
      .catch((erro) => this.errorHandler.handle(erro));
  }

  salvar(form: NgForm) {
    if (this.editando) {
      this.atualizarPessoa(form);
    } else {
      this.adicionarPessoa(form);
    }
  }

  adicionarPessoa(form: NgForm) {
    this.pessoaService
      .adicionar(this.pessoa)
      .then((pessoaAdicionada: Pessoa) => {
        this.messageService.add({
          severity: 'success',
          detail: 'Pessoa adicionada com sucesso!',
        });

        this.router.navigate(['/pessoas', pessoaAdicionada.codigo]);
      })
      .catch((erro) => this.errorHandler.handle(erro));
  }

  atualizarPessoa(form: NgForm) {
    this.pessoaService
      .atualizar(this.pessoa)
      .then((pessoa: Pessoa) => {
        this.pessoa = pessoa;

        this.messageService.add({
          severity: 'success',
          detail: 'Pessoa alterada com sucesso!',
        });
        this.atualizarTituloEdicao();
      })
      .catch((erro) => this.errorHandler.handle(erro));
  }

  nova(form: NgForm) {
    form.reset();

    setTimeout(() => {
      this.pessoa = new Pessoa();
    }, 1);

    this.router.navigate(['/pessoas/nova']);
  }

  atualizarTituloEdicao() {
    this.title.setTitle(`Edição de pessoa: ${this.pessoa.nome}`);
  }
}
