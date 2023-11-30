import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
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
      itemNumber: [null],
      itemName: [null],
      stockId: [null, Validators.required], // 昇茂規格
      size: [null], // 頭部尺寸
      material: [null],    //材質
      pcs: [null],  //1kg幾支
      weight: [null],  //單重
      quantity: [null, Validators.required], // 數量
      cost: [null],   // 成本價
      raise: [0],   // 調漲單價
      class: ['加工'],  // 料別
      peel1: [null], // 剝皮
      peel2: [null], 
      typing: [null], // 打字別
      chamfer: [null], // 尾倒角
      hole1: [null], // 鑽孔
      hole2: [null], 
      ditch: [null], // 豬槽
      taper: [null], // 追度
      ear: [null],  // 打耳別
      special: [null], // 特殊別
      description: [null], // 備註
      machine:[null],  // 機台編號
      project: [null], // 加工項目
      mm: [null],  // 廖長
      isDeleted: [false , Validators.required],
      status: [false, Validators.required],
      feedNumber: [null], 
    })
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

