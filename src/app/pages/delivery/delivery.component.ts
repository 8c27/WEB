import { Component, OnInit , Input} from "@angular/core";
import { FeedService } from "src/app/services/feed.service";
import { SignalrService } from "src/app/services/signalr.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { MatTableDataSource } from "@angular/material/table";
import { ToastrService } from 'ngx-toastr';
import { flatten } from "@angular/compiler";
import { createConstructSignature } from "typescript";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import * as ExcelJS from 'exceljs'
import { saveAs } from 'file-saver';
import { buffer } from "rxjs";
import { DeliveryModalComponent } from "./delivery-modal/delivery-modal.component";
@Component({
  selector: "app-delivery",
  templateUrl: "delivery.component.html",
  styleUrls: ["./delivery.component.scss"],
})


export class DeliveryComponent implements OnInit {

  days : any;
  nowTime: any;
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
      { name: 'name', displayName: '指送地點',width: 150 },
    ]
  };
  subs: any;
  maxTableHeight = '100%';
  minTableHeight = 'unset';
  selected: any;
  selectedItem: any[] = []
  loaded = false;
  status: Object;


  constructor(
    public api: FeedService, 
    public signalRSvc: SignalrService, 
    private ngbModal: NgbModal,
    private toastr: ToastrService,
    private router: Router,
    private snackbar: MatSnackBar,
    ){}
 
  ngOnInit() {
    // 初始化
    this.signalRSvc.StartConnection();    // 連接singalR 
    this.signalRSvc.ReceiveListener()?.on('DeliveryChange', (data) => {
      this.dataSource = new MatTableDataSource<any>(data)
    })
    this.onload()
  }

  onload() {
    // 載入
   this.api.getDelivery().subscribe((data:any) => {
    this.dataSource = new MatTableDataSource<any>(data)
   })
  }


  onSelect($event: any) {
    this.selected = $event;
  }

  open(){
    const modal = this.ngbModal.open(DeliveryModalComponent, {size: 'sm',});
    modal.componentInstance.title = '新增地點'
    modal.result.then(e => {
      if (e){
        // 關聯規格表和客戶資料
        console.log(e)
        this.api.addDelivery(e).subscribe(() =>{
          
        }); 
      }
    }).catch((error) => {
      console.log('Error in modal result:', error)
    })

  }

  delete(){
    const ref = this.snackbar.open('你確定要刪除嗎? (◍•ᴗ•◍)ゝ', '確定', {duration: 5000, panelClass:['alert-danger', 'alert'],})
    ref.onAction().subscribe(() =>{
      this.api.deleteDelivery(this.selected.id).subscribe(
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
    })
 
  }

}
