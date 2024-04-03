import { Component, EventEmitter, HostListener, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, Validators, FormGroup  } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { tap } from "rxjs/operators";
import { FeedService } from "src/app/services/feed.service";


@Component({
  selector: "app-client-modal",
  templateUrl: "client-modal.component.html",
  styleUrls: ["./client-modal.component.scss"]
})
export class ClientModalConponent implements OnInit {
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
      creationTime: [null],
      number: [null, Validators.required],
      name: [null, Validators.required],
      address: [null, Validators.required],
      invoice: [null],
      person: [null],
      telephone: [null],
      mobile: [null],
      compiled: [null],
      description: [null],
      ltd: [null, Validators.required],
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

