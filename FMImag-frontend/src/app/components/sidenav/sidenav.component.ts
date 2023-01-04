import {Component, OnInit} from '@angular/core';
import {Category} from "../../dto/category";
import {SpinnerService} from "../../services/spinner/spinner.service";
import {CategoryService} from "../../services/category.service";

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit{

  categories: Category[] = [];

  constructor(private categoryService: CategoryService,
              private spinnerService: SpinnerService) {}
  status: boolean = false;
  clickEvent() {
    this.status = !this.status;
  }

  ngOnInit(): void {
    this.listCategories();
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
}
