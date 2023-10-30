import { Component, OnInit , Input} from "@angular/core";
import { FeedService } from "src/app/services/feed.service";
import { SignalrService } from "src/app/services/signalr.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { dashboardModalContent } from "./dashboard-modal/dashboard-modal.component";
import { MatTableDataSource } from "@angular/material/table";




@Component({
  selector: "app-dashboard",
  templateUrl: "dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})


export class DashboardComponent implements OnInit {

  feedList: any;  // feed =>feed資料庫
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
      { name: 'contract_number', displayName: '合約編號' },
      { name: 'pi_number', displayName: '報價單編號' },
      { name: 'cost', displayName: '客戶編號' },
      { name: 'manufacturer', displayName: '客戶名稱', width: 200 },
      { name: 'quantity', displayName: '狀態' },
      { name: 'start_date', displayName: '開始日期', templateRef: 'date'},
      { name: 'end_date', displayName: '結束日期', templateRef: 'date'},
      { name: 'description', displayName: '敘述' },
      { name: 'creationTime', displayName: '建立時間', templateRef: 'date_long' },
      { name: 'created_by', displayName: '建立者' },
      { name: 'updated_time', displayName: '更新時間', templateRef: 'date_long' },
      { name: 'updated_by', displayName: '更新者' },
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

  constructor(public api: FeedService, public signalRSvc: SignalrService, private ngbModal: NgbModal) {
  }

  ngOnInit() {
    // 初始化
    this.signalRSvc.StartConnection();    // 連接singalR 
    this.signalRSvc.ReceiveListener()?.on('FeedChange', (data) => {
      // 當 FeedChange 事件被監聽到有動作後, 就更新資料
      this.feedList = data
    })
    this.onload()
  }

  onload() {
    // 載入
    let today = (new Date());
    console.log(today)
    this.api.getFeed().subscribe( (e:any) => this.dataSource= new MatTableDataSource<any>(e)) //訂閱Feed資料
  }

  onSelect($event: any) {
    this.selected = $event;
  }
  open(){
    const modal = this.ngbModal.open(dashboardModalContent, {size: 'lg'});

    modal.result.then(e => {
      if (e)
        this.api.addFeed(e).subscribe(); 
    })

  }
  
}
