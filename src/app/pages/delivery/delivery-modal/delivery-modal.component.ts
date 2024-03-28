import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FeedService } from 'src/app/services/feed.service';

@Component({
  selector: 'app-delivery-modal',
  templateUrl: './delivery-modal.component.html',
  styleUrls: ['./delivery-modal.component.scss']
})
export class DeliveryModalComponent implements OnInit {
  @Input() title: String = "Feed";
  @Input() formData: any;
  @Output() submitevent = new EventEmitter<any>();

  formGroup: FormGroup ;
  constructor(
    public modal: NgbActiveModal,
    private fb: FormBuilder,
    public api : FeedService
  ) 
  { 
    this.formGroup = this.fb.group({
      id: [0],
      name: [null, Validators.required],
      status: [false, Validators.required],
    })
  }

  ngOnInit(): void {
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
