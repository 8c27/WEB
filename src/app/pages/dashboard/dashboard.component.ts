import { Component, OnInit , Input} from "@angular/core";
import { FeedService } from "src/app/services/feed.service";
import { SignalrService } from "src/app/services/signalr.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { FeedModalComponent } from "src/app/modal/feee-modal/feed-modal.component";
import { dashboardModalContent } from "./dashboard-modal/dashboard-modal.component";
@Component({
  selector: "app-dashboard",
  templateUrl: "dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {

  feedList: any;  // feed =>feed資料庫
  modalReference: NgbModalRef;
  constructor(public api: FeedService, public signalRSvc: SignalrService, private ngbModal: NgbModal) {
  }

  ngOnInit() {
    // 初始化
    this.signalRSvc.StartConnection();    // 連接singalR 
    this.signalRSvc.ReceiveListener()?.on('FeedChange', (data) => {
      // 當 FeedChange 事件被監聽到有動作後, 就更新資料
      this.feedList = data.filter( i => i.isDeleted == false)
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
   this.ngbModal.open(dashboardModalContent, {size: 'lg'});

  }
  
}
