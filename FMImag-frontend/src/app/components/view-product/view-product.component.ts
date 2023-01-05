import { Component } from '@angular/core';
import {Product} from "../../dto/product";
import {ImageResponse, ProductService} from "../../services/product.service";
import {SpinnerService} from "../../services/spinner/spinner.service";
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {LocalStorageService} from "../../services/local-storage.service";

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent {

  product: Product = {id: 0, name: "", imagesSafe: [], images: [], details: "", price: 0, stock: 0};

  localsStorage:  Array<string> = [];

  constructor(private productService: ProductService,
              private localStore: LocalStorageService,
              private spinnerService: SpinnerService,
              private activatedRoute: ActivatedRoute,
              private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.productInfo();
    console.log(this.localsStorage.length);
    let productId = this.activatedRoute.snapshot.url[1].path;
    let size = this.localStore.getData('size');
    if (size != null) {
      if (Number(size) < 5) {
        this.localStore.saveData(size, productId);
        size = (Number(size) + 1).toString();
        this.localStore.saveData('size', size);
      } else {
        for (var j = 1; j < Number(size); j++) {
          var local = this.localStore.getData((j).toString());
          if (local != null) {
            this.localsStorage.push(local);
          }
        }
        this.localStore.saveData('size', size);

        for (var i = 0; i < this.localsStorage.length; i++ ){
          this.localStore.saveData((i).toString(), this.localsStorage[i])
        }
        this.localStore.saveData('4', productId);
      }
    } else {
      this.localStore.saveData('size', "1");
      this.localStore.saveData('0', productId);
    }
  }

  productInfo() {
    this.spinnerService.show();
    this.productService.getProduct(this.activatedRoute.snapshot.url[1].path).subscribe(
      data => {
        this.product = data;
          this.product.imagesSafe = new Array<SafeHtml>();
          for (var img of this.product.images) {
            switch (img.type) {
              case 'png':
                this.product.imagesSafe.push(this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,'
                  + img.content));
                break;
              case 'jpg':
                this.product.imagesSafe.push(this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
                  + img.content));
                break;
            }
          }
        this.spinnerService.hide();
      }
    );
  }

  addToCart(productId: string) {
    var cart = this.localStore.getData("cart");
    var new_cart;
    if (cart != null) {
      new_cart = JSON.parse(cart);
      new_cart.productId.push(productId);
    } else {
      new_cart = {"productId":[productId]};
    }
    this.localStore.saveData("cart", JSON.stringify(new_cart));
  }
}
