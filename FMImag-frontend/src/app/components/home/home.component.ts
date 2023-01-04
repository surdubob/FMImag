import {Component, OnInit} from '@angular/core';
import {Product} from "../../dto/product";
import {ProductService} from "../../services/product.service";
import {SpinnerService} from "../../services/spinner/spinner.service";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService,
              private spinnerService: SpinnerService,
              private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.listProducts();
  }

  listProducts()
  {
    this.spinnerService.show();
    this.productService.getTopProductList().subscribe(
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
    )
  }
}
