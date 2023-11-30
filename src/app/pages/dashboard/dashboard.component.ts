import { Component, OnInit , Input} from "@angular/core";
import { FeedService } from "src/app/services/feed.service";
import { SignalrService } from "src/app/services/signalr.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { dashboardModalContent } from "./dashboard-modal/dashboard-modal.component";
import { MatTableDataSource } from "@angular/material/table";
import { ToastrService } from 'ngx-toastr';
import { flatten } from "@angular/compiler";
import { createConstructSignature } from "typescript";
import { Router } from "@angular/router";




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
      { name: 'creationTime', displayName: '創建日期', templateRef: 'date' , width: 120},
      { name: 'feedNumber', displayName: '訂單編號' },
      { name: 'clientName', displayName: '廠商名稱', width: 200 },
      { name: 'itemNumber', displayName: '物品編號'},
      { name: 'itemName', displayName: '物品名稱' },
      { name: 'stockName', displayName: '昇茂規格', width: 200},   
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

  clientList:any;
  stockList: any;

  constructor(
    public api: FeedService, 
    public signalRSvc: SignalrService, 
    private ngbModal: NgbModal,
    private toastr: ToastrService,
    private router: Router
    ){}
 
  ngOnInit() {
    // 初始化
    this.signalRSvc.StartConnection();    // 連接singalR 
    this.signalRSvc.ReceiveListener()?.on('FeedChange', (data) => {
      // 當 FeedChange 事件被監聽到有動作後, 就更新資料
      this.dataSource= new MatTableDataSource<any>(data)

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
    this.api.getFeed().subscribe( (e:any) => this.dataSource= new MatTableDataSource<any>(e)) //訂閱Feed資料
    this.api.getClient().subscribe( (e:any) =>this.clientList=e) //訂閱Client資料
    this.api.getStock().subscribe( (e:any) =>this.stockList=e) //訂閱Stock資料
  }

  onSelect($event: any) {

    this.selected = $event;
  }
  open(){
    const modal = this.ngbModal.open(dashboardModalContent, {size: 'lg',});
    modal.componentInstance.title = '新增訂單'
    modal.componentInstance.clientList=this.clientList
    modal.componentInstance.stockList=this.stockList
    modal.componentInstance.showDiv = false  
    modal.result.then(e => {
      if (e){
        // 關聯規格表和客戶資料
        console.log(e)
        this.api.addFeed(e).subscribe(() =>{
          
        }); 
      }
    }).catch((error) => {
      console.log('Error in modal result:', error)
    })

  }
  delete(){
    this.api.deleteFeed(this.selected.id).subscribe(
      (respon) => {
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
      (error) => {
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
    if(this.selected){
      const modal = this.ngbModal.open(dashboardModalContent , {size:'lg'});
      modal.componentInstance.title = '編輯訂單'
      modal.componentInstance.formData = this.selected;
      modal.componentInstance.clientList = this.clientList;
      modal.componentInstance.stockList = this.stockList;
      modal.result.then(e => {
        if(e){
          this.api.editFeed(e.id, e).subscribe(
            (respon) =>{
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
          );
        }
      }).catch( (error) =>{
        console.log('Error in modal result:', error)
      })
    }
  }
  xlxs(){
    this.selected.address = this.clientList.find(e=>e.id == this.selected.clientId).address
    this.selected.number = this.clientList.find(e =>e.id == this.selected.clientId).number
    var printdata = JSON.stringify(this.selected)
    console.log(this.selected.address)
    const targetUrl = `#/print?json=${printdata}`;

    // 使用 window.open 打开新窗口或标签页
    window.open(targetUrl, '_blank');
  }
}
