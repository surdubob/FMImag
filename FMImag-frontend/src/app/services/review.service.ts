import { Injectable } from '@angular/core';
import {environment} from "../../environment";
import {HttpClient} from "@angular/common/http";
import {Review} from "../dto/review";
import {Product} from "../dto/product";

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private baseUrl = environment.apiUrl + "/products"

  constructor(private httpClient: HttpClient) { }

  addReview(review: Review){
    return this.httpClient.post<Review>(this.baseUrl + "/postReview", review);
  }

  getAllReviewsForCurrentProduct(productId: number) {
    return this.httpClient.get<Review[]>(this.baseUrl + "/review/" + productId.toString());
  }

}
