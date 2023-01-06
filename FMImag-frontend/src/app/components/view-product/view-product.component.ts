import {Component, OnInit} from '@angular/core';
import {Product} from "../../dto/product";
import {ImageResponse, ProductService} from "../../services/product.service";
import {SpinnerService} from "../../services/spinner/spinner.service";
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {LocalStorageService} from "../../services/local-storage.service";
import {ReviewService} from "../../services/review.service";
import  {Review} from "../../dto/review";
import {NgbPaginationModule, NgbTypeaheadModule} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css'],
  styles: [
    `
			i {
				position: relative;
				display: inline-block;
				font-size: 2.5rem;
				padding-right: 0.1rem;
				color: #d3d3d3;
			}

			.filled {
				color: goldenrod;
				overflow: hidden;
				position: absolute;
				top: 0;
				left: 0;
			}
		`,
  ],
})
export class ViewProductComponent implements OnInit{

  product: Product = {id: 0, name: "", imagesSafe: [], images: [], details: "", price: 0, stock: 0};

  localsStorage:  Array<string> = [];

  review: Review = {userId: 0, userName:"", productId: 0, body: "", rating: 0, title: "", created: new Date()}
  reviews: Review[] = [];
  reviewsShown: Review[] = [];
  page = 1;
  pageSize = 4;
  collectionSize = 0;
  currentRating = 0;

  constructor(private localStore: LocalStorageService,
              private productService: ProductService,
              private reviewService: ReviewService,
              private spinnerService: SpinnerService,
              private activatedRoute: ActivatedRoute,
              private sanitizer: DomSanitizer) {
  }

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
    this.reviewService.getAllReviewsForCurrentProduct(1).subscribe(data => {
      this.reviews = data;
      console.log(data);
      this.collectionSize = data.length;
      this.refreshReviews();
      let s = 0;
      for (let r of this.reviews) {
        s = s + r.rating;
      }
      this.currentRating = s/this.reviews.length;
    })

  }

  onSubmit(): void {
    this.review.productId = this.product.id;
    this.review.userId = 1;
    this.reviewService.addReview(this.review).subscribe(u => {
      console.log(u);
      window.location.reload();});
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
  refreshReviews() {
    this.reviewsShown = this.reviews.map((review, i) => ({ id: i + 1, ...review })).slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize,
    );
  }
}
