import { Component, OnInit , Input} from "@angular/core";
import { FeedService } from "src/app/services/feed.service";
import { SignalrService } from "src/app/services/signalr.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { MatTableDataSource } from "@angular/material/table";
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from "@angular/material/snack-bar";
import * as ExcelJS from 'exceljs'
import { saveAs } from 'file-saver';

@Component({
  selector: "app-ship",
  templateUrl: "ship.component.html",
  styleUrls: ["./ship.component.scss"],
})



export class ShipComponent implements OnInit {

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
          { name: 'status', displayName: '訂單狀態', width:100, templateRef: '完成狀態'},
          { name: 'feedNumber', displayName: '訂單編號' },
          { name: 'clientName', displayName: '廠商名稱', width: 200 },
          { name: 'stockName', displayName: '昇茂規格', width: 200},  
          { name: 'quantity', displayName: '數量' }, 
          { name: 'project', displayName: '加工項目' },
          { name: 'class', displayName: '料別'},
          { name: 'creationTime', displayName: '創建日期', templateRef: 'date' , width: 120},
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
    constructor(
        public api: FeedService,
        public signalRSvc: SignalrService, 
        private ngbModal: NgbModal, 
        private toastr: ToastrService,
        private snackbar: MatSnackBar
    ) 
    {
    }

  ngOnInit() {
    // 初始化
    this.signalRSvc.StartConnection();    // 連接singalR 
    this.signalRSvc.ReceiveListener()?.on('FeedChange', (data) => {
      // 當 FeedChange 事件被監聽到有動作後, 就更新資料
      this.feedList = data.filter( g => g.status == true)
      this.dataSource= new MatTableDataSource<any>(this.feedList)

      // 避免同步刪除發生錯誤
      if(this.selected){
        this.selected = data.find(e => e.id == this.selected.id)
      }
    })
    this.onload()
  }

  onload() {
    // 載入
    let today = (new Date());
    console.log(today)
    this.api.getFeed().subscribe( (e:any) => {
      this.feedList = e.filter( g => g.status == true)
      this.dataSource= new MatTableDataSource<any>(this.feedList)
      
    }) //訂閱Feed資料
    this.api.getClient().subscribe( (e:any) =>this.clientList=e) //訂閱Client資料
    this.api.getStock().subscribe( (e:any) =>this.stockList=e) //訂閱Stock資料
  }

  onSelect($event: any) {
    this.selected = $event;
  }

  export(){
    if (this.selected){
      // 建立工作簿
      const wb = new ExcelJS.Workbook();
      // 建立工作表
      const ws = wb.addWorksheet('出貨單')
    }
  }

}
