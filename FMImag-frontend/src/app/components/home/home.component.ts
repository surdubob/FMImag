import {Component, OnInit} from '@angular/core';
import {Product} from "../../dto/product";
import {ProductService} from "../../services/product.service";
import {SpinnerService} from "../../services/spinner/spinner.service";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {LocalStorageService} from "../../services/local-storage.service";
import {AuthenticationService} from "../../services/login/authentication.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  localsStorage:  Array<string> = [];

  favProducts: Product[] = [];

  constructor(private productService: ProductService,
              private localStore: LocalStorageService,
              public authenticate: AuthenticationService,
              private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.listProducts();
    this.favoriteProducts();
    let localStorageSize = this.localStore.getData('size');
    if(localStorageSize != null) {
      for (let i = 0; i < Number(localStorageSize); i++) {
        var localData = this.localStore.getData(i.toString());
        if (localData != null) {
          this.localsStorage.push(localData)
        }
      }
    }
    console.log(this.localsStorage);
    this.lastVisitedProducts();
  }

  listProducts()
  {
    this.productService.getTopProductList();
    this.productService.getProductList();
  }

  topproducts() {
    return this.productService.topProducts;
  }

  lastVisitedProducts() {
    console.log("test");
    var productsId = [];
    for (var i = 0; i < 4; i++) {
      var localData = this.localStore.getData(i.toString());
      if (localData != null) {
        productsId.push(localData)
      }
    }
    return productsId;

  }

  productsList() {
    return this.productService.products;
  }

  favoriteProducts() {
    this.productService.getFavoriteProducts(Number(this.authenticate.userValue?.id)).subscribe(
      data => {
        this.favProducts = data;
        for(var p of this.favProducts) {
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
      }
    );
  }
}
