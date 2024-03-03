import { Component, OnInit , Input} from "@angular/core";
import { FeedService } from "src/app/services/feed.service";
import { SignalrService } from "src/app/services/signalr.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { MatTableDataSource } from "@angular/material/table";
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from "@angular/material/snack-bar";
import * as ExcelJS from 'exceljs'
import { saveAs } from 'file-saver';
@Component({
  selector: "app-ship",
  templateUrl: "ship.component.html",
  styleUrls: ["./ship.component.scss"],
})



export class ShipComponent implements OnInit {

    days : any;
    nowTime: any;
    feedList: any;  // feed =>feed資料庫
    clientList:any;
    stockList: any;
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
          { name: 'feedNumber', displayName: '訂單編號' },
          { name: 'clientName', displayName: '廠商名稱', width: 200 },
          { name: 'stockName', displayName: '昇茂規格', width: 200},  
          { name: 'quantity', displayName: '數量', width: 100 }, 
          { name: 'project', displayName: '加工項目' },
          { name: 'class', displayName: '料別'},
          { name: 'creationTime', displayName: '訂單日期', templateRef: 'date' , width: 120},
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
    shipList: any;
    copydata: any;
    company: any;
    dateTo: Date | null;
    dateFm: Date| null;
    newData: any;
    newData2: any;
    finalData: any;
    constructor(
        public api: FeedService,
        public signalRSvc: SignalrService, 
        private ngbModal: NgbModal, 
        private toastr: ToastrService,
        private snackbar: MatSnackBar,
    ) 
    {
    }

