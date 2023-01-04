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

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.listProducts();
  }

  listProducts()
  {
    this.productService.getTopProductList();
  }

  topproducts() {
    return this.productService.topProducts;
  }
}
