import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {LocalStorageService} from "../../services/local-storage.service";
import {SpinnerService} from "../../services/spinner/spinner.service";
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {Product} from "../../dto/product";
import {CartService} from "../../services/cart.service";
import {ModalComponent} from "../modal/modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit{

  product: Product = {id: 0, name: "", categoryId: null, imagesSafe: [], images: [], description: "", price: 0, stock: 0, specifications: "", specificationsDict: new Map<string, string>(), oldPrice: 0};
  products: Product[] = []

  productCount: Map<any, any> = new Map()
  constructor(private productService: ProductService,
              private cartService: CartService,
              private modalService: NgbModal,
              private localStore: LocalStorageService,
              private spinnerService: SpinnerService,
              private activatedRoute: ActivatedRoute,
              private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.cartProducts();
  }

  openModal() {
    const modalRef = this.modalService.open(ModalComponent);
  }

  cartProducts(){
    var cart_json = this.localStore.getData("cart");
    var cart;
    if (cart_json != null) {
      cart = JSON.parse(cart_json);
      console.log(cart);
      for (var productId of cart.productId) {

        if (this.productCount.has(productId)) {
          this.productCount.set(productId, Number(this.productCount.get(productId)) + 1);
        } else {
          this.productCount.set(productId, 1);
        }

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
            if (this.products.length > 0) {
              var isProductAlreadyInCart = false;
              for (var productsItem of this.products) {
                if (productsItem.id == this.product.id) {
                  isProductAlreadyInCart = true;
                }
              }
              if (!isProductAlreadyInCart) {
                this.products.push(this.product);
              }
            } else {
              this.products.push(this.product);
            }
          }
        )
      }
    }
    console.log(this.products)
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

  finishCard() {
    var cart_json = this.localStore.getData("cart");
    var cart;
    if (cart_json != null) {
      cart = JSON.parse(cart_json);
    }
    for(var product of cart.productId) {
      this.cartService.updateCart(product).subscribe();
    }
    this.localStore.removeData("cart");
  }
}
