import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, Validators, FormGroup, RequiredValidator  } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { tap } from "rxjs/operators";
import { FeedService } from "src/app/services/feed.service";


@Component({
  selector: "app-stock-modal",
  templateUrl: "stock-modal.component.html",
  styleUrls: ["./stock-modal.component.scss"]
})
export class StockModalConponent implements OnInit {
  @Input() title: String = "Feed";
  @Input() formData: any;

  @Output() submitevent = new EventEmitter<any>();

  formGroup: FormGroup ;
  
  constructor(
    public modal: NgbActiveModal,
    private fb: FormBuilder,
    public api: FeedService,
    
  ) { 
    this.formGroup = this.fb.group({
      id: [0],
      updateTime: [null], // 更新時間
      stockName: [null, Validators.required], // 昇貿規格
      finishAmount: [0], //完成數量  
      weight: [null, Validators.required],  // 單重g
      isDeleted: [false , Validators.required],
    })
  }

  ngOnInit() {
    if (this.formData){
      this.formGroup.patchValue(this.formData)
    }
      
  }
  isError(item: string) {
    return this.formGroup.get(item)?.invalid &&
      (this.formGroup.get(item)?.dirty || this.formGroup.get(item)?.touched)
  }
  errorType(item: string, type: string){
    return this.isError(item) && this.formGroup.get(item)?.hasError(type);
  }

  save(){
      let data = this.formGroup.getRawValue();
      this.modal.close(data)
  }

  cancel(){
    this.modal.close(false)
  }


 
}

