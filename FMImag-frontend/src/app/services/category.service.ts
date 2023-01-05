import { Injectable } from '@angular/core';
import {environment} from "../../environment";
import {HttpClient} from "@angular/common/http";
import {Category} from "../dto/category";
import {StringProductFilter} from "../dto/filters/string-product-filter";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private baseUrl = environment.apiUrl + "/categories"

  constructor(private httpClient: HttpClient) { }

  getCategoryList(){
    return this.httpClient.get<Category[]>(this.baseUrl);
  }

  getCategoryFilters(category: string) {
    return this.httpClient.get<StringProductFilter[]>(environment.apiUrl + "/products/getCategoryFilters/" + category);
  }
}
