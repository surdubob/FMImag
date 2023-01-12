import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {Product} from "../../dto/product";
import {CategoryService} from "../../services/category.service";
import {Category} from "../../dto/category";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {ActivatedRoute, Router} from "@angular/router";

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
  public editMode: boolean = false;

  constructor(public productService: ProductService,
              public categoryService: CategoryService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    this.categoryService.getCategoryList().subscribe(categories => {
      this.categoryList = categories;
      let path = this.activatedRoute.snapshot.url[0].path;
      if (path == 'edit-product') {
        this.editMode = true;
        let productId = this.activatedRoute.snapshot.url[1].path;
        this.productService.getProduct(productId).subscribe( p => {
          this.currentProduct = p;
          this.selectedCategory = this.categoryList.find(c => c.id == p.categoryId) ?? null;
        });
      }
    });


  }


  createProduct() {
    if (this.currentProduct.categoryId == null) {
      this.categoryError = true;
    }
    this.productService.createNewProduct(this.currentProduct).subscribe(data => {
      console.log(data);
      this.router.navigateByUrl('/products');
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

  editProduct() {
    if (this.currentProduct.categoryId == null) {
      this.categoryError = true;
    }
    this.productService.editProduct(this.currentProduct).subscribe(data => {
      this.router.navigateByUrl('/products');
    });
  }
}
