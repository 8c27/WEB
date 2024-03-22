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
  @Output() submitevent = new EventEmitter<any>();

  formGroup: FormGroup ;
  hideonbush: boolean = true;

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


 
}

