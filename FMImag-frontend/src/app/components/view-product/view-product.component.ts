import {Component, OnInit} from '@angular/core';
import {Product} from "../../dto/product";
import {ImageResponse, ProductService} from "../../services/product.service";
import {SpinnerService} from "../../services/spinner/spinner.service";
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {ReviewService} from "../../services/review.service";
import  {Review} from "../../dto/review";
import { NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit{

  product: Product = {id: 0, name: "", imagesSafe: [], images: [], details: "", price: 0};
  review: Review = {userId: 0, productId: 0, body: "", rating: 0, title: "", created: new Date()}
  reviews: Review[] = [];
  reviewsShown: Review[] = [];
  page = 1;
  pageSize = 4;
  collectionSize = 0;

  constructor(private productService: ProductService,
              private reviewService: ReviewService,
              private spinnerService: SpinnerService,
              private activatedRoute: ActivatedRoute,
              private sanitizer: DomSanitizer) {
    this.refreshCountries();
  }

  ngOnInit(): void {
    this.productInfo();
    this.reviewService.getAllReviewsForCurrentProduct(1).subscribe(data => {
      this.reviews = data;
      this.collectionSize = data.length;
      this.refreshCountries();
    })
  }

  onSubmit(): void {
    this.review.productId = this.product.id;
    this.review.userId = 1;
    this.reviewService.addReview(this.review).subscribe(u => {console.log(u);});
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

  refreshCountries() {
    this.reviewsShown = this.reviews.map((country, i) => ({ id: i + 1, ...country })).slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize,
    );
  }

}
