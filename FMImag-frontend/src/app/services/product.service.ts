import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Product} from "../dto/product";
import {environment} from "../../environment";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = environment.apiUrl + "/products"

  constructor(private httpClient: HttpClient) { }

  getProductList(){
    return this.httpClient.get<Product[]>(this.baseUrl);
  }
}

export interface ImageResponse {
  content: string;
  type: string;
}

