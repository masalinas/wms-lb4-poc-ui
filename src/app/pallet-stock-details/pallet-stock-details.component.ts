import { Component, ViewChild, ViewContainerRef, Input, Output, EventEmitter, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GroupDescriptor, SortDescriptor, process, State } from '@progress/kendo-data-query';
import { GridComponent, GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { DialogService, DialogCloseResult } from '@progress/kendo-angular-dialog';

import { PalletStockFormComponent } from './pallet-stock-form/pallet-stock-form.component';

import { Pallet, Stock } from '../shared/services/backend/model/models';
import { PalletStockControllerService } from '../shared/services/backend/api/api';

@Component({
    selector: 'pallet-stock-details',
    styleUrls: ['pallet-stock-details.component.css'],
    templateUrl: 'pallet-stock-details.component.html'
  })
export class PalletStockDetailsComponent implements OnInit {
  @Input() public pallet: Pallet;

  // grid parameters
  public state: State = {
    group: Array<GroupDescriptor>(),
    sort: Array<SortDescriptor>(),
    skip: 0,
    take: 10
  };

  public loading: boolean = false;

  public stockData: GridDataResult;
  public stocks: Stock[];

  constructor(private dialogService: DialogService,
              private palletStockControllerService: PalletStockControllerService) {
  }

  private loadGrid(stocks: Stock[]): void {
    this.stockData = process(stocks, this.state);
  }

  private getStocks() {
    this.loading = true;

    let filter: any = {filter: JSON.stringify({include: [{relation: "product"}]})};

    this.palletStockControllerService.palletStockControllerFind(this.pallet.id, filter).pipe(map((datum) => datum.map((stock: any) => {
      if (stock.expeditionDate != undefined)
        stock.expeditionDate = new Date(stock.expeditionDate);

      return stock;
    }))).subscribe((stocks: any) => {
      this.stocks = stocks;

      this.loadGrid(stocks);
      this.loading = false;
    },
    err => {
      console.log(err);
      this.loading = false;
    });

    /*this.palletStockControllerService.palletStockControllerFind(this.pallet.id, filter).subscribe((stocks: any) => {
      this.loadGrid(stocks);

      this.loading = false;
    },
    err => {
      console.log(err);
      this.loading = false;
    });*/
  }

  public ngOnInit(): void {
    this.getStocks();
  }

  public getStocksHandler(event: any) {
    this.getStocks();
  }

  public stockStateChange(state: DataStateChangeEvent): void {
    this.state = state;

    this.loadGrid(this.stocks);
  }

  public onAddStockPalletClick(event: any) {
    const stock = {} as Stock;

    const dialogRef = this.dialogService.open({
      title: 'Add Stock',
      content: PalletStockFormComponent,
    });

    const palletStockEditForm = dialogRef.content.instance;
    palletStockEditForm.stock = stock;

    dialogRef.result.subscribe((stock: any) => {
      if (!(stock instanceof DialogCloseResult)) {
        this.loading = true;

        // TODO
        let stockLine: any = {};

        stockLine.productId = stock.productId;
        stockLine.quantity = stock.quantity;
        if (stock.lot)
          stockLine.lot = stock.lot;
        if (stock.expeditionDate)
          stockLine.expeditionDate = stock.expeditionDate;
        if (stock.serialNumber)
          stockLine.serialNumber = stock.serialNumber;

        this.palletStockControllerService.palletStockControllerAddStock(this.pallet.id, stockLine).subscribe((stock: Stock) => {
          this.loading = false;

          this.getStocks();
        },
        err => {
          console.log(err);
          this.loading = false;
        });
      }
    });
  }

  public onRemoveStockPalletClick(event: any) {
    const stock = {} as Stock;

    const dialogRef = this.dialogService.open({
      title: 'Remove Stock',
      content: PalletStockFormComponent,
    });

    const palletStockEditForm = dialogRef.content.instance;
    palletStockEditForm.stock = stock;

    dialogRef.result.subscribe((stock: any) => {
      if (!(stock instanceof DialogCloseResult)) {
        this.loading = true;

        // TODO
        let stockLine: any = {};

        stockLine.productId = stock.productId;
        stockLine.quantity = stock.quantity;
        if (stock.lot)
          stockLine.lot = stock.lot;
        if (stock.expeditionDate)
          stockLine.expeditionDate = stock.expeditionDate;
        if (stock.serialNumber)
          stockLine.serialNumber = stock.serialNumber;

        this.palletStockControllerService.palletStockControllerRemoveStock(this.pallet.id, stockLine).subscribe((stock: Stock) => {
          this.loading = false;

          this.getStocks();
        },
        err => {
          console.log(err);
          this.loading = false;
        });
      }
    });
  }
}
