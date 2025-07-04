import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SummaryCustomerService {

  readonly PATH:string = "https://summarycustomerapi.onrender.com/SummaryCustomer"; //"https://localhost:44326/SummaryCustomer";
  constructor(private http:HttpClient) { }

  GetSummaryCustomer(searchText: string, page: number, pageSize: number) {
    let params = new HttpParams();
    if (searchText) {
      params = params.append('valueSearch', searchText);
    }
    params = params.append('page', page.toString());
    params = params.append('pageSize', pageSize.toString());

    return this.http.get<any>(`${this.PATH}/GetSummaryCustomer`, { params });
  }

  GetSummaryCustomerDetail(searchText: any, id: number) {
    let params = new HttpParams();
    if (searchText) {
      params = params.append('valueSearch', searchText);
      params = params.append('id', id);
    }
    return this.http.get<any>(`${this.PATH}/GetSummaryCustomerDetail`, { params });
  }

  SaveUpdateSummaryCustomer(summaryCustomer: any){
    console.log("ingreso")
    return this.http.post<any>(`${this.PATH}/CreateUpdateSummaryCustomer`, summaryCustomer);
  }

  DeleteSummaryCustomer(orderId: number){
    return this.http.post<any>(`${this.PATH}/DeleteSummaryCustomer`, orderId);
  }

}
