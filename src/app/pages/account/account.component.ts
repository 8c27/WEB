import { Component, OnInit , Input} from "@angular/core";
import { FeedService } from "src/app/services/feed.service";
import { SignalrService } from "src/app/services/signalr.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { MatTableDataSource } from "@angular/material/table";
import { ToastrService } from 'ngx-toastr';
import { tap } from "rxjs";
import { AccountModalConponent } from "./account-modal/account-modal.component";

@Component({
  selector: "app-account",
  templateUrl: "account.component.html",
  styleUrls: ["./account.component.scss"],
})


export class AccountComponent implements OnInit {

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
      // { name: 'id', displayName: '使用者ID' },
      { name: 'username', displayName: '使用者名稱' },
      { name: 'description', displayName: '敘述' },
      { name: 'roles', displayName: '角色職位', templateRef: 'roles' },
      { name: 'disabled', displayName: '是否停用', templateRef:'disabled'},
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
    roles: any[];

  constructor(public apiSvc: FeedService, public signalRSvc: SignalrService, private ngbModal: NgbModal, private toastr: ToastrService,
   ) {
  }

  ngOnInit() {

    this.onload()
  }

  onload() {
    this.apiSvc.readLoginRoles().subscribe(data => this.roles = data)
    this.apiSvc.readLoginInfo()
      .pipe(
        tap((data: any[]) => {
          this.dataSource = new MatTableDataSource<any>(data);
          this.loaded = true;
        })
      )
      .subscribe()
  }

  onSelect($event: any) {
    this.selected = $event;
    console.log(this.selected)
  }
  open(){
    const modal = this.ngbModal.open(AccountModalConponent, {size: 'md'});
    modal.componentInstance.title = '帳號資料'
    modal.componentInstance.roles = JSON.parse(JSON.stringify(this.roles));
    modal.result.then(e => {
      if (e){
        this.onload()
        this.apiSvc.addClient(e).subscribe(); 
      }
       
    }).catch((error) => {
      console.log('Error in modal result:', error);
    })
  }
  delete() {
      this.apiSvc.deleteClient(this.selected.id).subscribe(
        (respon) => {
            this.onload()
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
    if (this.selected){
      const modal = this.ngbModal.open(AccountModalConponent,  {size: 'md'});
      modal.componentInstance.title = '編輯帳號資料';
      modal.componentInstance.roles = JSON.parse(JSON.stringify(this.roles));
      modal.componentInstance.formData = this.selected;
      modal.result.then(e => {
        if(e){
            this.onload()
          this.apiSvc.editClient(e.id , e).subscribe(
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
