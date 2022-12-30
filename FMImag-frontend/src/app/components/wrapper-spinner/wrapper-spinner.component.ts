import { Component, Input, OnInit } from '@angular/core';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';

@Component({
  selector: 'app-wrapper-spinner',
  templateUrl: './wrapper-spinner.component.html',
  styleUrls: ['./wrapper-spinner.component.sass']
})
export class WrapperSpinnerComponent implements OnInit {
  
  constructor(public spinnerService: SpinnerService) {

   }

  ngOnInit(): void {
  }

}
