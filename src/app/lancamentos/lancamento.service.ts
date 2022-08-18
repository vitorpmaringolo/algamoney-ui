import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

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
  lancamentosUrl = 'http://localhost:8080/lancamentos';

  constructor(private http: HttpClient, private datePipe: DatePipe) {}

  pesquisar(filtro: LancamentoFiltro): Promise<any> {
    const headers = new HttpHeaders().append(
      'Authorization',
      'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg=='
    );
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
      this.http.get(`${this.lancamentosUrl}?resumo`, { headers, params })
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
    const headers = new HttpHeaders().append(
      'Authorization',
      'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg=='
    );

    return firstValueFrom(
      this.http.delete(`${this.lancamentosUrl}/${codigo}`, { headers })
    );
  }

  adicionar(lancamento: Lancamento): Promise<Lancamento> {
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==')
      .append('Content-Type', 'application/json');

    return firstValueFrom(
      this.http.post<Lancamento>(this.lancamentosUrl, lancamento, { headers })
    );
  }

  atualizar(lancamento: Lancamento): Promise<Lancamento> {
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==')
      .append('Content-Type', 'application/json');

    return firstValueFrom(
      this.http.put<Lancamento>(
        `${this.lancamentosUrl}/${lancamento.codigo}`,
        lancamento,
        { headers }
      )
    );
  }

  buscarPorCodigo(codigo: number): Promise<Lancamento> {
    const headers = new HttpHeaders().append(
      'Authorization',
      'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg=='
    );

    return firstValueFrom(
      this.http.get<Lancamento>(`${this.lancamentosUrl}/${codigo}`, { headers })
    ).then((response: any) => {
      this.converterStringsParaData([response]);

      return response;
    });
  }

  private converterStringsParaData(lancamentos: Lancamento[]) {
    for (const lancamento of lancamentos) {
      // Evita bug na hora da edição, adicionar o timezone do usuário
      let offset = new Date().getTimezoneOffset() * 60000;

      if (lancamento.dataVencimento) {
        lancamento.dataVencimento = new Date(
          new Date(lancamento.dataVencimento).getTime() + offset
        );
      }

      if (lancamento.dataPagamento) {
        lancamento.dataPagamento = new Date(
          new Date(lancamento.dataPagamento).getTime() + offset
        );
      }
    }
  }
}
