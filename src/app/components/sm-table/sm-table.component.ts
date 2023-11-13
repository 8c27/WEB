import { Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


export interface NamiTableConfig {
  sort?: NamiTableSort;
  serverSide?: boolean;
  checkable?: boolean;
  columns: NamiTableColumns[];
  templateRef:string;
}

export interface NamiTableSort {
  active: string;
  direction: 'asc' | 'desc';
  disableClear?: boolean;
}

export interface NamiTableColumns {
  name: string;
  displayName?: string;
  inVisible?: boolean;
  sticky?: boolean;
  stickyEnd?: boolean;
  sortable?: boolean;
}

@Component({
  selector: 'sm-table',
  templateUrl: './sm-table.component.html',
  styleUrls: ['./sm-table.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TableComponent),
      multi: true
    }
  ]
})
export class TableComponent implements OnInit, OnChanges {
  selectedId: number = -1;
  innerDataSource: any;


  @Input() translate_table: Map<string, string> | null = null;
  @Input() maxTableHeight!: string;
  @Input() minTableHeight!: string;
  @Input() config!: NamiTableConfig | any;
  @Input() templateRef!: TemplateRef<any>[];
  @Input() disabled!: boolean;
  @Input() search!: string;
  @Input() status: any;
  @Input() status_key: string = "status";
  @Output() select = new EventEmitter<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @Input() dataSource!: any;
  @Input() displayedColumns!: string[];

  translate_back: Map<string, string> | null = null;
  status_filter: string = "";

  temp_data: string[] = [];

  constructor() { }

  ngOnInit(): void {

  }
  filterStatus() {
    let test = this.dataSource as MatTableDataSource<any>;
    test.data = JSON.parse(JSON.stringify(this.temp_data.filter(data => data[this.status_key] == this.status_filter || this.status_filter == "")));
  }
  applyFilter(value) {
    if(!value){
      value=''
    }
    const filterValue = value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.search){
      if(changes.search.currentValue!==undefined){
        this.applyFilter(changes.search.currentValue)
      }
    }
    // Updating sort and paginator
    if (this.translate_table !== null) {
      this.translate_back = this.reverseMap(this.translate_table);
    }

    // Config Change event
    if (changes.config) {
      if (this.config) {
        // Check columns is hidden or banned
        if (this.config.checkable !== true || this.disabled){
          this.displayedColumns = [...this.config.columns.filter((a: any) => a.inVisible !== true).map((a:any) => a.name)];
        }
        else {
          this.displayedColumns = ['checkbox', ...this.config.columns.filter((a: any) => a.inVisible !== true).map((a:any) =>  a.name)];
        }
      }
      else {
        this.displayedColumns = [];
      }
    }

    if (changes.dataSource) {
      if (this.dataSource) {
        if (this.config.serverSide) {
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.innerDataSource = this.dataSource;
        }
        else {
          this.innerDataSource = new MatTableDataSource(this.dataSource);
          console.log("I am bug");
        }
        if (this.translate_table !== null) {
          this.innerDataSource.data.forEach((data: any) => {
            let keys = Object.keys(data);
            keys.forEach(key => {
              if (this.translate_table.has(data[key])) {
                data[key] = this.translate_table.get(data[key]);
              }
            });
          });
        }
        this.temp_data = JSON.parse(JSON.stringify(this.innerDataSource.data));
      }
      this.selectedId = -1;
    }
  }
  onSelect(row: any, i: number) {
    if (!this.disabled) {
      if (this.selectedId !== i) {
        let temp = JSON.parse(JSON.stringify(row));
        if (this.translate_back !== null) {
          let keys = Object.keys(temp);
          keys.forEach(key => {
            if (this.translate_back.has(temp[key]))
              temp[key] = this.translate_back.get(temp[key]);
            });
        }
        this.selectedId = i;
        this.select.emit(temp);
      }
      else {
        this.selectedId = -1;
        this.select.emit(null);
      }
    }
  }

  reverseMap(origin: Map<any, any>){
    return new Map(Array.from(this.translate_table, entry => [entry[1], entry[0]]));
  }
}
