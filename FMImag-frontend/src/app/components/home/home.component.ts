import {Component, OnInit} from '@angular/core';
import {Product} from "../../dto/product";
import {ProductService} from "../../services/product.service";
import {SpinnerService} from "../../services/spinner/spinner.service";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {LocalStorageService} from "../../services/local-storage.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  localsStorage:  Array<string> = [];

  constructor(private productService: ProductService,
              private localStore: LocalStorageService) { }

  ngOnInit(): void {
    this.listProducts();
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

  products() {
    return this.productService.products;
  }
}
