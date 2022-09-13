import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { CategoriaService } from 'src/app/categorias/categoria.service';
import { Lancamento } from 'src/app/core/model';
import { PessoaService } from 'src/app/pessoas/pessoa.service';
import { LancamentoService } from '../lancamento.service';
import { ErrorHandlerService } from './../../core/error-handler.service';

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
  formulario!: FormGroup;
  uploadEmAndamento = false;

  constructor(
    private categoriaService: CategoriaService,
    private pessoaService: PessoaService,
    private lancamentoService: LancamentoService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.configurarFormulario();

    this.title.setTitle('Novo lançamento');

    const codigoLancamento = this.route.snapshot.params['codigo'];

    if (codigoLancamento) {
      this.carregarLancamento(codigoLancamento);
    }

    this.carregarCategorias();
    this.carregarPessoas();
  }

  get urlUploadAnexo() {
    return this.lancamentoService.urlUploadAnexo();
  }

  antesUploadAnexo() {
    this.uploadEmAndamento = true;
  }

  aoTerminarUploadAnexo(event: any) {
    const anexo = event.originalEvent.body;
    this.formulario.patchValue({
      anexo: anexo.nome,
      urlAnexo: anexo.url,
    });
    this.uploadEmAndamento = false;
  }

  erroUpload(event: any) {
    this.messageService.add({
      severity: 'error',
      detail: 'Erro ao tentar enviar anexo!',
    });
    this.uploadEmAndamento = false;
  }

  removerAnexo() {
    this.formulario.patchValue({
      anexo: null,
      urlAnexo: null,
    });
  }

  get nomeAnexo() {
    const nome = this.formulario.get('anexo')?.value;

    if (nome) {
      return nome.substring(nome.indexOf('_') + 1, nome.length);
    }

    return '';
  }

  get uploadHeaders() {
    return this.lancamentoService.uploadHeaders();
  }

  configurarFormulario() {
    this.formulario = this.formBuilder.group({
      codigo: [],
      tipo: ['RECEITA', Validators.required],
      dataVencimento: [null, Validators.required],
      dataPagamento: [],
      descricao: [
        null,
        [this.validarObrigatoriedade, this.validarTamanhoMinimo(5)],
      ],
      valor: [null, Validators.required],
      pessoa: this.formBuilder.group({
        codigo: [null, Validators.required],
        nome: [],
      }),
      categoria: this.formBuilder.group({
        codigo: [null, Validators.required],
        nome: [],
      }),
      observacao: [],
      anexo: [],
      urlAnexo: [],
    });
  }

  validarObrigatoriedade(input: FormControl) {
    return input.value ? null : { obrigatoriedade: true };
  }

  validarTamanhoMinimo(valor: number) {
    return (input: FormControl) => {
      return !input.value || input.value.length >= valor
        ? null
        : { tamanhoMinimo: { tamanho: valor } };
    };
  }

  get editando() {
    return Boolean(this.formulario.get('codigo')?.value);
  }

  carregarLancamento(codigo: number) {
    this.lancamentoService
      .buscarPorCodigo(codigo)
      .then((lancamento: Lancamento) => {
        this.formulario.patchValue(lancamento);
        this.atualizarTituloEdicao();
      })
      .catch((erro) => this.errorHandler.handle(erro));
  }

  salvar() {
    if (this.editando) {
      this.atualizarLancamento();
    } else {
      this.adicionarLancamento();
    }
  }

  adicionarLancamento() {
    this.lancamentoService
      .adicionar(this.formulario.value)
      .then((lancamentoAdicionado) => {
        this.messageService.add({
          severity: 'success',
          detail: 'Lançamento adicionado com sucesso!',
        });

        this.router.navigate(['/lancamentos', lancamentoAdicionado.codigo]);
      })
      .catch((erro) => this.errorHandler.handle(erro));
  }

  atualizarLancamento() {
    this.lancamentoService
      .atualizar(this.formulario.value)
      .then((lancamento: Lancamento) => {
        this.formulario.patchValue(lancamento);

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

  novo() {
    this.formulario.reset(new Lancamento());

    this.router.navigate(['/lancamentos/novo']);
  }

  private atualizarTituloEdicao() {
    this.title.setTitle(
      `Edição de lançamento: ${this.formulario.get('descricao')?.value}`
    );
  }
}
