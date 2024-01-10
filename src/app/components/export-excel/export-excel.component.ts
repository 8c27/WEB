import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import * as XLSX from 'xlsx'; 

@Component({
  selector: "export-excel",
  templateUrl: "./export-excel.component.html",
  styleUrls: ["./export-excel.component.css"]
})


export class ExportExcelComponent implements OnInit {
  @Input()client: any
  days : any;
  nowTime: any;
  data:any;
  fileName= 'ExcelSheet.xlsx';
  options = 
  [
  '回廠', '忠光', '輯興', 
  '昱誠', '錦陽', '錳剛', 
  '冠昱', '立剛', '鑫興', 
  '振興--折彎', '鑫興--鑽孔',
  '春雨--折彎', '協昌--折彎',
  '忠光-茱銘', '輯興-源億',
  '冠昱-->鑫鎮業', '冠昱-->振傑'
  ] 
  constructor(private route: ActivatedRoute) {
   this.route.queryParams.subscribe( params =>{
    
    if(params){
      var json = params['json']
      this.data = JSON.parse(json);
      console.log(this.data)
    }
    }
   )

  }

    ngOnInit() {
    
      this.nowTime = new Date();
      this.formatTime()

    }
  formatTime(){
    var year = this.nowTime.getFullYear();
    var month = (this.nowTime.getMonth()+1).toString().padStart(2, '0');
    var day = this.nowTime.getDate().toString().padStart(2, '0')
    this.days = `${year}-${month}-${day}`;
  }

  exportexcel(): void 
    {
       /* table id is passed over here */   
       let element = document.getElementById('excel-table'); 
       const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

       /* generate workbook and add the worksheet */
       const wb: XLSX.WorkBook = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

       /* save to file */
       XLSX.writeFile(wb, this.fileName);
			
    }
    onSelectChange(){
      console.log(111)
    }
}