  ngOnInit() {
    // 初始化
    this.signalRSvc.StartConnection();    // 連接singalR 
    this.signalRSvc.ReceiveListener()?.on('FeedChange', (data) => {
      // 當 FeedChange 事件被監聽到有動作後, 就更新資料
      this.feedList = data.filter( g => g.status == true)
      this.dataSource= new MatTableDataSource<any>(this.feedList)
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
    this.api.getFeed().subscribe( (e:any) => {
      this.feedList = e.filter( g => g.status == true)
      this.dataSource= new MatTableDataSource<any>(this.feedList)
      this.copydata = [...this.dataSource.data]
    }) //訂閱Feed資料
    this.api.getClient().subscribe( (e:any) =>this.clientList=e) //訂閱Client資料
    this.api.getStock().subscribe( (e:any) =>this.stockList=e) //訂閱Stock資料
  }

  onSelect($event: any) {
    this.selected = $event;
  }
  
  onDateChange() {
    if (this.dateFm && this.dateTo) {
      this.dateTo.setHours(23, 59, 59, 999);
      this.newData = this.copydata.filter( e => {
        let itemDate = new Date(e.creationTime)
        return itemDate >=　this.dateFm && itemDate <= this.dateTo
      })
      // 更新數據
      this.dataSource.data = this.newData
      this.newData2 = [...this.newData]
    }
  }

  companySelect(){
    if (this.company){
      this.onDateChange()
      this.finalData = this.newData2.filter( e => {return e.clientId == this.company} )
      // 更新數據
      this.dataSource.data = this.finalData
    }
  }

  clearSelect(){
      // 清空 搜尋條件
      if (this.dateFm !== undefined || this.dateFm !== undefined || this.company !== undefined) {
        this.dateFm = undefined
        this.dateTo = undefined
        this.company = undefined
        this.onload()
      }
  }


  export(){
    console.log(this.finalData)
    if (this.finalData){
      // 建立工作簿
      const wb = new ExcelJS.Workbook();
      // 建立工作表
      const ws = wb.addWorksheet('出貨單')

      // 字體家族
  
      const ltdFont = {
        name: '標楷體',
        family: 4,
        bold: true,
        size: 16,
      }
      const titleFont = {
        name: '標楷體',
        family: 4,
        bold: true,
        size: 20, 
      }
      const headerFont = {
        name: '標楷體',
        family: 4,
        size: 12, 
      }
      const valueFont = {
        name: '標楷體',
        family: 4,
        size: 10,
      }

      // 固定表頭
      ws.mergeCells('D1', 'G1')
      ws.mergeCells('E2', 'G2')
      ws.mergeCells('E3', 'G3')
      ws.mergeCells('E4', 'G4')
      ws.mergeCells('D2', 'D4')
      ws.mergeCells('A4', 'C4')

      ws.getCell('D1').value = '昇貿工業股份有限公司'
      ws.getCell('D1').font = ltdFont
      ws.getCell('D1').alignment = { vertical: 'middle', horizontal: 'right' };
      ws.getCell('E2').value = '南投市工業南路三段3號'
      ws.getCell('E3').value = 'TEL:049-2256579'
      ws.getCell('E3').alignment = { vertical: 'middle', horizontal: 'right' };
      ws.getCell('E4').value = 'FAX:049-2260067'
      ws.getCell('E4').alignment = { vertical: 'middle', horizontal: 'right' };
      ws.getCell('D2').value = '銷售明細-出貨表'
      ws.getCell('D2').font = titleFont
      ws.getCell('D2').alignment = { vertical: 'middle', horizontal: 'center' };
      const today = new Date()
      const foramttedDate = `${today.getFullYear()}/${today.getMonth()+1}/${today.getDate()}`
      ws.getCell('A4').value = `製表日期: ${foramttedDate}`

      ws.getColumn('A').width = 12.5
      ws.getColumn('B').width = 12.5
      ws.getColumn('C').width = 12.5
      ws.getColumn('D').width = 33.38
      ws.getColumn('E').width = 8.38
      ws.getColumn('F').width = 8.38
      ws.getColumn('G').width = 8.38

      ws.getRow(1).height = 22.2
      for(let i = 2; i < 4; i++){
        ws.getRow(i).height = 20.4
      }

      // 資料帶入
      const header = ['公司', '日期', '憑單', '品名規格', '數量', '單價', '金額']
      const initData = ['clientName', 'creationTime', 'itemNumber', 'stockName', 'quantity', 'cost'];
      const headerRow = ws.addRow(header)
      headerRow.height = 36
      headerRow.font = headerFont
      headerRow.eachCell({ includeEmpty: true }, (cell, colNumber)=> {
        cell.alignment = {  vertical: 'middle', horizontal: 'center' }

        if (colNumber >= 2 && colNumber <=7){
          cell.border = {
            left: {style:'thin', color: {argb:'FF000000'}},
            top: {style:'thin', color: {argb:'FF000000'}},
            bottom: {style:'thin', color: {argb:'FF000000'}}
          }  
        }else {
          cell.border = {
            top: {style:'thin', color: {argb:'FF000000'}},
            bottom: {style:'thin', color: {argb:'FF000000'}}
          };
        }
      })
      
      let totalQuantity = 0
      let totalAmount = 0
      console.log(this.finalData)
      this.finalData.forEach( data => {
        // 計算總金額和數量ˋ
        totalAmount += data.quantity * data.cost
        totalQuantity += data.quantity 
        const amount = data.quantity * data.cost 

        // 過濾時間格式
        const date = data.creationTime.split('T')[0]  //分割ISO8001格式
        const row = initData.map( e =>{
          if (e == 'creationTime') return date
          else return data[e]
        })
        row.push(amount)
        const dataRow = ws.addRow(row)
        dataRow.height  = 31.8
        dataRow.font = valueFont
        dataRow.eachCell( {includeEmpty: true}, (cell , colNumber) => {
          cell.alignment = {
            vertical: 'middle',  // 垂直置中
            horizontal: 'center', // 水平置中
            wrapText: true       // 啟用自動換行
          };
        })
      }) 

      // 頁角
      const feet = ws.addRow(['', '', '', '', totalQuantity, '', totalAmount]);
      feet.height = 36;
      feet.font = headerFont;
      feet.eachCell( { includeEmpty: true}, (cell, colNumber)=>{
        cell.border = {
          top: {style:'thin', color: {argb:'FF000000'}},
          bottom: {style:'thin', color: {argb:'FF000000'}}
        };
      })
      // 設置單元格合併，這裡只合併A列到D列，因為E列和G列將顯示總數量和總金額
      ws.mergeCells(`A${feet.number}:D${feet.number}`);
      ws.getCell(`A${feet.number}`).value  = '總合計:'
      ws.getCell(`A${feet.number}`).alignment  = { vertical: 'middle'}
      ws.getCell(`E${feet.number}`).alignment  = { vertical: 'middle', horizontal: 'center'}
      ws.getCell(`G${feet.number}`).alignment  = { vertical: 'middle', horizontal: 'center'}

      // 保存文件
      wb.xlsx.writeBuffer().then( buffer => {
      const blob = new Blob([buffer], {type:  "application/vnd.ms-excel;charset=utf-8;" })
      saveAs.saveAs(blob, '出貨單.xlsx');
      })
    }else {
      this.toastr.error(
        '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">' +
        '請選擇日期範圍和廠商'
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

}
