import { computeMsgId } from "@angular/compiler";
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from "@angular/core";
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
  @Input() stockList: any;
  @Input() clientList: any;
  @Input() placeList: any;
  @Input() type: any;
  @Output() submitevent = new EventEmitter<any>();
  filterStock: any
  formGroup: FormGroup ;
  hideonbush: boolean = true;
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
      weight: [0, Validators.required],  // 單重g
      isDeleted: [false , Validators.required],
      clientId: [null],
      material: [null],
      size: [null], 
      pcs: [null],
      cost: [null],
      raise: [0],
      class: ['加工'],
      peel1: [null],
      peel2: [null],
      typing: [null],
      chamfer: [null],
      hole1: [null],
      hole2: [null],
      ditch: [null],
      taper: [null],
      ear: [null],
      special: [null],
      mm: [null],
      place: [null],
      project: [null],
      omi: [null]
    })
  }

  ngOnInit() {
    if (this.formData){
      this.formGroup.patchValue(this.formData)
      if (this.type == 'add'){
        this.filterStock = this.stockList.filter(e => e.clientId == this.formData.clientId)
      }
    }
    if (this.type =='add'){
      this.formGroup.get('clientId').valueChanges.subscribe( e => {
        this.filterStock = this.stockList.filter(x => x.clientId == e)  
        if (this.formGroup.get('stockId')) this.formGroup.get('stockId').setValue(null);
      })
    }
  }
  isError(item: string) {
    return this.formGroup.get(item)?.invalid &&
      (this.formGroup.get(item)?.dirty || this.formGroup.get(item)?.touched)
  }
  errorType(item: string, type: string){
    return this.isError(item) && this.formGroup.get(item)?.hasError(type);
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
      console.log(data)
      this.modal.close(data)
  }

  cancel(){
    this.modal.close(false)
  }


 
}

