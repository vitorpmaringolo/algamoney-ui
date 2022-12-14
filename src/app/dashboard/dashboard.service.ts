import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  lancamentosUrl: string;

  constructor(private http: HttpClient) {
    this.lancamentosUrl = `${environment.apiUrl}/lancamentos`;
  }

  lancamentosPorCategoria(): Promise<Array<any>> {
    return firstValueFrom(
      this.http.get(`${this.lancamentosUrl}/estatisticas/por-categoria`)
    ).then((response: any) => response);
  }

  lancamentosPorDia(): Promise<Array<any>> {
    return firstValueFrom(
      this.http.get(`${this.lancamentosUrl}/estatisticas/por-dia`)
    ).then((response: any) => {
      const dados = response;
      this.converterStringsParaDatas(dados);

      return dados;
    });
  }

  private converterStringsParaDatas(dados: Array<any>) {
    for (const dado of dados) {
      dado.dia = moment(dado.dia, 'YYYY-MM-DD').toDate();
    }
  }
}
