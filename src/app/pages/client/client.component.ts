import { Component, OnInit , Input} from "@angular/core";
import { FeedService } from "src/app/services/feed.service";
import { SignalrService } from "src/app/services/signalr.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { MatTableDataSource } from "@angular/material/table";
import { ClientModalConponent } from "./client-modal/client-modal.component";
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-client",
  templateUrl: "client.component.html",
  styleUrls: ["./client.component.scss"],
})


export class ClientComponent implements OnInit {

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
      { name: 'number', displayName: '廠商編號'},
      { name: 'name', displayName: '廠商名稱',width:200 },
      { name: 'address', displayName: '地址', width:300},
      { name: 'person', displayName: '聯絡人',width: 120},   
      { name: 'telephone', displayName: '聯絡電話', width: 120},
      { name: 'mobile', displayName: '傳真', width: 120 },
      { name: 'compiled', displayName: '統編'},
      { name: 'description', displayName: '備註'},
      { name: 'creationTime', displayName: '創建日期', templateRef: 'date',width:120 },
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

  constructor(
    public api: FeedService, 
    public signalRSvc: SignalrService, 
    private ngbModal: NgbModal, 
    private toastr: ToastrService,
    private snackbar: MatSnackBar,
   ) {
  }

  ngOnInit() {
    // 初始化
    this.signalRSvc.StartConnection();    // 連接singalR 
    this.signalRSvc.ReceiveListener()?.on('ClientChange', (data) => {
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
    this.api.getClient().subscribe( (e:any) => this.dataSource= new MatTableDataSource<any>(e)) //訂閱Client資料
  }

  onSelect($event: any) {
    this.selected = $event;
    console.log(this.selected)
  }
  open(){
    const modal = this.ngbModal.open(ClientModalConponent, {size: 'md'});
    modal.componentInstance.title = '客戶資料'
    modal.result.then(e => {
      if (e)
        this.api.addClient(e).subscribe(); 
    }).catch((error) => {
      console.log('Error in modal result:', error);
    })
  }
  delete() {
    const ref = this.snackbar.open('你確定要刪除嗎(◍•ᴗ•◍)ゝ', '確定', {duration: 5000, panelClass:['alert-danger', 'alert'],})
    ref.onAction().subscribe(() =>{
      this.api.deleteClient(this.selected.id).subscribe(
        (respon) => {
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
  edit(){
    if (this.selected){
      const modal = this.ngbModal.open(ClientModalConponent,  {size: 'md'});
      modal.componentInstance.title = '編輯客戶資料';
      modal.componentInstance.formData = this.selected;
      modal.result.then(e => {
        if(e){
          this.api.editClient(e.id , e).subscribe(
            (respon) => {
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
            }
          ); 
        }
      }).catch( (error) => {
        console.log('Error in Modal:', error)
      })
    }

  }
  
}
