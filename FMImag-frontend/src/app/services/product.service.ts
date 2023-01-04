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

  getProductList() {
    return this.httpClient.get<Product[]>(this.baseUrl);
  }

  getTopProductList() {
    return this.httpClient.get<Product[]>(this.baseUrl + "/TopProducts");
  }

  getProduct(productId: string) {
    return this.httpClient.get<Product>(environment.apiUrl + "/product/" + productId);
  }
}

export interface ImageResponse {
  content: string;
  type: string;
}

