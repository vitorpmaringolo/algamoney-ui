import { firstValueFrom } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pessoa } from '../core/model';

export class PessoaFiltro {
  nome?: string;
  pagina: number = 0;
  itensPorPagina: number = 5;
}

@Injectable({
  providedIn: 'root',
})
export class PessoaService {
  pessoasUrl = 'http://localhost:8080/pessoas';

  constructor(private http: HttpClient) {}

  pesquisar(filtro: PessoaFiltro): Promise<any> {
    const headers = new HttpHeaders().append(
      'Authorization',
      'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg=='
    );

    let params = new HttpParams()
      .set('page', filtro.pagina)
      .set('size', filtro.itensPorPagina);

    if (filtro.nome) {
      params = params.set('nome', filtro.nome);
    }

    return firstValueFrom(
      this.http.get(`${this.pessoasUrl}`, { headers, params })
    ).then((response: any) => {
      const pessoas = response['content'];

      const resultado = {
        pessoas,
        total: response['totalElements'],
      };

      return resultado;
    });
  }

  listarTodas(): Promise<any> {
    const headers = new HttpHeaders().append(
      'Authorization',
      'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg=='
    );

    return firstValueFrom(this.http.get(this.pessoasUrl, { headers })).then(
      (response: any) => response['content']
    );
  }

  excluir(codigo: number): Promise<unknown> {
    const headers = new HttpHeaders().append(
      'Authorization',
      'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg=='
    );

    return firstValueFrom(
      this.http.delete(`${this.pessoasUrl}/${codigo}`, { headers })
    );
  }

  mudarStatus(codigo: number, ativo: boolean): Promise<unknown> {
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==')
      .append('Content-Type', 'application/json');

    return firstValueFrom(
      this.http.put<void>(`${this.pessoasUrl}/${codigo}/ativo`, ativo, {
        headers,
      })
    );
  }

  adicionar(pessoa: Pessoa): Promise<Pessoa> {
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==')
      .append('Content-Type', 'application/json');

    return firstValueFrom(
      this.http.post<Pessoa>(this.pessoasUrl, pessoa, { headers })
    );
  }

  atualizar(pessoa: Pessoa): Promise<Pessoa> {
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==')
      .append('Content-Type', 'application/json');

    return firstValueFrom(
      this.http.put<Pessoa>(`${this.pessoasUrl}/${pessoa.codigo}`, pessoa, {
        headers,
      })
    );
  }

  buscarPorCodigo(codigo: number): Promise<Pessoa> {
    const headers = new HttpHeaders().append(
      'Authorization',
      'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg=='
    );

    return firstValueFrom(
      this.http.get<Pessoa>(`${this.pessoasUrl}/${codigo}`, { headers })
    );
  }
}
