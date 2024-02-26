import { Component, OnInit , Input} from "@angular/core";
import { FeedService } from "src/app/services/feed.service";
import { SignalrService } from "src/app/services/signalr.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { StockModalConponent } from "./stock-modal/stock-modal.component";
import { MatTableDataSource } from "@angular/material/table";
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from "@angular/material/snack-bar";

interface  IStock{
  id: number;
  updateTime: Date;
  stockName: string;
  finishAmount: number;
  weight: number;
  isDeleted: boolean;
  feed: any[];
  feedQuantity: number;
  lackPcs: number;
  lackWeight: number;
}
@Component({
  selector: "app-stock",
  templateUrl: "stock.component.html",
  styleUrls: ["./stock.component.scss"],
})



export class StockComponent implements OnInit {
  company: number; 
  stockList: any;  // feed =>stockList資料庫
  modalReference: NgbModalRef;
  dataSource!: MatTableDataSource<any>;
  data: any;
  copydata: any;
  search: string;
  clientList:any;
  table_config: any = {
    checkable: true,
    serverSide: true,
    sort: {
      active: true,
      direction: 'desc',
      diableClear: true
    },
    columns: [
      { name: 'clientName', displayName: '廠商名稱',  width: 200 },
      { name: 'stockName', displayName: '昇貿規格', width:200 },
      { name: 'weight', displayName: '單重'},
      { name: 'finishAmount', displayName: '庫存數量' },
      { name: 'feedQuantity', displayName: '訂單數量',},   
      { name: 'lackPcs', displayName: '剩餘支數'},
      { name: 'lackWeight', displayName: '剩餘重量', templateRef:'data_decimal'},
      { name: 'updateTime', displayName: '更新時間', templateRef: 'date_long'  },
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
    this.signalRSvc.ReceiveListener()?.on('StockChange', (e) => {
      e.forEach(s=>{
        var allfeed = s.feed.reduce((total, feed) => total + feed.quantity, 0);
        var lackPcs = s.finishAmount-allfeed;
        var lackWeight = s.weight * lackPcs
        s.feedQuantity=allfeed
        s.lackPcs=lackPcs
        s.lackWeight=lackWeight
      })

      this.stockList=e
      this.dataSource = new MatTableDataSource<any>(e)
      this.copydata = [...this.dataSource.data]
      // 避免同步刪除發生錯誤
      if(this.selected){
        this.selected = e.find(e => e.id == this.selected.id)
      }
    })
    this.onload()
    
  }
  onload() {
    // 載入
    let today = (new Date());
    console.log(today)
    this.api.getStock().subscribe( (e:IStock[]) => {
      e.forEach(s=>{
        var allfeed = s.feed.reduce((total, feed) => total + feed.quantity, 0);
        var lackPcs = s.finishAmount-allfeed;
        var lackWeight = s.weight * lackPcs
        s.feedQuantity=allfeed
        s.lackPcs=lackPcs
        s.lackWeight=lackWeight
      })
      this.stockList=e
      this.dataSource= new MatTableDataSource<any>(e)
      this.copydata = [...this.dataSource.data]
    }) //訂閱Feed資料
    this.api.getClient().subscribe( (e:any) =>this.clientList=e)
  }
  companySelect(){
    let newData = this.copydata.filter( e => 
      e.clientId == this.company 
    )
    // 更新數據
    this.dataSource.data = newData
    console.log(newData)
  }

  clearSelect(){
    // 清空 搜尋條件
    if (this.company !== undefined ) {
      this.company = undefined
      this.onload()
    }
  }
  
  onSelect($event: any) {
    this.selected = $event;
  }
  open(){
    const modal = this.ngbModal.open(StockModalConponent, {size: 'sm'});
    modal.componentInstance.title = '新增規格'
    modal.componentInstance.clientList=this.clientList
    modal.result.then(e => {
      if (e) this.api.addStock(e).subscribe(e=>{
        this.onload()
      })
    }).catch( (error) => {
      console.log('Error in modal result:', error)
    })
  }
  delete(){
    const ref = this.snackbar.open('你確定要刪除嗎(◍•ᴗ•◍)ゝ', '確定', {duration: 5000, panelClass:['alert-danger', 'alert'],})
    ref.onAction().subscribe(() => {
      this.api.deleteStock(this.selected.id).subscribe(
        (respon) =>{
          this.onload()
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
    })
  }
  edit(){
    if (this.selected){
      const modal = this.ngbModal.open(StockModalConponent, {size: 'sm'})
      modal.componentInstance.title = '編輯庫存'
      modal.componentInstance.formData = this.selected
      modal.componentInstance.clientList=this.clientList
      modal.result.then( e => {
        if (e) this.api.editStock(e.id , e).subscribe(
          (respon) => {
            this.onload()
            this.toastr.success(
              '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">' +
              '編輯成功'
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
          (error) => {
            this.toastr.error(
              '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">' +
              '編輯失敗'
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
      })
      .catch((error) => {
        console.log('Error in modal result', error)
      })
    }
  }
  add(){
    const modal = this.ngbModal.open(StockModalConponent, {size: 'sm'});
    modal.componentInstance.title = '庫存調整'
    modal.componentInstance.hideonbush = this.hideonbush
    console.log(this.stockList)
    modal.componentInstance.stockList=this.stockList
    modal.result.then(e => {
      
      if (e){
        this.api.editAmountStock(e, e.finishAmount).subscribe(e=>this.onload())
      } 
    }).catch((error) => {
      console.log('Error in modal result:', error)
    })
  }


}
