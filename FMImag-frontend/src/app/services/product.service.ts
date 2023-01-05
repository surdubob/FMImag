import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Product} from "../dto/product";
import {environment} from "../../environment";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {SpinnerService} from "./spinner/spinner.service";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  products: Product[] = [];
  topProducts: Product[] = [];

  private baseUrl = environment.apiUrl + "/products"

  constructor(private httpClient: HttpClient,
              private spinnerService: SpinnerService,
              private sanitizer: DomSanitizer) { }

  getProductList() {
    this.spinnerService.show();
    return this.httpClient.get<Product[]>(this.baseUrl).subscribe(
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

}

export interface ImageResponse {
  content: string;
  type: string;
}

