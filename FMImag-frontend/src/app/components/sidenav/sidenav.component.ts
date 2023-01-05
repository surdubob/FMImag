import {Component, OnInit} from '@angular/core';
import {Category} from "../../dto/category";
import {SpinnerService} from "../../services/spinner/spinner.service";
import {CategoryService} from "../../services/category.service";
import {StringProductFilter} from "../../dto/filters/string-product-filter";

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit{

  categories: Category[] = [];
  selectedCategory: Category | undefined = undefined;
  filters: StringProductFilter[] = [];

  constructor(private categoryService: CategoryService,
              private spinnerService: SpinnerService) {}
  status: boolean = false;
  clickEvent() {
    this.status = !this.status;
  }

  ngOnInit(): void {
    this.listCategories();
    // this.getCategoryFilters();
  }

  categorySelected(cat: Category) {
    this.selectedCategory = cat;
    this.getCategoryFilters();
  }

  listCategories() {
    this.spinnerService.show();
    this.categoryService.getCategoryList().subscribe(
      data => {
        this.categories = data;
      }
    )
    this.spinnerService.hide();
  }

  getCategoryFilters() {
    this.categoryService.getCategoryFilters(this.selectedCategory!.name).subscribe(data => {
      this.filters = data;
    });
  }
}
