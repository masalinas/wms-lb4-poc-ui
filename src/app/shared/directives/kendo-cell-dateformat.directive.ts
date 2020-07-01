import { Directive, OnInit } from '@angular/core';
import { ColumnComponent } from '@progress/kendo-angular-grid';

@Directive({
  selector: '[kendo-grid-column-date-format]'
})
export class KendoGridColumnDateFormatDirective implements OnInit {
  constructor(private element: ColumnComponent) {
  }

  ngOnInit() {
    this.element.format = "{0:dd/MM/yyyy}";
  }
}
