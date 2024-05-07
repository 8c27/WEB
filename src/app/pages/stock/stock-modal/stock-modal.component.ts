import { computeMsgId } from "@angular/compiler";
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, Validators, FormGroup, RequiredValidator  } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { tap } from "rxjs/operators";
import { FeedService } from "src/app/services/feed.service";
import { PhotoService } from "src/app/services/photo.service";


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
  showDiv:boolean = true; // 照片功能不顯示
  filterStock: any
  formGroup: FormGroup ;
  hideonbush: boolean = true;
  showPdf: boolean = false;
  img: any;

  // pdf-viewer 設置
  @ViewChild('pdfViewerContainer') pdfViewerContainer: ElementRef;
  rotation = 0; 
  zoom = 1 
  dragging = false;
  lastX = 0;
  lastY = 0;

  constructor(
    public modal: NgbActiveModal,
    private fb: FormBuilder,
    public api: FeedService,
    public photo : PhotoService,
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
    this.photo.sitedata=null
    if (this.formData){
      this.formGroup.patchValue(this.formData)
      this.photo.sitedata = this.formData
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
  imgchange(e){
    this.img = e
  }

  rotateClockwise() {
    this.rotation += 90; // 每次点击增加90度
  }
  
  zoomIn() {
    this.zoom *= 1.1; // 放大10%
  }

  zoomOut() {
    this.zoom *= 0.9; // 缩小10%
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.dragging = true;
    this.lastX = event.clientX;
    this.lastY = event.clientY;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.dragging) {
      const dx = event.clientX - this.lastX;
      const dy = event.clientY - this.lastY;
      const container = this.pdfViewerContainer.nativeElement;
      container.scrollLeft -= dx;
      container.scrollTop -= dy;
      this.lastX = event.clientX;
      this.lastY = event.clientY;
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.dragging = false;
  }
}

