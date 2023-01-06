import { Component } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  closeResult = '';

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
