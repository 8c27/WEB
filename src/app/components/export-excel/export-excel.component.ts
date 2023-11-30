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

  data:any;
  fileName= 'ExcelSheet.xlsx'; 
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
}


