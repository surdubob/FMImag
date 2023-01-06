import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {LocalStorageService} from "../../services/local-storage.service";
import {SpinnerService} from "../../services/spinner/spinner.service";
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {Product} from "../../dto/product";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit{

  product: Product = {id: 0, name: "", imagesSafe: [], images: [], details: "", price: 0, stock: 0};
  products: Product[] = []
  constructor(private productService: ProductService,
              private localStore: LocalStorageService,
              private spinnerService: SpinnerService,
              private activatedRoute: ActivatedRoute,
              private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.cartProducts();
  }

  cartProducts(){
    var cart_json = this.localStore.getData("cart");
    var cart;
    if (cart_json != null) {
      cart = JSON.parse(cart_json);
      console.log(cart);
      for (var productId of cart.productId) {
        this.productService.getProduct(productId).subscribe(
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
            this.products.push(this.product);
          }
        )
      }
    }
    console.log(this.products.length)
    return this.products;
  }

  deleteProduct(productId?: string) {

    if (productId != null) {
      var cart_json = this.localStore.getData("cart");
      var cart;
      if (cart_json != null) {
        cart = JSON.parse(cart_json);
      }
      var new_cart: { productId: any[] };
      new_cart = {"productId": []};
      for(var product of cart.productId) {
        if (product != productId) {
          new_cart.productId.push(product);
        }
      }
      this.localStore.saveData("cart", JSON.stringify(new_cart));
    } else {
      this.localStore.removeData("cart");
    }
  }
}
