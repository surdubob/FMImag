import { Injectable } from '@angular/core';
import {environment} from "../../environment";
import {HttpClient} from "@angular/common/http";
import {Review} from "../dto/review";
import {Product} from "../dto/product";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private baseUrl = environment.apiUrl + "/cart"

  constructor(private httpClient: HttpClient) { }

  updateCart(productId: string) {
    return this.httpClient.post(this.baseUrl + "/" + productId, null);
  }
}
