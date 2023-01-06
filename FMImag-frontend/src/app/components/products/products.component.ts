import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {ActivatedRoute} from "@angular/router";
import {SpinnerService} from "../../services/spinner/spinner.service";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit{

  constructor(private productService: ProductService,
              private activatedRoute: ActivatedRoute,
              private spinnerService: SpinnerService) { }

  ngOnInit(): void {
    this.listProducts();
  }

  listProducts()
  {
    let path;
    try {
      path = this.activatedRoute.snapshot.url[1].path;
    } catch (error) {
      path = null;
    }

    // console.log(path)
    if (path == null) {
      this.productService.getProductList();
    } else
      this.productService.getProductList(path);
    this.spinnerService.hide();
  }



  products() {
    return this.productService.products;
  }
}
