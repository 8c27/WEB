import { Component, OnInit , Input} from "@angular/core";
import { FeedService } from "src/app/services/feed.service";
import { SignalrService } from "src/app/services/signalr.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { StockModalConponent } from "./stock-modal/stock-modal.component";
import { MatTableDataSource } from "@angular/material/table";
import { ToastrService } from 'ngx-toastr';




@Component({
  selector: "app-stock",
  templateUrl: "stock.component.html",
  styleUrls: ["./stock.component.scss"],
})


export class StockComponent implements OnInit {

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
      { name: 'listId', displayName: '更新時間' },
      { name: 'stockName', displayName: '昇貿規格' },
      { name: 'weight', displayName: '單重'},
      { name: 'finishAmount', displayName: '完成數量' },
      { name: 'quantity', displayName: '訂單數量',},   
      { name: 'lackPcs', displayName: '缺料支數'},
      { name: 'lackWeight', displayName: '缺料重量' },

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

  constructor(public api: FeedService, public signalRSvc: SignalrService, private ngbModal: NgbModal, private toastr: ToastrService,) {
  }

  ngOnInit() {
    // 初始化
    this.signalRSvc.StartConnection();    // 連接singalR 
    this.signalRSvc.ReceiveListener()?.on('StockChange', (data) => {
      // 當 FeedChange 事件被監聽到有動作後, 就更新資料
      this.dataSource = new MatTableDataSource<any>(data)
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
    this.api.getStock().subscribe( (e:any) => this.dataSource= new MatTableDataSource<any>(e)) //訂閱Feed資料
  }

  onSelect($event: any) {
    this.selected = $event;
  }
  open(){
    const modal = this.ngbModal.open(StockModalConponent, {size: 'sm'});
    modal.componentInstance.title = '新增規格'
    modal.result.then(e => {
      if (e)
        this.api.addStock(e).subscribe(); 
    }).catch( (error) => {
      console.log('Error in modal result:', error)
    })
  }
  delete(){
    this.api.deleteStock(this.selected.id).subscribe(
      (respon) =>{
        //刪除成功
        this.toastr.success(
          '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">' +
          '刪除成功'
          + '</span>',
          "",
          {
            timeOut: 3000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-success alert-with-icon",
            positionClass: "toast-bottom-center"
          }
        );
      },
      (errro) => {
        this.toastr.error(
          '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">' +
          '刪除失敗'
          + '</span>',
          "",
          {
            timeOut: 3000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-error alert-with-icon",
            positionClass: "toast-bottom-center"
          }
      );
      }
    )
  }
  edit(){
    if (this.selected){
      const modal = this.ngbModal.open(StockModalConponent, {size: 'sm'});
      modal.componentInstance.title = '編輯你媽啦'
    }
  }
}
