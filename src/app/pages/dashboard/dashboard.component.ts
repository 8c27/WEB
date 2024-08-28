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
import { MatSnackBar } from "@angular/material/snack-bar";
import * as ExcelJS from 'exceljs'
import { saveAs } from 'file-saver';
import { buffer } from "rxjs";
@Component({
  selector: "app-dashboard",
  templateUrl: "dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})


export class DashboardComponent implements OnInit {

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
      { name: 'feedNumber', displayName: '訂單編號',width: 150 },
      { name: 'clientName', displayName: '廠商名稱', width: 200 },
      { name: 'stockNumber', displayName: '廠商編號', width: 250},
      { name: 'stockName', displayName: '昇貿規格', width: 250},  
      { name: 'project', displayName: '加工項目',width: 150 , templateRef: 'stock'},
      { name: 'quantity', displayName: '數量' }, 
      { name: 'raw', displayName: '進料數'},
    ]
  };
  subs: any;
  ticket: any;
  maxTableHeight = '100%';
  minTableHeight = 'unset';
  selected: any;
  checked: any;
  selectedItem: any[] = []
  loaded = false;
  status: Object;
  customers: Object;
  organizations: Object;
  proformas: Object;
  company: number;
  copydata: any;

  clientList:any;
  stockList: any;

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
    this.nowTime = new Date();
    this.formatTime()
    this.signalRSvc.StartConnection();    // 連接singalR 
    this.signalRSvc.ReceiveListener()?.on('FeedChange', (data) => {
      if (data.stock && data.stock.length > 0){
        data.project = data.stock[0].project
      }

      // 當 FeedChange 事件被監聽到有動作後, 就更新資料
      this.dataSource= new MatTableDataSource<any>(data.filter(e => e.status == false))
      this.copydata = [...this.dataSource.data]
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
  
    this.api.getFeed().subscribe( (e:any) =>{
      console.log(e)
      this.dataSource= new MatTableDataSource<any>(e.filter(i => i.status == false))
      this.copydata = [...this.dataSource.data]
    } ) //訂閱Feed資料
    this.api.getClient().subscribe( (e:any) =>this.clientList=e) //訂閱Client資料
    this.api.getStock().subscribe( (e:any) =>this.stockList=e) //訂閱Stock資料
   
  }

  formatTime(){
    var year = this.nowTime.getFullYear();
    var month = (this.nowTime.getMonth()+1).toString().padStart(2, '0');
    var day = this.nowTime.getDate().toString().padStart(2, '0')
    this.days = `${year}-${month}-${day}`;
  }

  onSelect($event: any) {
    this.selected = $event;
  }

  onCheck($event:any){
    this.checked = $event
  }

  open(){
    const modal = this.ngbModal.open(dashboardModalContent, {size: 'sm',});
    modal.componentInstance.title = '新增訂單'
    modal.componentInstance.clientList=this.clientList
    modal.componentInstance.stockList=this.stockList
    modal.componentInstance.showDiv = false
    modal.result.then(e => {
      if (e){
        // 關聯規格表和客戶資料
        console.log(e)
        this.api.addFeed(e).subscribe(
          
        ); 
      }
    }).catch((error) => {
      console.log('Error in modal result:', error)
    })

  }

  delete(){
    const ref = this.snackbar.open('你確定要刪除嗎?  記得確認訂單狀態(◍•ᴗ•◍)ゝ', '確定', {duration: 5000, panelClass:['alert-danger', 'alert'],})
    ref.onAction().subscribe(() =>{
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
    })
 
  }

  edit(){
    if(this.selected){
      const modal = this.ngbModal.open(dashboardModalContent , {size:'sm'});
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
  
  companySelect(){
    let newData = this.copydata.filter( e => 
      e.clientId == this.company 
    )
    // 更新數據
    this.dataSource.data = newData
  }

  clearSelect(){
    // 清空 搜尋條件
    if (this.company !== undefined ) {
      this.company = undefined
      this.onload()
    }
  }
  
  shipChange(){
    if(this.checked){
      for(let i of this.checked){
        let list = this.dataSource.data.filter(e => e.id == i).map(({ stock, ...rest }) => rest);
        console.log(list)
        list[0].status = true
        this.api.editFeed(list[0].id, list[0]).subscribe(
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
        )
      }
    }
  }
  
  export(){
    if (this.selected){
      this.selected.address = this.clientList.find(e => e.id == this.selected.clientId).address
      this.selected.number = this.clientList.find(e => e.id == this.selected.clientId).number
      console.log(this.selected)
    // 建立工作簿
    const wb = new ExcelJS.Workbook();
    // 建立工作表
    const ws = wb.addWorksheet('列印簿')

    // 合併儲存格
    ws.mergeCells('A1', 'I1')
    ws.mergeCells('C2', 'D2')
    ws.mergeCells('E2', 'H2')
    ws.mergeCells('B3', 'E3')
    ws.mergeCells('B4', 'E4')
    ws.mergeCells('G4', 'I4')
    ws.mergeCells('B5', 'I5')
    ws.mergeCells('B6', 'I6')
    ws.mergeCells('B7', 'I7')
    ws.mergeCells('B8', 'I8')
    ws.mergeCells('B9', 'E9')
    ws.mergeCells('B10', 'I10')
    ws.mergeCells('B11', 'E11')
    ws.mergeCells('G11', 'I11')
    ws.mergeCells('B12', 'E12')
    ws.mergeCells('G12', 'I12')

    // 設定欄位寬
    ws.getColumn('A').width = 14.37
    ws.getColumn('B').width = 17.87
    ws.getColumn('C').width = 8.25
    ws.getColumn('D').width = 7
    ws.getColumn('E').width = 4.37
    ws.getColumn('F').width = 13.12
    ws.getColumn('G').width = 9.25
    ws.getColumn('H').width = 11.75
    ws.getColumn('I').width = 16.87

    // 設置列高
    ws.getRow(1).height = 34.4
    ws.getRow(2).height = 24
    for (let i = 3; i<=11; i++){
      ws.getRow(i).height = 37.5
    }
    ws.getRow(12).height = 33.6

    // 字體設置
    const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']; // A到I的列標記
    columns.forEach( e => {
   
      ws.getColumn(e).eachCell({ includeEmpty: true }, (cell)=> {
        cell.alignment = {  vertical: 'middle', horizontal: 'left' }
      })
   
      for(let i= 3; i<=11; i++){
        ws.getCell(`${e}${i}`).border = {
          top: {style: 'thin'},
          left: {style: 'thin'},
          bottom: {style: 'thin'},
          right: {style: 'thin'},
        }
      }
    })
    ws.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center'}
    const G2Font = {
      name: '標楷體',
      family: 4,
      size: 14,
      italic: true,
    }
    const titleFont = {
      name: '標楷體',
      family: 4,
      size: 16,
    }
    const fixedFont = {
      name: '標楷體',
      family: 4,
      size: 12, 
    }
    const insertFont = {
      name: '標楷體',
      family: 4,
      size: 16, 
    }
    ws.getCell('A1').font = titleFont
    for (let i = 2; i<=12; i++){
      ws.getCell(`A${i}`).font = fixedFont
    }
    ws.getCell('B2').font = fixedFont
    for (let i = 3; i<=12; i++){
      ws.getCell(`B${i}`).font = insertFont
    }
    ws.getCell('C2').font = fixedFont
    ws.getCell('E2').font = fixedFont
    ws.getCell('I2').font = G2Font
    ws.getCell('G3').font = insertFont
    ws.getCell('G4').font = insertFont
    ws.getCell('G9').font = insertFont
    ws.getCell('G11').font = insertFont
    ws.getCell('G12').font = insertFont
    ws.getCell('H3').font = fixedFont
    ws.getCell('H4').font = fixedFont
    ws.getCell('F3').font = fixedFont
    ws.getCell('F4').font = fixedFont
    ws.getCell('F9').font = fixedFont
    ws.getCell('H9').font = fixedFont
    ws.getCell('F11').font = fixedFont
    ws.getCell('F12').font = fixedFont
    ws.getCell('I3').font = insertFont
    ws.getCell('I9').font = insertFont
    ws.getCell('I4').font = insertFont

    // 賦值
    ws.getCell('A1').value = '昇 貿 工業股份有限公司'
    ws.getCell('C2').value = '廠商編號'
    ws.getCell('I2').value = '製程加工單'
    ws.getCell('A2').value = '訂單編號'
    ws.getCell('A3').value = '加工類別'
    ws.getCell('F3').value = '料別'
    ws.getCell('H3').value = '料長:mm'
    ws.getCell('A4').value = '頭部尺寸'
    ws.getCell('F4').value = '注意事項'
    ws.getCell('A5').value = '昇貿規格'
    ws.getCell('A6').value = '剝皮'    
    ws.getCell('A7').value = '尾加工' 
    ws.getCell('A8').value = '備註' 
    ws.getCell('A9').value = '數量'
    ws.getCell('F9').value = '材質'
    ws.getCell('H9').value = '進料數'
    ws.getCell('A10').value = '加工項目'
    ws.getCell('A11').value = '出貨廠商'
    ws.getCell('F11').value = '指送地點'
    ws.getCell('A12').value = '開單日期'
    ws.getCell('F12').value = '經辦人' 
    ws.getCell('G12').value = '許先生'   // 未來改為帳號使用者名稱
    // 填入欄位
    const cellValues = [
      { cell: 'B2', value: this.selected.feedNumber },
      { cell: 'B3', value: this.selected.stock[0].omi},
      { cell: 'B4', value: this.selected.stock[0].size },
      { cell: 'B5', value: this.selected.stockName },
      {
        cell: 'B6',
        value: [
          this.selected.stock[0].peel1,
          this.selected.stock[0].peel2,
          this.selected.stock[0].ditch
        ].filter(item => item).join('、') || ''
      },
      { cell: 'B7',
        value: [
          this.selected.stock[0].ear,
          this.selected.stock[0].chamfer,
        ].filter(item => item).join('、') || ''
      },
      { 
        cell: 'B8',        
        value: [
          this.selected.stock[0].taper,
          this.selected.stock[0].hole1,
          this.selected.stock[0].hole2,
          this.selected.stock[0].typing,
          this.selected.stock[0].special,
       
        ].filter(item => item).join('、') || ''
      },
      { cell: 'B9', value: this.selected.quantity },
      { cell: 'B10', value: this.selected.stock[0].project},
      { cell: 'B11', value: this.selected.clientName + ' ' + this.selected.number},
      { cell: 'B12', value: this.days},
      { cell: 'E2', value: this.selected.stock[0].stockNumber},
      { cell: 'G3', value: this.selected.stock[0].class},
      { cell: 'G4', value: this.selected.description ? `(${this.selected.description})` : null},
      { cell: 'G9', value: this.selected.stock[0].material},
      { cell: 'G11', value: this.selected.stock[0].place},
      { cell: 'I3', value: this.selected.stock[0].mm},
      { cell: 'I9', value: this.selected.raw},
    ]
    cellValues.forEach( cv => {
      ws.getCell(cv.cell).value = cv.value == null ? '': cv.value
    })

    // 保存文件
    wb.xlsx.writeBuffer().then( buffer => {
      const blob = new Blob([buffer], {type:  "application/vnd.ms-excel;charset=utf-8;" })
      saveAs.saveAs(blob, 'output.xlsx');
    })
    }  
  }

}
