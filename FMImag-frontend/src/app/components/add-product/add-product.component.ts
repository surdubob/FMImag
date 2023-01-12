import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {Product} from "../../dto/product";
import {CategoryService} from "../../services/category.service";
import {Category} from "../../dto/category";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit{
  public currentProduct: Product = {id: 0, name: "", categoryId: null, imagesSafe: [], images: [], description: "", price: 0, stock: 0, specifications: "", specificationsDict: new Map<string, string>(), oldPrice: 0};

  public categoryList: Category[] = []
  public categoryError = false;
  public selectedCategory: Category | null = null;

  constructor(public productService: ProductService,
              public categoryService: CategoryService) {
  }

  ngOnInit(): void {
    this.categoryService.getCategoryList().subscribe(categories => {
      this.categoryList = categories;
    });
  }


  createProduct() {
    if (this.currentProduct.categoryId == null) {
      this.categoryError = true;
    }
    this.productService.createNewProduct(this.currentProduct).subscribe(data => {
      console.log(data);
    });
  }

  // public imageSrc: string | SafeHtml = '';
  imageNumber: number = 0;

  handleInputChange(e: any) {
    let file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    let pattern = /image-*/;
    let reader = new FileReader();
    if(!file) {
      return;
    }
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }

    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e: any) {
    let reader = e.target;
    this.currentProduct.images.push({content: reader.result, type: 'other'});
  }

  uploadImage() {

    // this.authService.uploadLogo(this.imageSrc, (this.isSvg ? 'svg' : 'other'), this.clientCode).subscribe(r => {
    //   let c = confirm("The logo has been changed successfully.\nThe page will be reloaded.");
    //   document.location.reload();
    // }, e => {
    //   console.error(e);
    // });
  }


  addPicture() {
    this.imageNumber++;
  }

  arrayOf(n: number) {
    let a = [];
    for(let i = 0; i < n; i++) {
      a.push(i + 1);
    }
    return a;
  }
}
