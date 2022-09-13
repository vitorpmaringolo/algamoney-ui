import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { Cidade, Estado, Pessoa } from '../core/model';
import { environment } from 'src/environments/environment';

export class PessoaFiltro {
  nome?: string;
  pagina: number = 0;
  itensPorPagina: number = 5;
}

@Injectable({
  providedIn: 'root',
})
export class PessoaService {
  pessoasUrl: string;
  cidadesUrl: string;
  estadosUrl: string;

  constructor(private http: HttpClient) {
    this.pessoasUrl = `${environment.apiUrl}/pessoas`;
    this.cidadesUrl = `${environment.apiUrl}/cidades`;
    this.estadosUrl = `${environment.apiUrl}/estados`;
  }

  pesquisar(filtro: PessoaFiltro): Promise<any> {
    let params = new HttpParams()
      .set('page', filtro.pagina)
      .set('size', filtro.itensPorPagina);

    if (filtro.nome) {
      params = params.set('nome', filtro.nome);
    }

    return firstValueFrom(this.http.get(`${this.pessoasUrl}`, { params })).then(
      (response: any) => {
        const pessoas = response['content'];

        const resultado = {
          pessoas,
          total: response['totalElements'],
        };

        return resultado;
      }
    );
  }

  listarTodas(): Promise<any> {
    return firstValueFrom(this.http.get(this.pessoasUrl)).then(
      (response: any) => response['content']
    );
  }

  excluir(codigo: number): Promise<unknown> {
    return firstValueFrom(this.http.delete(`${this.pessoasUrl}/${codigo}`));
  }

  mudarStatus(codigo: number, ativo: boolean): Promise<unknown> {
    return firstValueFrom(
      this.http.put<void>(`${this.pessoasUrl}/${codigo}/ativo`, ativo)
    );
  }

  adicionar(pessoa: Pessoa): Promise<Pessoa> {
    return firstValueFrom(this.http.post<Pessoa>(this.pessoasUrl, pessoa));
  }

  atualizar(pessoa: Pessoa): Promise<Pessoa> {
    return firstValueFrom(
      this.http.put<Pessoa>(`${this.pessoasUrl}/${pessoa.codigo}`, pessoa)
    );
  }

  buscarPorCodigo(codigo: number): Promise<Pessoa> {
    return firstValueFrom(
      this.http.get<Pessoa>(`${this.pessoasUrl}/${codigo}`)
    );
  }

  listarEstados(): Promise<Estado[]> {
    return firstValueFrom(this.http.get<Estado[]>(this.estadosUrl));
  }

  pesquisarCidades(estadoId: number): Promise<Cidade[]> {
    const params = new HttpParams().set('estado', estadoId);
    return firstValueFrom(this.http.get<Cidade[]>(this.cidadesUrl, { params }));
  }
}
