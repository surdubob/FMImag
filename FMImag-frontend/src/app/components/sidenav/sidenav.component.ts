import {Component, OnInit} from '@angular/core';
import {Category} from "../../dto/category";
import {SpinnerService} from "../../services/spinner/spinner.service";
import {CategoryService} from "../../services/category.service";
import {StringProductFilter} from "../../dto/filters/string-product-filter";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {ProductService} from "../../services/product.service";

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  categories: Category[] = [];
  selectedCategory: Category | undefined = undefined;
  filters: StringProductFilter[] = [];
  checkedOptions: Map<string, string[]> = new Map<string, string[]>();

  constructor(private categoryService: CategoryService,
              private spinnerService: SpinnerService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private productService: ProductService) {
  }

  status: boolean = false;

  clickEvent() {
    this.status = !this.status;
  }

  ngOnInit(): void {
    this.spinnerService.show();
    this.router.events.subscribe(evt => {
        if (evt instanceof NavigationEnd) {
          this.categoryService.getCategoryList().subscribe(
            data => {
              this.categories = data;
              let path: string | null;

              try {
                path = evt.url.substring(evt.url.lastIndexOf('/') + 1);
                // console.log(evt.url);
                if (path != null && path != 'products' && evt.url.startsWith('/products')) {
                  this.selectedCategory = this.categories.find(c => c.name.toLowerCase() == path!.toString().toLowerCase());

                  this.getCategoryFilters();
                }
              } catch (error) {
                path = null;
                console.log(error);
              }

              this.spinnerService.hide();
            });
        }
      }
    )

  }

  getCategoryFilters() {
    this.categoryService.getCategoryFilters(this.selectedCategory!.name).subscribe(data => {
      this.filters = data;
    });
  }

  checkBoxClicked(opt: string, flt: string, evt: any) {
    if (evt.target.checked) {
      if (this.checkedOptions.has(flt)){
        this.checkedOptions.get(flt)!.push(opt)
      }
      else {
        this.checkedOptions.set(flt, [opt]);
      }
    }
    else {
      if (this.checkedOptions.has(flt)) {
        this.checkedOptions.get(flt)!.splice(this.checkedOptions.get(flt)!.indexOf(opt), 1)
      }
    }
    this.productService.getFilteredProductList(this.selectedCategory!.name!, this.checkedOptions);
  }

  clearFilters() {
    Array.from(document.getElementsByClassName("filtercheckbox")).forEach(el => {
      (el as HTMLInputElement).checked = false;
    });
    this.checkedOptions.clear();
    this.productService.searchTerm = "";
    this.productService.getFilteredProductList(this.selectedCategory!.name!, this.checkedOptions);
  }
}
