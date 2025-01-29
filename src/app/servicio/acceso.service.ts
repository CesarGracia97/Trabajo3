import { getApiUrl } from './../../interfaces/constantes';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccesoService {
  constructor(private http: HttpClient) { }

  postData(body: any, endPoint: string): Observable<any> {
    let head = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
    let options = { headers: head };
    let server = getApiUrl(endPoint);
    return this.http.post(server, JSON.stringify(body), options);
  }


  getData(endPoint: string): Observable<any> {
    let head = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
    let options = { headers: head };
    let server = getApiUrl(endPoint);
    return this.http.get(server, options);
  }


  putData(body: any, endPoint: string): Observable<any> {
    let head = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
    let options = { headers: head };
    let server = getApiUrl(endPoint);
    return this.http.put(server, JSON.stringify(body), options);
  }

  patchData(body: any, endPoint: string): Observable<any> {
    let head = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
    let options = { headers: head };
    let server = getApiUrl(endPoint);
    return this.http.patch(server, JSON.stringify(body), options);
  }

}
