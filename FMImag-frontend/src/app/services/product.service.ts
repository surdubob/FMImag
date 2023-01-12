import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {filter, map, Observable} from "rxjs";
import {Product} from "../dto/product";
import {environment} from "../../environment";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {SpinnerService} from "./spinner/spinner.service";
import {FavoriteProduct} from "../dto/favoriteProduct";
import {AuthenticationService} from "./login/authentication.service";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  products: Product[] = [];
  productsShown: Product[] = [];
  topProducts: Product[] = [];
  currentPage = 1;
  pageSize = 4;

  private baseUrl = environment.apiUrl + "/products"
  searchTerm: string = "";

  constructor(private httpClient: HttpClient,
              private spinnerService: SpinnerService,
              public authenticate: AuthenticationService,
              private sanitizer: DomSanitizer) { }

  getProductList(categoryName?: string) {
    this.spinnerService.show();
    return this.httpClient.get<Product[]>( categoryName == null ? this.baseUrl : this.baseUrl + "/" + categoryName).subscribe(
      data => {
        this.products = data;
        for(var p of this.products) {
          p.imagesSafe = new Array<SafeHtml>();
          for(var img of p.images) {
            switch (img.type){
              case 'png':
                p.imagesSafe.push(this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,'
                  + img.content));
                break;
              case 'jpg':
                p.imagesSafe.push(this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
                  + img.content));
                break;
            }
          }
        }
        this.refreshProducts();
        this.spinnerService.hide();
      }
    );
  }

  refreshProducts() {
    let filteredProducts = this.products;
    if (this.searchTerm.length > 0) {
      filteredProducts = this.products.filter(p => {
        return p.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      });
    }
    this.productsShown = filteredProducts.map((product, i) => ({ ...product })).slice(
      (this.currentPage - 1) * this.pageSize,
      (this.currentPage - 1) * this.pageSize + this.pageSize,
    );
  }

  getFilteredProductList(categoryName: string, filters: Map<string, string[]>) {
    this.spinnerService.show();
    let filtersString: string = "";
    let i = 1;
    for (let k of filters.keys()) {
      for(let v of filters.get(k)!) {
        filtersString += k + i + "=" + v + "&";
        i++;
      }
    }
    if (filtersString.endsWith("&")) {
      filtersString = filtersString.substring(0, filtersString.length - 1);
    }

    return this.httpClient.get<Product[]>( categoryName == null ? this.baseUrl : this.baseUrl + "/" + categoryName + "?" + filtersString).subscribe(
      data => {
        this.products = data;
        for(var p of this.products) {
          p.imagesSafe = new Array<SafeHtml>();
          for(var img of p.images) {
            switch (img.type){
              case 'png':
                p.imagesSafe.push(this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,'
                  + img.content));
                break;
              case 'jpg':
                p.imagesSafe.push(this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
                  + img.content));
                break;
            }
          }
        }
        this.refreshProducts();
        this.spinnerService.hide();
      }
    );
  }

  getTopProductList() {
    this.spinnerService.show();
    return this.httpClient.get<Product[]>(this.baseUrl + "/TopProducts").subscribe(
      data => {
        this.topProducts = data;
        for(var p of this.topProducts) {
          p.imagesSafe = new Array<SafeHtml>();
          for(var img of p.images) {
            switch (img.type){
              case 'png':
                p.imagesSafe.push(this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,'
                  + img.content));
                break;
              case 'jpg':
                p.imagesSafe.push(this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
                  + img.content));
                break;
            }
          }
        }
        this.spinnerService.hide();
      }
    );
  }

  getProduct(productId: string) {
    return this.httpClient.get<Product>(environment.apiUrl + "/product/" + productId);
  }

  getFavoriteProducts(userId: number) {
    return this.httpClient.get<Product[]>(this.baseUrl + "/favorite/" + userId)
  }

  getIfProductIsFavorite(userId: number, productId: number) {
    return this.httpClient.get(this.baseUrl + "/favorite/" + userId + "/" + productId);
  }

  addProductToFavorite(userId: number, productId: number) {
    return this.httpClient.post(this.baseUrl + "/addfavorite/" + userId + "/" + productId, null);
  }

  removeProductToFavorite(userId: number, productId: number) {
    return this.httpClient.post(this.baseUrl + "/removefavorite/" + userId + "/" + productId, null);
  }

  deleteProduct(userId: number) {
    return this.httpClient.post(this.baseUrl + "/deleteProduct/" + userId, null);
  }

  createNewProduct(prod: Product) {
    return this.httpClient.post(this.baseUrl, prod);
  }

  editProduct(prod: Product) {
    return this.httpClient.put(this.baseUrl, prod);
  }
}

export interface ImageResponse {
  content: string;
  type: string;
}

