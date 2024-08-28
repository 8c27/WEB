import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FeedService } from 'src/app/services/feed.service';
import { SignalrService } from 'src/app/services/signalr.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {


  days : any;
  nowTime: any;
  feedList: any;  // feed =>feed資料庫
  clientList:any;
  stockList: any;
  modalReference: NgbModalRef;
  dataSource!: MatTableDataSource<any>;
  data: any;
  search: string;
  table_config: any = {
      checkable: true,
      serverSide: true,
      sort: {
      active: true,
      direction: 'desc',
      diableClear: true
      },
      columns: [
        { name: 'feedNumber', displayName: '訂單編號',width: 150 },
        { name: 'clientName', displayName: '廠商名稱', width: 200 },
        { name: 'stockName', displayName: '昇貿規格', width: 250},  
        { name: 'quantity', displayName: '數量'}, 
        { name: 'project', displayName: '加工項目',width: 150 , templateRef: 'stock'},
        { name: 'class', displayName: '料別'},
        { name: 'creationTime', displayName: '訂單日期', templateRef: 'date' , width: 120},
      ]
  };
  subs: any;
  ticket: any;
  maxTableHeight = '100%';
  minTableHeight = 'unset';
  selected: any;
  loaded = false;
  status: Object;
  customers: Object;
  organizations: Object;
  proformas: Object;
  hideonbush : boolean = false;
  shipList: any;
  copydata: any;
  company: any;
  dateTo: Date | null;
  dateFm: Date| null;
  newData: any;
  newData2: any;
  finalData: any;
  constructor(
      public api: FeedService,
      public signalRSvc: SignalrService, 
      private ngbModal: NgbModal, 
      private toastr: ToastrService,
      private snackbar: MatSnackBar,
  ) 
  {
  }

ngOnInit() {
  // 初始化
  this.signalRSvc.StartConnection();    // 連接singalR 
  this.signalRSvc.ReceiveListener()?.on('FeedChange', (data) => {
    // 當 FeedChange 事件被監聽到有動作後, 就更新資料
    this.feedList = data.filter( g => g.status == true)
    this.feedList.forEach( e => {
      if (e.stock && e.stock.length > 0){
        e.cost = e.stock[0].cost
      }else {
        e.cost = 0
      }
    })
    this.dataSource= new MatTableDataSource<any>(this.feedList)
    this.copydata = [...this.dataSource.data]
    // 避免同步刪除發生錯誤
    if(this.selected){
      this.selected = data.find(e => e.id == this.selected.id)
    }
  })
  this.onload()
}

onload() {
  // 載入
  this.api.getFeed().subscribe( (e:any) => {
    this.feedList = e.filter( g => g.status == true)
    this.feedList.forEach( e => {
      if (e.stock && e.stock.length > 0){
        e.cost = e.stock[0].cost
      }else {
        e.cost = 0
      }
    })
    this.dataSource= new MatTableDataSource<any>(this.feedList)
    this.copydata = [...this.dataSource.data]
  }) //訂閱Feed資料
  this.api.getClient().subscribe( (e:any) =>this.clientList=e) //訂閱Client資料
  this.api.getStock().subscribe( (e:any) =>this.stockList=e) //訂閱Stock資料
}

onSelect($event: any) {
  this.selected = $event;
}

onDateChange() {
  if (this.dateFm && this.dateTo) {
    this.dateTo.setHours(23, 59, 59, 999);
    this.newData = this.copydata.filter( e => {
      let itemDate = new Date(e.creationTime)
      return itemDate >=　this.dateFm && itemDate <= this.dateTo
    })
    // 更新數據
    this.dataSource.data = this.newData
    this.newData2 = [...this.newData]
  }
}

companySelect(){
  if (this.company){
    this.onDateChange()
    this.finalData = this.newData2.filter( e => {return e.clientId == this.company} )
    // 更新數據
    this.dataSource.data = this.finalData
  }
}

clearSelect(){
    // 清空 搜尋條件
    if (this.dateFm !== undefined || this.dateFm !== undefined || this.company !== undefined) {
      this.dateFm = undefined
      this.dateTo = undefined
      this.company = undefined
      this.onload()
    }
}
}
