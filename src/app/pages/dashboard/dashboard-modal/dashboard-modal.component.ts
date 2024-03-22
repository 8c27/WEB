import { Component, EventEmitter, Input, OnInit, Output, ɵɵtrustConstantHtml, HostListener  } from "@angular/core";
import { FormBuilder, Validators, FormGroup  } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { tap } from "rxjs/operators";
import { FeedService } from "src/app/services/feed.service";
import { PhotoService } from "src/app/services/photo.service";


@Component({
  selector: "app-dashboard-modal",
  templateUrl: "dashboard-modal.component.html",
  styleUrls: ["./dashboard-modal.component.scss"]
})
export class dashboardModalContent implements OnInit {
  @Input() title: String = "Feed";
  @Input() formData: any;
  @Input() clientList: any;
  @Input() stockList: any;
  @Output() submitevent = new EventEmitter<any>();
  formGroup: any ;
  filterStock: any
  placeList = [
    '回廠',
    '忠光',
    '輯興',
    '昱誠',
    '錦陽',
    '錳剛',
    '冠昱',
    '立剛',
    '鑫興',
    '協昌--折彎',
    '忠光-茱銘',
    '輯興-源億',
    '振興--折彎',
    '鑫新--鑽孔',
    '春雨--折彎',
    '冠昱-->鑫鎮業',
    '冠昱-->振傑'
  ]
  showDiv:boolean = true; // 照片功能不顯示

  constructor(
    public modal: NgbActiveModal,
    private fb: FormBuilder,
    public api: FeedService,
    public photo : PhotoService
  ) { 
    this.formGroup = this.fb.group({
      id: [0],
      creationTime: [null],
      clientId: [null, Validators.required], // 廠商ID
      stockId: [null, Validators.required], // 昇茂規格
      weight: [null],  //訂單總重
      quantity: [null, Validators.required], // 數量
      description: [null], // 備註
      machine:[null],  // 機台編號
      isDeleted: [false , Validators.required],
      status: [false, Validators.required],
      feedNumber: [null],
      raw: [null],
    })
  }
  log(){
    console.log(777)
  }
  isError(item: string) {
    // 檢查item有無被修改或被觸碰過
    return this.formGroup.get(item)?.invalid &&
      (this.formGroup.get(item)?.dirty || this.formGroup.get(item)?.touched)
  }
  errorType(item: string, type: string){
    return this.isError(item) && this.formGroup.get(item)?.hasError(type);
  }

  ngOnInit() {
    this.photo.sitedata=null
    if (this.formData){
      this.formGroup.patchValue(this.formData)
      this.photo.sitedata = this.formData
      this.filterStock = this.stockList.filter(e => e.clientId == this.formData.clientId)
    }
    this.formGroup.get('clientId').valueChanges.subscribe( e => {
      this.filterStock = this.stockList.filter(x => x.clientId == e)  
      if (this.formGroup.get('stockId')) this.formGroup.get('stockId').setValue(null);
    })
 
  }
  @HostListener('window:keydown.enter', ['$event'])
  enterKey(event: KeyboardEvent){
    event.preventDefault();
    // 调用保存方法
    if (this.formGroup.valid && !this.formGroup.pristine) {
      this.save();
    }
  }

  save(){
      let data = this.formGroup.getRawValue();
      this.modal.close(data)
  }

  cancel(){
    this.modal.close(false)
  }

  controllStatus(){
    this.formData.status = !this.formData.status;
    console.log(this.formData.status)
  }

 
}

