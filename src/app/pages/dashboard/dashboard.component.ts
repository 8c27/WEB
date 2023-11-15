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
      { name: 'creationTime', displayName: '創建時間', templateRef: 'date_long' },
      { name: 'listId', displayName: '訂單編號' },
      { name: 'manufacturer', displayName: '廠商名稱' },
      { name: 'itemNumber', displayName: '物品編號'},
      { name: 'itemName', displayName: '物品名稱' },
      { name: 'stockId', displayName: '昇茂規格', width: 200},   
      { name: 'class', displayName: '料別'},
      { name: 'machine', displayName: '機台編號' },
      { name: 'material', displayName: '材質'},
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
      this.dataSource= new MatTableDataSource<any>(data)
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
