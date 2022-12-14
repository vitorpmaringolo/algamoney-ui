import { DatePipe } from '@angular/common';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Lancamento } from 'src/app/core/model';

export class LancamentoFiltro {
  descricao: string = '';
  dataVencimentoInicio?: Date;
  dataVencimentoFim?: Date;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable({
  providedIn: 'root',
})
export class LancamentoService {
  lancamentosUrl: string = '';

  constructor(private http: HttpClient, private datePipe: DatePipe) {
    this.lancamentosUrl = `${environment.apiUrl}/lancamentos`;
  }

  urlUploadAnexo(): string {
    return `${this.lancamentosUrl}/anexo`;
  }

  uploadHeaders() {
    return new HttpHeaders().append(
      'Authorization',
      'Bearer ' + localStorage.getItem('token')
    );
  }

  pesquisar(filtro: LancamentoFiltro): Promise<any> {
    let params = new HttpParams()
      .set('page', filtro.pagina.toString())
      .set('size', filtro.itensPorPagina.toString());

    if (filtro.descricao) {
      params = params.set('descricao', filtro.descricao);
    }

    if (filtro.dataVencimentoInicio) {
      params = params.set(
        'dataVencimentoDe',
        this.datePipe.transform(filtro.dataVencimentoInicio, 'yyyy-MM-dd')!
      );
    }

    if (filtro.dataVencimentoFim) {
      params = params.set(
        'dataVencimentoAte',
        this.datePipe.transform(filtro.dataVencimentoFim, 'yyyy-MM-dd')!
      );
    }

    return firstValueFrom(
      this.http.get(`${this.lancamentosUrl}?resumo`, { params })
    ).then((response: any) => {
      const lancamentos = response['content'];

      const resultado = {
        lancamentos,
        total: response['totalElements'],
      };

      return resultado;
    });
  }

  excluir(codigo: number): Promise<unknown> {
    return firstValueFrom(this.http.delete(`${this.lancamentosUrl}/${codigo}`));
  }

  adicionar(lancamento: Lancamento): Promise<Lancamento> {
    return firstValueFrom(
      this.http.post<Lancamento>(this.lancamentosUrl, lancamento)
    );
  }

  atualizar(lancamento: Lancamento): Promise<Lancamento> {
    return firstValueFrom(
      this.http.put<Lancamento>(
        `${this.lancamentosUrl}/${lancamento.codigo}`,
        lancamento
      )
    );
  }

  buscarPorCodigo(codigo: number): Promise<Lancamento> {
    return firstValueFrom(
      this.http.get<Lancamento>(`${this.lancamentosUrl}/${codigo}`)
    ).then((response: any) => {
      this.converterStringsParaDatas([response]);

      return response;
    });
  }

  private converterStringsParaDatas(lancamentos: Lancamento[]) {
    for (const lancamento of lancamentos) {
      // Evita bug na hora da edi????o, adiciona o timezone do usu??rio
      let offset = new Date().getTimezoneOffset() * 60000;

      lancamento.dataVencimento = new Date(
        new Date(lancamento.dataVencimento!).getTime() + offset
      );

      if (lancamento.dataPagamento) {
        lancamento.dataPagamento = new Date(
          new Date(lancamento.dataPagamento).getTime() + offset
        );
      }
    }
  }
}
