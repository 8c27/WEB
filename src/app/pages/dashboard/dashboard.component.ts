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
    this.api.getFeed().subscribe( e => this.feedList = e) //訂閱Feed資料
  }

  open(){
    const modal = this.ngbModal.open(dashboardModalContent, {size: 'lg'});
    modal.result.then(e => {
      if (e)
        this.api.addFeed(e).subscribe(); 
    })

  }
  
}
